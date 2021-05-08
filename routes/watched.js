var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
var connection = require("../middleware/connection");

/* GET movies */
router.get("/", async function (req, res, next) {
  const client = new MongoClient(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const result = await client
      .db("LICA")
      .collection("watched")
      .find()
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

/* PUT delete movie and insert it into watchlist*/
router.put("/:id", async function (req, res, next) {
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
      .findOne({ _id: parseInt(req.params.id) });
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

/* DELETE movie*/
router.delete("/:id", async function (req, res, next) {
  const client = new MongoClient(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const result = await client
      .db("LICA")
      .collection("watched")
      .deleteOne({ _id: parseInt(req.params.id) });
    res.status(200).send("TAMOS BIEN");
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

module.exports = router;
