const MessageService = require("../../services/messageService.js");
class Messages {
  constructor(app, socketInstance) {
    this.instantiateChannelEndpoints(app, socketInstance);
    this.messageService = new MessageService();
  }
  instantiateChannelEndpoints(app, socketInstance) {
    app.post("/insertMessage", (request, response) => {
      this.messageService.insertMessages(request, response);
    });
  }
}

module.exports = Messages;
