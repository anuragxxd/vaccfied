const User = require("../models/user");

router.post("/api/users", async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
      pincode: req.body.pincode,
    });
    user.save();
    res.status(201).send();
  } catch (e) {
    res.status(403).send({ error: e });
  }
});

module.exports = router;
