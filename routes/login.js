var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var crypto = require("crypto");
require("dotenv").config();
var connection = require("../middleware/connection");
const { generateToken } = require("../middleware/jwt");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/", async function (req, res, next) {
  const client = new MongoClient(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(connection);

  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    await client.connect();
    const result = await client
      .db("LICA")
      .collection("users")
      .findOne({ email: user.email });
    if (result === null) res.status(400).send("NO EXISTES");
    else {
      console.log(result);
      if (await verify(user.password, result.password)) {
        const token = await generateToken(user.email);
        console.log(token);
        res.status(200).send({ jwt: token });
      } else res.status(400).send("TAMOS MAL");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("TAMOS MAL");
  } finally {
    await client.close();
  }
});

async function verify(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString("hex"));
    });
  });
}

module.exports = router;
