const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const authMiddleware = require('../middlewares/auth');
const { getCurrentUser, updateUser } = require("../controllers/users");

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.error('string.uri', { value });
    }),
  }),
});

router.get("/me", authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, validateUpdateUser, updateUser);

module.exports = router;