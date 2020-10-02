const DatabaseConnectionManager = require("../config/databaseConnectionManager.js");
const DbConstants = require("../Constants/DBconstants.js");
const ResponseManager = require("../config/responseManager.js");

class UserDbManager {
  constructor() {
    this.connectionInstance = new DatabaseConnectionManager().createConnection();
  }

  insertUserData(requestPayload, response) {
    this.connectionInstance
      .then((databaseInstance) => {
        databaseInstance
          .collection(DbConstants.USER_COLLECTION)
          .find({ email: requestPayload["email"] })
          .toArray((error, findResponse) => {
            if (error) {
              ResponseManager.sendErrorStatus(response, 500, "error while fetching user details against the email");
            }

            if (findResponse.length) {
              ResponseManager.sendSuccessStatus(response, 200, findResponse);
            } else {
              databaseInstance.collection(DbConstants.USER_COLLECTION).insertOne(requestPayload, (error, result) => {
                if (error) {
                  ResponseManager.sendErrorStatus(response, 500, "Error occuered while inserting Data");
                  return;
                }
                ResponseManager.sendSuccessStatus(response, 200, "User data has been inserted successfully");
              });
            }
          });
      })
      .catch(() => {
        ResponseManager.sendErrorStatus(response, 500, "Error while connecting to the DB");
      });
  }

  getUserDetailsByName(name, response) {
    try {
      let regex = new RegExp(`.*${name}.*`, "g");
      let query = { userName: { $regex: regex } };
      this.connectionInstance.then((databaseInstance) => {
        databaseInstance
          .collection(DbConstants.USER_COLLECTION)
          .find(query)
          .toArray((error, result) => {
            if (error) {
              ResponseManager.sendErrorStatus(response, 500, "error while fetching user Details by name");
              return;
            }
            ResponseManager.sendSuccessStatus(response, 200, result);
          });
      });
    } catch (_excp) {
      ResponseManager.sendErrorStatus(response, 500, "error while fetching user Details");
    }
  }

  getAllUserListFromDb(_request, response) {
    try {
      this.connectionInstance.then((databaseInstance) => {
        let query = [{ $project: { userName: 1, _id: 0, email: 1 } }];
        databaseInstance
          .collection(DbConstants.USER_COLLECTION)
          .aggregate(query)
          .toArray((error, result) => {
            if (error) {
              ResponseManager.sendErrorStatus(response, 500, "error while fetching all user Details");
              return;
            }
            ResponseManager.sendSuccessStatus(response, 200, result);
          });
      });
    } catch (_excp) {
      ResponseManager.sendErrorStatus(response, 500, "error while fetching all user Details");
    }
  }
}

module.exports = UserDbManager;
