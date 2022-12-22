"use strict";
const Mongoose = require("mongoose");
const config = require("../config/index");

let dbURI;

if (process.env.NODE_ENV === "production") {
  dbURI = "mongodb://" +
    encodeURIComponent(config.db.username) + ":" +
    encodeURIComponent(config.db.password) + "@" +
    config.db.host + ":" +
    config.db.port + "/" +
    config.db.name +
    "?authSource=admin&retryWrites=true&w=majority";
} else {
  dbURI = config.dbURL
}

Mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true});
Mongoose.connection.on("error", function (err) {
  if (err) throw err;
  process.exit(1)
});
Mongoose.connection.on("connected", function () {
  console.log("Mongoose connected successfully.");
});

// mpromise (mongoose's default promise library) is deprecated,
// Plug-in your own promise library instead.
// Use native promises
Mongoose.Promise = global.Promise;

module.exports = {
  Mongoose,
  models: {
    UserModel: require('./schema/user').UserModel,
    PostModal: require('./schema/post').PostModal,
  },
};
