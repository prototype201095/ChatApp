const ResponseManager = require("../config/responseManager");
const Utility = require("../utility/utility.js");
const ChannelDbManager = require("../DbManager/channelDbManager.js");

class ChannelService {
  constructor() {
    this.channelDbManager = new ChannelDbManager();
  }

  createChannel(requestPayload, response, socketInstance) {
    let channelPayload = requestPayload.body;
    if (Utility.isNullOrEmpty(channelPayload)) {
      ResponseManager.sendErrorStatus(response, 400, "channel creation payload is empty");
    }
    let { channelName, userList, channelCreator } = channelPayload;
    if (
      Utility.isNullOrEmpty(channelName) ||
      Utility.isNullOrEmpty(userList) ||
      Utility.isNullOrEmpty(channelCreator)
    ) {
      ResponseManager.sendErrorStatus(response, 400, "missing parameters for channel creation");
      return;
    }

    /*TODO = insert user based socket instance to Redis */
    // if (userList instanceof Array) {
    //   if (userList.length > 1) {
    //     userList.forEach((user) => {
    //       let socket = socketInstance.userNameSocketMap.get(user);
    //       socket.join(channelName);
    //     });
    //   } else {
    //     ResponseManager.sendErrorStatus(response, 400, "channel must have two user to create");
    //     return;
    //   }
    // }
    // ResponseManager.sendSuccessStatus(response, 200, channelName);

    this.channelDbManager.insertChannelData(channelPayload, response, socketInstance);
  }

  getChannelList(request, response) {
    let { userName } = request.query;
    if (Utility.isNullOrEmpty(userName)) {
      ResponseManager.sendErrorStatus(response, 400, "missing request parameters");
    }
    this.channelDbManager.getChannelListByTheUser(userName, response);
  }
}

module.exports = ChannelService;
