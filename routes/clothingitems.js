const router = require("express").Router();
const authMiddleware = require('../middlewares/auth');
const { getClothingItems, createClothingItems, deleteClothingItems, likeClothingItems, dislikeClothingItems } = require("../controllers/clothingitems");

router.get("/", getClothingItems);
router.post("/", authMiddleware, createClothingItems);
router.delete("/:itemId", authMiddleware, deleteClothingItems);
router.put("/:itemId/likes", authMiddleware, likeClothingItems);
router.delete("/:itemId/likes", authMiddleware, dislikeClothingItems);

module.exports = router;