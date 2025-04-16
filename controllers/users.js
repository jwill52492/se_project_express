const User = require('../models/user');
const err = require('../utils/errors');

const getUsers = (req, res) => {
  const { userId } = req.params;

  User.find({ userId })
    .orFail()
    .then((users) => res.status().send(users))
    .catch((err) => {
      console.error(err);
      return res.status().send({ message: err.message });
    });
}

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status().send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status().send({ message: err.message });
      }
    });
}

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status().send({ message: err.message });
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status().send({ message: err.message });
      }
      return res.status().send({ message: err.message });
    });
}

module.exports = { getUsers, createUser, getUser };