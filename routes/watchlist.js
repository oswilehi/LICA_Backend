var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
var connection = require("../middleware/connection");
const ObjectId = require("mongodb").ObjectID;

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
      .collection("watchlist")
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

/* GET movie */
router.get("/:id", async function (req, res, next) {
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
      .findOne({ _id: parseInt(req.params.id) });
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

/* POST add movie*/
router.post("/", async function (req, res, next) {
  console.log("HOLAAAAAAA");
  var client;

  try {
    client = new MongoClient(connection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const movie = {
      _id: req.body.id,
      image: req.body.image,
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
      .collection("watchlist")
      .deleteOne({ _id: parseInt(req.params.id) });
    res.status(200).send("TAMOS BIEN");
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

/* PUT delete movie and insert it into watched*/
router.put("/:id", async function (req, res, next) {
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
      .findOne({ _id: parseInt(req.params.id) });

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
