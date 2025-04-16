const router = require("express").Router();
const { getClothingItems, createClothingItems, deleteClothingItems, likeClothingItems, dislikeClothingItems } = require("../controllers/clothingitems.js");

router.get("/", getClothingItems);
router.post("/", createClothingItems);
router.delete("/items/:itemId", deleteClothingItems);
router.put("/items/:itemId/likes", likeClothingItems);
router.delete("/items/:itemId/likes", dislikeClothingItems);

module.exports = router;