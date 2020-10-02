const MongoClient = require("mongodb").MongoClient;
const DBConstants = require("../Constants/DBconstants.js");

const url = `mongodb://${DBConstants.MONGO_DB_HOST}:${DBConstants.MONGO_DB_PORT}/`;

class DatabaseConnectionManager {
  constructor() {}

  createConnection() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (error, db) => {
        if (error) reject({});
        let databaseInstance = db.db(`${DBConstants.MONDO_DB_DATABASE}`);
        resolve(databaseInstance);
      });
    });
  }
}

module.exports = DatabaseConnectionManager;
