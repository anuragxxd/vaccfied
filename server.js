const express = require("express");
const app = express();
const path = require("path");
const schedule = require("node-schedule");
const userRouter = require("./src/routes/user");

require("./src/db/mongoose");

app.use(express.json());
app.use(userRouter);

app.use("/", (req, res) => {
  res.send({ hello: "hello" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const job = schedule.scheduleJob("*/10 * * * * *", function () {
  console.log("The answer to life, the universe, and everything!");
});

const server = require("http").createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
