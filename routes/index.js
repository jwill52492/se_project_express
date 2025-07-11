const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const userRouter = require('./users');
const itemsRouter = require('./clothingitems');
const NotFoundError = require('../errors/not-found-err');
const { createUser, login } = require('../controllers/users');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri', { value });
};
const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

router.post("/signin",validateSignIn, login);
router.post("/signup",validateCreateUser, createUser);

router.use("/users", userRouter);
router.use("/items", itemsRouter);

router.use((req, res, next) =>
  next(new NotFoundError("User or Item not found"))
);

module.exports = router;