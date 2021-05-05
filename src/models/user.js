const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      trim: true,
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email invalid");
        }
      },
    },
    age: {
      type: Number,
      required: true,
    },
    pincode: {
      type: Number,
    },
    district: {
      type: Number,
    },
    phoneno: {
      type: Number,
    },
    served: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
