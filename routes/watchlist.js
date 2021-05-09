var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
var connection = require("../middleware/connection");
const ObjectId = require("mongodb").ObjectID;

/**
 * @swagger
 * tags:
 *   name: Watch list
 *   description: The watch list managing API
 */

/**
 * @swagger
 * /watchlist/{user}:
 *  get:
 *    summary: Retrieve the movies of a user from a watch list.
 *    tags: [Watch list]
 *    description: Retrieve the movies of a user from a watch list.
 *    parameters:
 *      - in: path
 *        name: user
 *        required: true
 *        description: Email that has this specific watch list.
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A list from movies.
 *      403:
 *        description: Unauthorized
 */
router.get("/:user", async function (req, res, next) {
  const client = new MongoClient(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const result = await client
      .db("LICA")
      .collection("watchlist")
      .find({ user: req.params.user })
      .toArray();
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

/**
 * @swagger
 * /watchlist/{id}/{user}:
 *  get:
 *    summary: Retrieve a specific movie from a user.
 *    tags: [Watch list]
 *    description: Retrieve a specific movie from a user.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Id of the movie.
 *        schema:
 *          type: integer
 *      - in: path
 *        name: user
 *        required: true
 *        description: Email that has this specific watch list.
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A list from movies.
 *      403:
 *        description: Unauthorized
 */
router.get("/:id/:user", async function (req, res, next) {
  const client = new MongoClient(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log(req.params.id);
    const result = await client
      .db("LICA")
      .collection("watchlist")
      .findOne({ _id: req.params.id });
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

/**
 * @swagger
 * /watchlist:
 *  post:
 *    summary: Add a movie to user watch list.
 *    tags: [Watch list]
 *    requestBody:
 *      description: Create a json that represents a movie you want to add to your watchlist.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              _id:
 *                type: integer
 *                description: The movie ID.
 *                example: 123
 *              image:
 *                type: string
 *                description: The poster path of the movie.
 *                example: /toyStory.jpg
 *              user:
 *                type: string
 *                description: User that belongs the movie.
 *                example: oswilehi@gmail.com
 *    responses:
 *      200:
 *        description: The movie was added to your watchlist
 *      403:
 *        description: Unauthorized
 *      500:
 *        description: Some server error
 */
router.post("/", async function (req, res, next) {
  console.log("HOLAAAAAAA");
  var client;

  try {
    client = new MongoClient(connection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const movie = {
      _id: req.body.id + req.body.user,
      id: req.body.id,
      image: req.body.image,
      user: req.body.user,
    };

    await client.connect();
    const result = await client
      .db("LICA")
      .collection("watchlist")
      .insertOne(movie);
    res.status(200).send("TAMOS BIEN");
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

/**
 * @swagger
 * /watchlist/{id}/{user}:
 *  delete:
 *    summary: Delete movie of user from watch list.
 *    tags: [Watch list]
 *    description: Delete movie of user from watch list.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Id of the movie.
 *        schema:
 *          type: integer
 *      - in: path
 *        name: user
 *        required: true
 *        description: Email that wants to delete the movie.
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The movie was deleted.
 *      403:
 *        description: Unauthorized
 */
router.delete("/:id", async function (req, res, next) {
  const client = new MongoClient(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const result = await client.db("LICA").collection("watchlist").deleteOne({
      _id: req.params.id,
    });
    res.status(200).send("TAMOS BIEN");
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

/**
 * @swagger
 * /watchlist/{id}/{user}:
 *  put:
 *    summary: Moves movie from watch list to watched.
 *    tags: [Watch list]
 *    description: Moves movie from watch list to watched.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Id of the movie.
 *        schema:
 *          type: integer
 *      - in: path
 *        name: user
 *        required: true
 *        description: Email that wants to move the movie.
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The movie was moved to watched.
 *      403:
 *        description: Unauthorized
 */
router.put("/:id/:user", async function (req, res, next) {
  const client = new MongoClient(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log(req.params.id);
    let result = await client
      .db("LICA")
      .collection("watchlist")
      .findOne({ _id: req.params.id });

    console.log(typeof result._id);
    console.log(typeof req.params.id, typeof req.params.user);

    await client.db("LICA").collection("watched").insertOne(result);

    await client.db("LICA").collection("watchlist").deleteOne(result);

    res.status(201).send(`${result} inserted`);
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

module.exports = router;
