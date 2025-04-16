const ClothingItems = require('../models/clothingitems');
const { INTERNAL_SERVER_ERROR, OK, CREATED, BAD_REQUEST } = require('../utils/errors');


const getClothingItems = (req, res) => {
  const { id } = req.params;

  ClothingItems.findById({ id })
    .orFail()
    .then((items) => res.status(OK).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
}

const createClothingItems = (req, res) => {
  const { name, weather, imageUrl, createdAt } = req.body;

  ClothingItems.create({ name, weather, imageUrl, createdAt })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(CREATED).send({ message: err.message });
      }
    });
}

const deleteClothingItems = (req, res) => {
  const { id } = req.params;

  ClothingItems.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
}

const likeClothingItems = (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItems.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(OK).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
    });
}

const dislikeClothingItems = (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  ClothingItems.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((item) => res.status(OK).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
    });
}

module.exports = { getClothingItems, createClothingItems, deleteClothingItems, likeClothingItems, dislikeClothingItems };