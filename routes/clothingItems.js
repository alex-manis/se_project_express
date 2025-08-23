const router = require("express").Router();
const { getDirectors, createDirector } = require("../controllers/directors");

router.get("/", getDirectors);
router.post("/", createDirector);

module.exports = router;


GET /items — returns all clothing items
POST /items — creates a new item
DELETE /items/:itemId — deletes an item by _id

In the body of the POST request for creating a card, a user should be able to send an item name, weather type, and image URL. They will be passed to the server as a JSON object. You will also need a user ID for the owner field. Move on to the next step to add a user object to each request.