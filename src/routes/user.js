const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const client = require("twilio")(process.env.TWILIO_AUTHSID, process.env.TWILIO_AUTHTOKEN);

router.post("/api/users", async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
      pincode: req.body.pincode,
      phoneno: req.body.phoneno,
    });
    await user.save();
    client.messages
      .create({
        body: `Hello ${user.name},\nGood to see to on http://vaccfied.me. Yeah, we know cowin portal sucks. So, We will nofify you when vaccine will be avaliable in your location.\n\nTill then stay safe!\nFrom Vaccfied!`,
        from: "whatsapp:+14155238886",
        to: `whatsapp:+91${user.phoneno}`,
      })
      .then((message) => console.log(message.sid))
      .done();
    res.status(201).send();
  } catch (e) {
    res.status(403).send({ error: e });
  }
});

router.post("/api/users/district", async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
      district: req.body.district,
    });
    await user.save();
    res.status(201).send();
  } catch (e) {
    res.status(403).send({ error: e });
  }
});

module.exports = router;
