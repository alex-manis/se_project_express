const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const auth = require("../middlewares/auth");
const { login, createUser } = require("../controllers/users");
const {
  validateCreateUser,
  validateLogin,
} = require("../middlewares/validation");

router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);

router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

module.exports = router;
