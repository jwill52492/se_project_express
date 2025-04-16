const router = require("express").Router();
const { getClothingItems, createClothingItems, deleteClothingItems } = require("../controllers/clothingitems");

router.get("/", getClothingItems);
router.post("/", createClothingItems);
router.delete("/items/:itemId", deleteClothingItems);

module.exports = router;