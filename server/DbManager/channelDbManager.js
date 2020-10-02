const DatabaseConnectionManager = require("../config/databaseConnectionManager.js");
const ResponseManager = require("../config/responseManager.js");
const Dbconstants = require("../Constants/DBconstants.js");
const { ResumeToken } = require("mongodb");
class ChannelDbManager {
  constructor() {
    this.connectionInstance = new DatabaseConnectionManager().createConnection();
  }

  insertChannelData(channelPayload, response, socketInstance) {
    this.connectionInstance
      .then((databaseInstance) => {
        databaseInstance
          .collection(Dbconstants.CHANNEL_COLLECTION)
          .insertOne({ hello: JSON.stringify(socketInstance) }, (error, _result) => {
            if (error) {
              ResponseManager.sendErrorStatus(response, 500, "Error occuered while inserting Data");
              console.log(error);
              return;
            }
            ResponseManager.sendSuccessStatus(response, 200, "User data has been inserted successfully");
          });
      })
      .catch((_excp) => {
        ResponseManager.sendErrorStatus(response, 500, "Error While Creating database Connection");
      });
  }

  getChannelListByTheUser(userName, response) {
    this.connectionInstance
      .then((databaseInstance) => {
        let query = { channelCreator: userName };
        databaseInstance
          .collection(Dbconstants.CHANNEL_COLLECTION)
          .find(query)
          .toArray((error, result) => {
            if (error) {
              ResponseManager.sendErrorStatus(response, 500, "Error occuered while inserting Data");
              return;
            }
            ResponseManager.sendSuccessStatus(response, 200, result);
          });
      })
      .catch((_excp) => {
        ResponseManager.sendErrorStatus(response, 500, "Error While Creating database Connection");
      });
  }
}

module.exports = ChannelDbManager;
