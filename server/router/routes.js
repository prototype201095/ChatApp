const Users = require("./users/user.js");
const Channels = require("./channel/channels.js");
const SocketEvents = require("../socket/socketEvents.js");
const Messages = require("./messages/messages.js");

//manage all router and their initialization
module.exports = function (app, io) {
  let socketEventInstance = new SocketEvents(); // all socket event initialization
  socketEventInstance.initiateSocketManager(io);
  new Users(app, socketEventInstance);
  new Channels(app, socketEventInstance);
  new Messages(app, socketEventInstance);
};
