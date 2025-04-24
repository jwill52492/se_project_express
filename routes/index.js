const router = require('express').Router();

const userRouter = require('./users');
const itemsRouter = require('./clothingitems');
const { NOT_FOUND } = require('../utils/errors');
const { createUser, login } = require('../controllers/users');

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", userRouter);
router.use("/items", itemsRouter);
router.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "User or Item not found" })
);

module.exports = router;