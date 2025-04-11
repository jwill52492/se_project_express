const user = require('../models/user');

const getUsers = (req, res) => {
  user.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
    });
}

module.exports = { getUsers };