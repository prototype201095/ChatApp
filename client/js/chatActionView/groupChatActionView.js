import Utility from "../Utility/utility.js";
import CommonActionView from "../commonActionView/commonActionView.js";
class GroupChatActionView {
  constructor() {
    this.commonActionView = new CommonActionView();
  }

  createTags(username, container) {
    $("#search-user").val("");
    let elem = $("<span>")
      .addClass("badge badge-info")
      .attr({ "user-name": username })
      .append($("<span>").text(username))
      .append($("<i>").addClass("fa fa-times"));
    container.append(elem);
  }

  populateConnectedUserListForChannelCreation(userList) {
    let userListArr = [];
    if (Utility.isNullOrEmpty(userList)) $("#searchable-user-list").empty();
    else {
      userList.forEach((user) => {
        let liElem = $("<li>").addClass("user-list").attr({ "user-name": user });
        let activeStatusElem = $("<span>").append(
          $("<i>").addClass("fa fa-circle user-active-status").attr({
            "aria-hidden": true,
          }),
        );
        liElem.append($("<img>").attr({ src: "../images/img_avatar.png" }).addClass("avatar"));
        liElem.append($("<span>").text(user));
        liElem.append(activeStatusElem);

        userListArr.push(liElem);
      });
      $("#searchable-user-list").html(userListArr);
    }
  }

  createSearchableUserForChannel() {
    let htmlElem;

    htmlElem = $("<div>")
      .addClass("")
      .append(
        $("<i>").addClass("fa fa-users input-icons").attr({
          "aria-hidden": true,
        }),
      )
      .append(
        $("<input>")
          .attr({
            placeholder: "Enter the channel name",
            id: "channel-name",
            type: "text",
          })
          .addClass("input"),
      )
      .append(
        $("<i>")
          .addClass("fa fa-search input-icons")
          .attr({
            "aria-hidden": true,
          })
          .css({
            top: "64px",
          }),
      )
      .append(
        $("<input>")
          .attr({
            placeholder: "Search any Connected User name",
            id: "search-user",
            type: "text",
          })
          .addClass("search-user input"),
      )
      .append(
        $("<div>")
          .addClass("row")
          .append($("<div>").addClass("col-10").append($("<div>").addClass("selected-channel-user")))
          .append(
            $("<div>")
              .addClass("col-2 no-padding")
              .append($("<button>").addClass("channel-creation").attr({ id: "create-channel" }).text("Go")),
          ),
      )
      .append(
        $("<ul>").addClass("user-list-container").attr({
          id: "searchable-user-list",
        }),
      );

    return htmlElem;
  }

  populateChannel(channelName, container) {
    if (!Utility.isNullOrEmpty(channelName)) {
      let channelElem = $("<div>").addClass("channel-list").attr({
        name: channelName,
      });
      let spanElem = $("<span>").text(channelName);

      let groupIconElem = $("<span>").append(
        $("<i>").addClass("fa fa-group channel-icon").attr({
          "aria-hidden": true,
        }),
      );

      channelElem.append(groupIconElem);
      channelElem.append(spanElem);
      container.append(channelElem);
    }
  }

  mentionMessageToSelectedChannel(messageInfo) {
    if (!Utility.isNullOrEmpty(messageInfo)) {
      let selectedChannelMessages = [];
      let { channelName } = messageInfo;
      let container = $("#messages");
      let $selectedChannelElem = $("#channels").find(`[name='${channelName}']`);
      let previousMessages = $selectedChannelElem.data("messages");

      if (Utility.isNullOrEmpty(previousMessages)) {
        selectedChannelMessages.push(messageInfo);
      } else {
        selectedChannelMessages = [...previousMessages];
        selectedChannelMessages.push(messageInfo);
      }

      $selectedChannelElem.data("messages", selectedChannelMessages);

      if ($selectedChannelElem.hasClass("active")) {
        this.commonActionView.populateConversations(messageInfo, container, true);
      } else {
        if ($selectedChannelElem.find(".notify-new-message").length) {
          $selectedChannelElem.find(".notify-new-message").text(selectedChannelMessages.length);
        } else {
          $selectedChannelElem.append($("<span>").addClass("notify-new-message").text(selectedChannelMessages.length));
        }
      }
    }
  }
}

export default GroupChatActionView;
