const router = require("express").Router();
const { getClothingItems, createClothingItems, deleteClothingItems, likeClothingItems, dislikeClothingItems } = require("../controllers/clothingitems");

router.get("/", getClothingItems);
router.post("/", createClothingItems);
router.delete("/:itemId", deleteClothingItems);
router.put("/:itemId/likes", likeClothingItems);
router.delete("/:itemId/likes", dislikeClothingItems);

module.exports = router;