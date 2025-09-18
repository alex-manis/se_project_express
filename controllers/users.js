const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(
          new BadRequestError("The id string is in an invalid format")
        );
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send({ data: userWithoutPassword });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return next(new ConflictError("User with this email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Create user validation error"));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Update user validation error"));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      next(err);
    });
};
