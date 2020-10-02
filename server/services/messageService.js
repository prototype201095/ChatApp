const Utility = require("../utility/utility.js");
const ResponseManager = require("../config/responseManager");
const MessageDbManager = require("../DbManager/messageDbManager.js");

class MessageService {
  constructor() {
    this.messageDbManager = new MessageDbManager();
  }

  insertMessages(request, response) {
    const { senderName, receiverName, message, senderEmail, receiverEmail } = request.body;
    if (Utility.isNullOrEmpty(senderName)) {
      ResponseManager.sendErrorStatus(response, 400, "missing request parameter");
      return;
    }

    if (Utility.isNullOrEmpty(receiverName)) {
      ResponseManager.sendErrorStatus(response, 400, "missing request parameter");
      return;
    }

    if (Utility.isNullOrEmpty(message)) {
      ResponseManager.sendErrorStatus(response, 400, "missing request parameter");
      return;
    }

    if (Utility.isNullOrEmpty(senderEmail)) {
      ResponseManager.sendErrorStatus(response, 400, "missing request parameter");
      return;
    }

    if (Utility.isNullOrEmpty(receiverEmail)) {
      ResponseManager.sendErrorStatus(response, 400, "missing request parameter");
      return;
    }
    this.messageDbManager.insertMessagesToDb(request.body, response);
  }
}

module.exports = MessageService;
