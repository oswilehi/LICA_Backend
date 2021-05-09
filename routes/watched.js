var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
var connection = require("../middleware/connection");

/**
 * @swagger
 * tags:
 *   name: Watched
 *   description: The watched managing API
 */

/**
 * @swagger
 * /watched/{user}:
 *  get:
 *    summary: Retrieve the movies of a user from watched.
 *    tags: [Watched]
 *    description: Retrieve the movies of a user from watched.
 *    parameters:
 *      - in: path
 *        name: user
 *        required: true
 *        description: Email that has this specific watched list.
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
      .collection("watched")
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
 * /watched/{id}/{user}:
 *  put:
 *    summary: Moves movie from watched to watch list.
 *    tags: [Watched]
 *    description: Moves movie from watched to watch list.
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
 *        description: The movie was moved to watch list.
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
    const result = await client
      .db("LICA")
      .collection("watched")
      .findOne({ _id: parseInt(req.params.id), user: req.params.user });
    console.log(result);
    const watched = await client
      .db("LICA")
      .collection("watchlist")
      .insertOne(result);

    await client.db("LICA").collection("watched").deleteOne(result);

    res.status(201).send(`${result} inserted`);
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

/**
 * @swagger
 * /watched/{id}/{user}:
 *  delete:
 *    summary: Delete movie of user from watched.
 *    tags: [Watched]
 *    description: Delete movie of user from watched.
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
router.delete("/:id/:user", async function (req, res, next) {
  const client = new MongoClient(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const result = await client
      .db("LICA")
      .collection("watched")
      .deleteOne({ _id: parseInt(req.params.id), user: req.params.user });
    res.status(200).send("TAMOS BIEN");
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

module.exports = router;
