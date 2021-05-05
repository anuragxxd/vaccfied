const User = require("../models/user");
const express = require("express");
const router = new express.Router();

router.post("/api/users", async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
      pincode: req.body.pincode,
    });
    await user.save();
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
