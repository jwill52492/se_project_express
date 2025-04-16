const router = require('express').Router();

const userRouter = require('./users.js');

router.use("/users.js", userRouter);

module.exports = router;