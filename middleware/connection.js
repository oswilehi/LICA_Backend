require("dotenv").config();

const url = `mongodb+srv://${process.env.USER}:${process.env.DB_PASSWORD}@databases.sbqsm.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

module.exports = url;
