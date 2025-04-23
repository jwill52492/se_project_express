const router = require('express').Router();

const userRouter = require('./users');
const itemsRouter = require('./clothingitems');
const { NOT_FOUND } = require('../utils/errors');
const { login, createUser } = require('../controllers/users');

router.use("/users", userRouter);
router.use("/items", itemsRouter);
router.use((req, res) =>
  res.status(NOT_FOUND).send({ message: "User or Item not found" })
);

app.post("/signin", login);
app.post("/signup", createUser);

module.exports = router;