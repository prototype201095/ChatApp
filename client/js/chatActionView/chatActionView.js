import Utility from "../Utility/utility.js";
import CommonActionView from "../commonActionView/commonActionView.js";

class ChatActionView {
  constructor() {
    this.commonActionView = new CommonActionView();
  }

  populateConnectedUserList(userList) {
    if (!Utility.isNullOrEmpty(userList) && userList instanceof Array) {
      let userElemArr = [];
      let $container = $("#user-list");
      $container.empty();
      userList.forEach((userDetails) => {
        userElemArr.push(this.commonActionView.populateNewAddedUserForOthers(userDetails, false));
      });
      $container.append(userElemArr);
    }
  }

  createWelcomeBanner(userName) {
    $("#welcome-message").empty();
    let welcomeMessageElem = $("<p>").addClass("welcome-text").text(`Welcome`);
    let userNameElem = $("<p>").addClass("user-name").text(`${userName}`);
    $("#welcome-message").append(welcomeMessageElem);
    $("#welcome-message").append(userNameElem);
    this.createUserAvatar(userName);
  }

  createUserAvatar(userName) {
    let shortName = Utility.getAlphabentFromName(userName);
    if (!Utility.isNullOrEmpty(shortName)) {
      $(".avatar p").attr("data-letters", shortName);
    }
  }

  mentionMessageToUserList(messageInfo) {
    if (!Utility.isNullOrEmpty(messageInfo)) {
      let selectedUsersMessages = [];
      let { senderName } = messageInfo;
      let container = $("#messages");
      let $selectedUser = $("#user-list").find(`[name='${senderName}']`);
      let previousMessages = $selectedUser.data("messages");

      if (Utility.isNullOrEmpty(previousMessages)) {
        selectedUsersMessages.push(messageInfo);
      } else {
        selectedUsersMessages = [...previousMessages];
        selectedUsersMessages.push(messageInfo);
      }

      $selectedUser.data("messages", selectedUsersMessages);

      if ($selectedUser.hasClass("active")) {
        this.commonActionView.populateConversations(messageInfo, container, true);
      } else {
        if ($selectedUser.find(".notify-new-message").length) {
          $selectedUser.find(".notify-new-message").text(selectedUsersMessages.length);
        } else {
          $selectedUser.append($("<span>").addClass("notify-new-message").text(selectedUsersMessages.length));
        }
      }
    }
  }
}

export default ChatActionView;
