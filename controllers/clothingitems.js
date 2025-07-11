const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const ClothingItems = require('../models/clothingitems');
const { OK, CREATED } = require('../utils/errors');


const getClothingItems = async (req, res, next) => {
  try {
    const items = await ClothingItems.find().sort({ createdAt: -1 });
    return res.status(OK).send(items);
  } catch (err) {
    return next(err);
  }
};

const createClothingItems = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    const newItem = await ClothingItems.create({ name, weather, imageUrl, owner, createdAt: Date.now()});
    return res.status(CREATED).send(newItem);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err.message));
    }
    return next(err);
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
    return res.status(OK).send({ message: 'Successfully deleted' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID format'));
    }
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Clothing item not found'));
    }
    return next(err);
  }
}

const likeClothingItems = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const item = await ClothingItems.findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => new NotFoundError('Item not found'));
    return res.status(OK).send(item);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID format'));
    }
    return next(err);
  }
}

const dislikeClothingItems = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const item = await ClothingItems.findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => new NotFoundError('Item not found'));
    return res.status(OK).send(item);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid item ID format'));
    }
    return next(err);
  }
}

module.exports = { getClothingItems, createClothingItems, deleteClothingItems, likeClothingItems, dislikeClothingItems };