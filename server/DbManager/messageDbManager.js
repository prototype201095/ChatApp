const DatabaseConnectionManager = require("../config/databaseConnectionManager");
const DBconstants = require("../Constants/DBconstants");
const ResponseManager = require("../config/responseManager");

class MessageDbManager {
  constructor() {
    this.connectionInstance = new DatabaseConnectionManager().createConnection();
  }

  insertMessagesToDb(messagePayload, response) {
    this.connectionInstance
      .then((databaseInstance) => {
        databaseInstance.collection(DBconstants.MESSAGE_COLLECTION).insertOne(messagePayload, (error, _result) => {
          if (error) {
            ResponseManager.sendErrorStatus(response, 500, "error occuered while inserting Data");
            return;
          }
          ResponseManager.sendSuccessStatus(response, 200, "messages has been inserted successfully");
        });
      })
      .catch((_excp) => {
        ResponseManager.sendErrorStatus(response, 500, "error While Creating database Connection");
      });
  }
}

module.exports = MessageDbManager;
