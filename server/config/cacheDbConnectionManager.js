const redis = require("redis");
const Dbconstants = require("../Constants/DBconstants");
class CacheDbConnectionManager {
  constructor() {}
  createConnection() {
    return new Promise((resolve, reject) => {
      const client = redis.createClient({
        port: Dbconstants.REDIS_DB_PORT,
        host: Dbconstants.REDIS_DB_HOST,
        password: Dbconstants.REDIS_PASSWORD,
      });
      resolve(client);
    });
  }
}

module.exports = CacheDbConnectionManager;
