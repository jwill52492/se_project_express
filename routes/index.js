const router = require('express').Router();

const userRouter = require('./users');
const itemsRouter = require('./clothingitems');


router.use("/users", userRouter);
router.use("/items", itemsRouter);
router.use((req, res) => {
  const { NOT_FOUND } = req.params
  return res.status(NOT_FOUND).send({ message: "User or Item not found" });
});

module.exports = router;