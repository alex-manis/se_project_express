const router = require("express").Router();
const { getFilms, createFilm } = require("../controllers/films");

router.get("/", getFilms);
router.post("/", createFilm);

module.exports = router;


GET /users — returns all users
GET /users/:userId - returns a user by _id
POST /users — creates a new user

Create three corresponding controllers: getUsers, getUser, and createUser.

In the body of the POST request for creating a user, pass a JSON object with two fields: name and avatar.