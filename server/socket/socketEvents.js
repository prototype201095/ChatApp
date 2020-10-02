const Utility = require("../utility/utility.js");
const CacheDbManager = require("../DbManager/cacheDbManager/cacheDbManager.js");

class SocketEvents {
  constructor() {
    this.userEmailSocketMap = new Map();
    this.cacheDbManager = new CacheDbManager();
  }

  getConnectedUserList() {
    let userEmailList = [];
    for (let [userEmail, _socketInstance] of this.userEmailSocketMap) {
      userEmailList.push(userEmail);
    }
    return userEmailList;
  }

  initiateSocketManager(io) {
    io.on("connect", (socket) => {
      this.instantiateSocketEvents(io, socket);
    });
  }

  instantiateSocketEvents(io, socketInstance) {
    socketInstance.on("userConnected", async (connectedUserPayload) => {
      let { userName, email } = connectedUserPayload;
      await this.cacheDbManager.cacheUserSpecificSocketDetails(email, socketInstance).then(async () => {
        let userEmailList = await this.cacheDbManager.getAllConnectedUsers();
        console.log(userEmailList);
        socketInstance.emit("greetConnectedUser", {
          connectedUserList: userEmailList.filter((d) => d !== email),
          connectedUser: userName,
        });
        socketInstance.broadcast.emit("addConnectedUserToOthers", email);
      });
    });

    socketInstance.on("disconnect", async () => {
      let userEmail = await this.cacheDbManager.deleteUserSpecificSocketDetails(socketInstance.id);
      console.log(userEmail);
      io.emit("updateConnectedUserList", userEmail);
    });

    socketInstance.on("sendPrivateMessage", (info) => {
      let socketInstanceOfSelectedUser = this.userEmailSocketMap.get(info["receiverName"]);
      //id => is the selected users id
      let { id } = socketInstanceOfSelectedUser;
      io.to(id).emit("sendMessageToSelectedUser", info);
    });

    socketInstance.on("notifyChannelCreation", (channelPayload) => {
      if (!Utility.isNullOrEmpty(channelPayload)) {
        const { channelName, _userList } = channelPayload;
        // notify only to the room(channel) users
        io.to(`${channelName}`).emit("notifyUsersForChannel", channelPayload);
      }
    });

    socketInstance.on("sendChannelMessage", (channelMessagePayload) => {
      if (!Utility.isNullOrEmpty(channelMessagePayload)) {
        let { channelName } = channelMessagePayload;
        socketInstance.to(`${channelName}`).emit("sendMessageToSelectedChannels", channelMessagePayload);
      }
    });
  }
}

module.exports = SocketEvents;
