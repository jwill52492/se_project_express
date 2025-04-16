const ClothingItems = require('../models/clothingitems');
const err = require('../utils/errors');

const getClothingItems = (req, res) => {
  const { id } = req.params;

  ClothingItems.findById({ id })
    .orFail()
    .then((items) => res.status(statusCodes.OK).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
}

const createClothingItems = (req, res) => {
  const { name, weather, imageUrl, createdAt } = req.body;

  ClothingItems.create({ name, weather, imageUrl, createdAt })
    .then((item) => res.status(statusCodes.CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(statusCodes.CREATED).send({ message: err.message });
      }
    });
}

const deleteClothingItems = (req, res) => {
  const { id } = req.params;

  ClothingItems.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        return res.status(statusCodes.NOT_FOUND).send({ message: err.message });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(statusCodes.INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
}

const likeClothingItems = (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItems.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status().send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(statusCodes.BAD_REQUEST).send({ message: err.message });
      }
    });
}

const dislikeClothingItems = (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItems.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status().send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(statusCodes.BAD_REQUEST).send({ message: err.message });
      }
    });
}

module.exports = { getClothingItems, createClothingItems, deleteClothingItems, likeClothingItems, dislikeClothingItems };