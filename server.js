const express = require("express");
const app = express();
const path = require("path");
const schedule = require("node-schedule");
const User = require("./src/models/user");
const userRouter = require("./src/routes/user");
const { default: axios } = require("axios");
const { gotSlots } = require("./src/email/gotSlots");

require("./src/db/mongoose");

app.use(express.json());
app.use(userRouter);

app.use("/hello", (req, res) => {
  res.send({ hello: "hello" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

let calendarByPin = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin";

const job = schedule.scheduleJob("*/1 * * * *", async () => {
  const users = await User.find({ served: false }).lean();
  console.log(users);
  let timeElapsed = Date.now();
  let today = new Date(timeElapsed);
  today = today.toLocaleDateString();
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    let sessionsFound = [];
    let res = await axios.get(`${calendarByPin}?pincode=${user.pincode}&date=${today}`);
    for (let i = 0; i < res.data.centers.length; i++) {
      const center = res.data.centers[i];
      for (let j = 0; j < center.sessions.length; j++) {
        const session = center.sessions[j];
        if (session.available_capacity > 0 && session.min_age_limit < user.age) {
          sessionsFound = [...sessionsFound, { center, session }];
        }
      }
    }
    console.log(user, sessionsFound);
    if (sessionsFound.length > 0) {
      let email = gotSlots(user, sessionsFound);
      if (email.success) {
        await User.findByIdAndUpdate(user._id, { served: true });
      }
    }
  }
});

const server = require("http").createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
