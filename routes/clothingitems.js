const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const authMiddleware = require('../middlewares/auth');
const { getClothingItems, createClothingItems, deleteClothingItems, likeClothingItems, dislikeClothingItems } = require("../controllers/clothingitems");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri', { value });
};

router.get("/", getClothingItems);

router.post("/", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required().custom(validateURL),
    weather: Joi.string().required().valid('hot', 'cold', 'warm')
  })
}), authMiddleware, createClothingItems);

router.delete("/:itemId", celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24).required(),
  }),
}), authMiddleware, deleteClothingItems);

router.put("/:itemId/likes", celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24).required(),
  }),
}), authMiddleware, likeClothingItems);

router.delete("/:itemId/likes", celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24).required(),
  }),
}), authMiddleware, dislikeClothingItems);

module.exports = router;