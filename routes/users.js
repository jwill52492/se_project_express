const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users.js");

router.get("/", getUsers);
router.get("/users/:userId", getUser);
router.post("/", createUser);

module.exports = router;