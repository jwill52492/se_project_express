const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const ClothingItems = require('../models/clothingitems');
const { INTERNAL_SERVER_ERROR, OK, CREATED, BAD_REQUEST, NOT_FOUND, FORBIDDEN } = require('../utils/errors');


const getClothingItems = async (req, res, next) => {
  try {
    const items = await ClothingItems.find().sort({ createdAt: -1 });
    res.status(OK).send(items);
  } catch (err) {
    next(err);
  }
};

const createClothingItems = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    const newItem = await ClothingItems.create({ name, weather, imageUrl, owner, createdAt: Date.now()});
    res.status(CREATED).send(newItem);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err.message));
    }
    next(err);
  }
};


const deleteClothingItems = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const item = await ClothingItems.findById(itemId).orFail();
    if (String(item.owner) !== req.user._id) {
      throw new ForbiddenError('You cannot delete this item');
    }
    await item.deleteOne();
    res.status(OK).send({ message: 'Successfully deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID format'));
    }
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Clothing item not found'));
    }
    next(err);
  }
}

const likeClothingItems = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const item = await ClothingItems.findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => new NotFoundError('Item not found'));
    res.status(OK).send(item);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID format'));
    }
    next(err);
  }
}

const dislikeClothingItems = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const item = await ClothingItems.findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => new NotFoundError('Item not found'));
    res.status(OK).send(item);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID format'));
    }
    next(err);
  }
}

module.exports = { getClothingItems, createClothingItems, deleteClothingItems, likeClothingItems, dislikeClothingItems };