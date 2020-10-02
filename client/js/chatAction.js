import GroupChatAction from "./groupChatAction.js";
import Utility from "./Utility/utility.js";
import ChatActionView from "./chatActionView/chatActionView.js";
import CommonActionView from "./commonActionView/commonActionView.js";
import WebService from "./webService/webService.js";

let mainContainer = $(".container-fluid");
class MessageAction {
  constructor() {
    this.userActions();
    this.selectedUserForChat = null;
    this.registerEvents();
    this.chatActionView = new ChatActionView();
    this.commonActionView = new CommonActionView();
    this.webService = new WebService();
    this.groupChatAction = new GroupChatAction();
  }

  registerEvents() {
    mainContainer.on("click", "#send", (event) => {
      this.sendMessageOnClickAction();
    });

    $("body").on("keypress", "#user-message-input-box", (event) => {
      let keyCode = event.keyCode ? event.keyCode : event.which;
      if (keyCode === 13) this.sendMessageOnClickAction();
    });

    mainContainer.on("click", ".user-status", (event) => {
      let $currentTarget = $(event.currentTarget);
      $currentTarget.siblings().removeClass("active");
      let selectedUserEmail = $currentTarget.attr("email");
      let selectedUserName = $currentTarget.attr("name");
      let userDetails = { email: selectedUserEmail, userName: selectedUserName };
      $currentTarget.find(".notify-new-message").remove();

      if ($currentTarget.hasClass("active")) {
        return false;
      }
      $currentTarget.addClass("active"); // add the active class if the user doesn't open another user chat window
      if (!Utility.isNullOrEmpty(selectedUserName)) {
        let previousMessages = $currentTarget.data("messages");
        this.selectedUserForChat = selectedUserName;
        this.commonActionView.populateChatWindow(userDetails, "user");
        this.commonActionView.populateConversations(previousMessages, $("#messages"), true);
      }
    });
  }

  userActions() {
    g_socket.on("sendMessageToSelectedUser", (messageInfo) => {
      if (!Utility.isNullOrEmpty(messageInfo)) {
        this.chatActionView.mentionMessageToUserList(messageInfo); // user name has been send so that it can be identified which user has been send the message
      }
    });

    g_socket.on("greetConnectedUser", (userNameList) => {
      let connectedUserName = userNameList["connectedUser"] || "";
      let connectedUserList = userNameList["connectedUserList"] || "";
      this.chatActionView.createWelcomeBanner(connectedUserName);
      let $container = $("#user-list");

      if (connectedUserList instanceof Array) {
        connectedUserList.forEach((userEmail) => {
          $container
            .find(`[email = '${userEmail}' ]`)
            .find(".user-status-pos")
            .removeClass("fa-circle-o")
            .addClass("fa-circle user-active-status");
        });
      }
    });

    g_socket.on("addConnectedUserToOthers", (userEmail) => {
      let $container = $("#user-list");
      $container
        .find(`[email = '${userEmail}' ]`)
        .find(".user-status-pos")
        .removeClass("fa-circle-o")
        .addClass("fa-circle user-active-status");
    });

    g_socket.on("updateConnectedUserList", (userEmail) => {
      let $container = $("#user-list");
      $container
        .find(`[email = '${userEmail}' ]`)
        .find(".user-status-pos")
        .addClass("fa-circle-o")
        .removeClass("fa-circle user-active-status");
    });
  }

  sendMessageOnClickAction() {
    let container = $("#messages");
    let message = $("#user-message-input-box").val();
    let selectedMessage = [];
    if (!Utility.isNullOrEmpty(message)) {
      let messagePayLoad = {
        message: message,
        receiverName: this.selectedUserForChat,
        senderName: $("#connected-user").attr("connected-user-name"),
        ownMessage: false,
        time: new Date().getTime(),
      };
      g_socket.emit("sendPrivateMessage", messagePayLoad);

      messagePayLoad["ownMessage"] = true;
      //populate message for the sender itself
      this.commonActionView.populateConversations(messagePayLoad, container, false);
      let previousMessages = $("#connected-user").find(`[name= '${this.selectedUserForChat}']`).data("messages");

      if (Utility.isNullOrEmpty(previousMessages)) {
        selectedMessage.push(messagePayLoad);
      } else {
        selectedMessage = [...previousMessages];
        selectedMessage.push(messagePayLoad);
      }
      //update data for the selected user
      $("#connected-user").find(`[name= '${this.selectedUserForChat}']`).data("messages", selectedMessage);

      $("#user-message-input-box").val(""); // empty message box after sending the message
    }
  }
}

$(document).ready(() => {
  new MessageAction();
});
