const ChannelService = require("../../services/channelService.js");
class Channels {
  constructor(app, socketInstance) {
    this.instantiateChannelEndpoints(app, socketInstance);
    this.channelService = new ChannelService();
  }

  instantiateChannelEndpoints(app, socketInstance) {
    app.post("/createChannel", (request, response) => {
      this.channelService.createChannel(request, response, socketInstance);
    });

    app.get("/getChannels", (request, response) => {
      this.channelService.getChannelList(request, response);
    });
  }
}

module.exports = Channels;
