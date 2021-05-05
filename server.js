const express = require("express");
const app = express();
const path = require("path");
const schedule = require("node-schedule");
const User = require("./src/models/user");
const userRouter = require("./src/routes/user");
const { default: axios } = require("axios");
const { gotSlots } = require("./src/email/gotSlots");
const client = require("twilio")(process.env.TWILIO_AUTHSID, process.env.TWILIO_AUTHTOKEN);

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
let calendarByDis =
  "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict";

const job = schedule.scheduleJob("*/1 * * * *", async () => {
  try {
    const users = await User.find({ served: false }).lean();
    let timeElapsed = Date.now();
    let today = new Date(timeElapsed);
    today = today.toLocaleDateString();
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      let sessionsFound = [];
      let res;
      if (user.pincode) {
        res = await axios.get(`${calendarByPin}?pincode=${user.pincode}&date=${today}`, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36",
          },
        });
      } else {
        res = await axios.get(`${calendarByDis}?district_id=${user.district}&date=${today}`, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36",
          },
        });
      }
      for (let i = 0; i < res.data.centers.length; i++) {
        const center = res.data.centers[i];
        for (let j = 0; j < center.sessions.length; j++) {
          const session = center.sessions[j];
          if (session.available_capacity > 0 && session.min_age_limit < user.age) {
            sessionsFound = [...sessionsFound, { center, session }];
          }
        }
      }
      if (sessionsFound.length > 0) {
        let email = gotSlots(user, sessionsFound);
        client.messages
          .create({
            body: `Hello ${
              user.name
            },\nhttp://vaccfied.me found out some slots for you to get vaccinated. \n\n${sessionsFound.map(
              ({ center, session }) => {
                return `Date/Time: ${session.date}/${center.from}-${center.to}\nName: ${center.name}, ${center.address},${center.district_name}, ${center.state_name} - ${center.pincode}\nVaccine Name: ${session.vaccine}\nAge Limit: Min ${session.min_age_limit}\n\n`;
              }
            )}Hurry, visit https://selfregistration.cowin.gov.in/ to registed they are filling fast. \n\nTill then stay safe!\nFrom Vaccfied!`,
            from: "whatsapp:+14155238886",
            to: `whatsapp:+91${user.phoneno}`,
          })
          .then((message) => console.log(message.sid))
          .done();
        if (email.success) {
          await User.findByIdAndUpdate(user._id, { served: true });
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
});

const server = require("http").createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
