const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, CONFLICT, UNAUTHORIZED } = require('../utils/errors');



const getUsers = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials({ email }).select("+password")
    .then((user) => {
      if (!user) {
        return res.status(UNAUTHORIZED).send({ message: "Unauthorized email or password" });
      }
      return bcrypt.compare(password, user.password);
    })
    .then((user) => {
      if (!user) {
        return res.status(UNAUTHORIZED).send({ message: "Unauthorized email or password" });
      }
      const userCopy = user.toObject();
      delete userCopy.password;
      return res.status(OK).send({ userCopy });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(OK).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "User with this email already exists" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
}

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.create({ name, avatar, email, password })
    bcrypt.hash(password, 10)
    .then(hash => User.create({ name, avatar, email, password: hash }))
    .then((user) => res.status(CREATED).send({ _id: user._id, email: user.email }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "User with this email already exists" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
}

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
}

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(_id, { name, avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
}

module.exports = { getUsers, createUser, getCurrentUser, updateUser };