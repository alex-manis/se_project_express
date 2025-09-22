const Item = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors/errors");

module.exports.getItems = (req, res, next) =>
  Item.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      console.error(err);
      return next(err);
    });

module.exports.createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  return Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Create Item validation error"));
      }
      return next(err);
    });
};

module.exports.deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  return Item.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }

      if (item.owner.toString() !== currentUserId) {
        throw new ForbiddenError("You cannot delete someone else's item");
      }

      return Item.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => res.send({ data: deletedItem }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(err);
    });
};

module.exports.likeItem = (req, res, next) => {
  const { itemId } = req.params;

  return Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((updatedItem) => res.send({ data: updatedItem }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(err);
    });
};

module.exports.dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  return Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((updatedItem) => res.send({ data: updatedItem }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(err);
    });
};
