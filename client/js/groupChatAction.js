import Utility from "./Utility/utility.js";
import GroupChatActionView from "./chatActionView/groupChatActionView.js";
import WebService from "./webService/webService.js";
import CommonActionView from "./commonActionView/commonActionView.js";

let mainContainer = $(".container-fluid");
class GroupChatAction {
  constructor() {
    this.registerEvents();
    this.channelAction();
    this.selectedUserToCreateChannel = [];
    this.selectedChannelForChat = null;
    this.groupChatActionView = new GroupChatActionView();
    this.commonActionView = new CommonActionView();
    this.webService = new WebService();
  }

  channelAction() {
    g_socket.on("notifyUsersForChannel", (channelPayload) => {
      let { channelName } = channelPayload;
      if (!Utility.isNullOrEmpty(channelName)) {
        this.groupChatActionView.populateChannel(channelName, $("#channels"));
      }
    });

    g_socket.on("sendMessageToSelectedChannels", (messageInfo) => {
      if (!Utility.isNullOrEmpty(messageInfo)) {
        this.groupChatActionView.mentionMessageToSelectedChannel(messageInfo);
      }
    });
  }

  registerEvents() {
    mainContainer.on("click", ".create-channel", (event) => {
      $.dialog({
        icon: "fa fa-users",
        title: "Create a Channel",
        content: this.groupChatActionView.createSearchableUserForChannel(),
        columnClass: "medium",
        type: "blue",
        onOpen: () => {
          /* event for get connected userlist*/
          this.registerChannelCreationEvents();
        },
      });
    });

    mainContainer.on("click", "#channels .channel-list", (event) => {
      const $currentTarget = $(event.currentTarget);
      let selectedChannelName = $currentTarget.attr("name");
      $currentTarget.find(".notify-new-message").remove();
      /**
       * remove active class if any user window is selected
       */

      if ($("#user-list").find(".user-status").hasClass("active")) {
        $("#user-list").find(".user-status").removeClass("active");
      }

      $currentTarget.addClass("active");
      if (!Utility.isNullOrEmpty(selectedChannelName)) {
        this.selectedChannelForChat = selectedChannelName;
        const channelMessageHistory = $currentTarget.data("messages");
        this.commonActionView.populateChatWindow(selectedChannelName, "channel");
        this.commonActionView.populateConversations(channelMessageHistory, $("#messages"), true);
      }
    });

    $("body").on("keypress", "#channel-message-input-box", (event) => {
      let keyCode = event.keyCode ? event.keyCode : event.which;
      if (keyCode === 13) this.sendMessageOnClickAction();
    });
  }

  registerChannelCreationEvents() {
    $("#search-user").on("keyup", (event) => {
      let serachedUserName = $(event.currentTarget).val().trim();
      if (!Utility.isNullOrEmpty(serachedUserName)) {
        this.webService.getConnectedUserList(serachedUserName).done((responseObj) => {
          let connectedUserName = $("#connected-user").attr("connected-user-name");
          if (responseObj instanceof Array) {
            const filteredUserList = responseObj.filter((d) => d !== connectedUserName);
            this.groupChatActionView.populateConnectedUserListForChannelCreation(filteredUserList);
          }
        });
      }
    });

    $("#searchable-user-list").on("click", "li", (event) => {
      let $currentTarget = $(event.currentTarget);
      let selectedUserName = $currentTarget.attr("user-name");
      let $shortlistedUser = $(".selected-channel-user").find(`[user-name='${selectedUserName}']`);
      if ($currentTarget.hasClass("active") || $shortlistedUser.length) {
        return false;
      } else {
        $currentTarget.addClass("active");
        this.selectedUserToCreateChannel.push(selectedUserName);
      }
      this.groupChatActionView.createTags(selectedUserName, $(".selected-channel-user"));
    });

    $(".selected-channel-user").on("click", ".badge i", (event) => {
      let $currentTarget = $(event.currentTarget);
      let userName = $currentTarget.closest(".badge").attr("user-name");
      let $userNameInUserList = $("#searchable-user-list").find(`[user-name='${userName}']`);
      if ($userNameInUserList.length) {
        $userNameInUserList.removeClass("active");
      }
      this.selectedUserToCreateChannel = this.selectedUserToCreateChannel.filter((d) => d !== userName);
      $currentTarget.parent().remove();
    });

    $("#create-channel").on("click", () => {
      let channelName = $("#channel-name").val();
      let connectedUserName = $("#connected-user").attr("connected-user-name");
      /**
       * user who is creating the channel will be selected by default
       */
      this.selectedUserToCreateChannel.push(connectedUserName);

      if (!this.selectedUserToCreateChannel.length > 1 || channelName === "") return false;

      let channelCreationPayload = {
        channelName: channelName,
        userList: this.selectedUserToCreateChannel,
      };

      this.webService.createChannel(channelCreationPayload).done((channel) => {
        $(".jconfirm-closeIcon").trigger("click");
        /*emit event to the selected users for the channel*/
        g_socket.emit("notifyChannelCreation", channelCreationPayload);
      });
    });
  }

  sendMessageOnClickAction() {
    let container = $("#messages");
    let message = $("#channel-message-input-box").val();
    let selectedMessage = [];
    if (!Utility.isNullOrEmpty(message)) {
      let messagePayLoad = {
        message: message,
        channelName: this.selectedChannelForChat,
        senderName: $("#connected-user").attr("connected-user-name"),
        ownMessage: false,
        time: new Date().getTime(),
      };
      // send message payload to the other users of the channel
      g_socket.emit("sendChannelMessage", messagePayLoad);

      messagePayLoad["ownMessage"] = true;

      //populate message for the sender itself
      this.commonActionView.populateConversations(messagePayLoad, container, false);
      let $selectedChannelElem = $("#channels").find(`[name= '${this.selectedChannelForChat}']`);
      let previousMessages = $selectedChannelElem.data("messages");

      if (Utility.isNullOrEmpty(previousMessages)) {
        selectedMessage.push(messagePayLoad);
      } else {
        selectedMessage = [...previousMessages];
        selectedMessage.push(messagePayLoad);
      }
      //update data for the selected user
      $selectedChannelElem.data("messages", selectedMessage);

      $("#channel-message-input-box").val(""); // empty message box after sending the message
    }
  }
}

export default GroupChatAction;
