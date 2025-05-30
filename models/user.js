const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [30, 'Name must be at most 30 characters'],
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required." ],
    validate: {
      validator(value) {
        return validator.isURL(value, { protocols: ['http','https'], require_protocol: true });
      },
      message: 'You must enter a valid URL',
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: 'You must enter a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error("Incorrect email or password"));
          }
          return user;
        });
    });
  }

module.exports = mongoose.model("user", userSchema);