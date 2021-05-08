var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var crypto = require("crypto");
var connection = require("../middleware/connection");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/", async function (req, res, next) {
  const client = new MongoClient(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user = {
    email: req.body.email,
    password: await hash(req.body.password),
  };

  try {
    await client.connect();
    const result = await client.db("LICA").collection("users").insertOne(user);
    res.status(200).send("TAMOS BIEN");
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

async function hash(password) {
  return new Promise((resolve, reject) => {
    // generate random 16 bytes long salt
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

module.exports = router;
