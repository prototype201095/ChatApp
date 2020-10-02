const CircularJson = require("circular-json");
const Utility = require("../../utility/utility");
const CacheDBConnectionManager = require("../../config/cacheDbConnectionManager.js");
const DbConstants = require("../../Constants/DBconstants.js");
const DBconstants = require("../../Constants/DBconstants.js");

class CacheDbManager {
  constructor() {
    this.cacheDBConnectionManager = new CacheDBConnectionManager().createConnection();
  }

  async cacheUserSpecificSocketDetails(userEmail, socketInstanceUserMap) {
    return new Promise((resolve, reject) => {
      if (!Utility.isNullOrEmpty(userEmail) && !Utility.isNullOrEmpty(socketInstanceUserMap)) {
        let stringifedSocketInstance = null;
        if (socketInstanceUserMap instanceof Object) {
          stringifedSocketInstance = CircularJson.stringify(socketInstanceUserMap);
        }
        this.cacheDBConnectionManager.then((databaseInstance) => {
          databaseInstance.hset(
            DBconstants.USER_SOCKET_MAPPING_HASH,
            userEmail,
            stringifedSocketInstance,
            (error, _result) => {
              if (error) {
                reject();
              }
              databaseInstance.hset(
                DBconstants.SOCKETID_USER_MAPPING_HASH,
                socketInstanceUserMap.id,
                userEmail,
                (error, result) => {
                  if (error) {
                    reject();
                  }
                  resolve(result);
                },
              );
            },
          );
        });
      }
    });
  }

  async deleteUserSpecificSocketDetails(socketId) {
    return new Promise((resolve, reject) => {
      if (!Utility.isNullOrEmpty(socketId)) {
        this.cacheDBConnectionManager.then((databaseInstance) => {
          databaseInstance.hget(DbConstants.SOCKETID_USER_MAPPING_HASH, socketId, async (error, userEmail) => {
            if (error) {
              reject();
              return;
            }
            if (!Utility.isNullOrEmpty(userEmail)) {
              await databaseInstance.hdel(DBconstants.USER_SOCKET_MAPPING_HASH, userEmail);
              await databaseInstance.hdel(DBconstants.SOCKETID_USER_MAPPING_HASH, socketId);
              return resolve(userEmail);
            }
          });
        });
      }
    });
  }

  async getAllConnectedUsers() {
    return new Promise((resolve, reject) => {
      this.cacheDBConnectionManager.then((databaseInstance) => {
        let userNameList = null;
        databaseInstance.hgetall(DbConstants.SOCKETID_USER_MAPPING_HASH, (error, result) => {
          if (error) {
            reject();
          }
          if (typeof result === "object") {
            userNameList = Object.values(result);
          }
          resolve(userNameList);
        });
      });
    });
  }
}

module.exports = CacheDbManager;
