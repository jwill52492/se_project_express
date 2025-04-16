const ClothingItems = require('../models/clothingitems');
const err = require('../utils/errors');

const getClothingItems = (req, res) => {
  const { id } = req.params;

  ClothingItems.findById({ id })
    .orFail()
    .then((items) => res.status().send(items))
    .catch((err) => {
      console.error(err);
      return res.status().send({ message: err.message });
    });
}

const createClothingItems = (req, res) => {
  const { name, weather, imageUrl, createdAt } = req.body;

  ClothingItems.create({ name, weather, imageUrl, createdAt })
    .then((item) => res.status().send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status().send({ message: err.message });
      }
    });
}

const deleteClothingItems = (req, res) => {
  const { id } = req.params;

  ClothingItems.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        return res.status().send({ message: err.message });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status().send({ message: err.message });
    });
}

module.exports = { getClothingItems, createClothingItems, deleteClothingItems };