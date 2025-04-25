const router = require("express").Router();
const authMiddleware = require('../middlewares/auth');
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, updateUser);

module.exports = router;