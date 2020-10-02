import Utility from "../Utility/utility.js";
class CommonActionView {
  constructor() {}

  populateChatWindow(name, populationFor = "user") {
    $("#chat-window").empty();
    $("#chat-window").append(this.createSelectionDetailsInChatWindow(name, populationFor));
    $("#chat-window").append(this.createMessagesSection());
    $("#chat-window").append(this.renderMessagebox(`${populationFor}-message-input-box`));
  }

  /**
   * name can be channelName/userName
   * can be either selected channel details or selected user details
   */
  createSelectionDetailsInChatWindow(name, populationFor) {
    let chatHeaderInfoElem =
      populationFor.toUpperCase() === "USER"
        ? this.populateNewAddedUserForOthers(name, true)
        : this.populateChannelInfo(name);
    let elem = $("<div>")
      .addClass("row")
      .append(
        $("<div>")
          .addClass("col-12")
          .append(
            $("<div>")
              .addClass("selected-user-window")
              .attr({
                id: "selected-user-window",
              })
              .append($("<span>").html(chatHeaderInfoElem)),
          ),
      );

    return elem;
  }

  createMessagesSection() {
    let elem = $("<div>")
      .addClass("row")
      .append(
        $("<div>")
          .addClass("col-12")
          .append(
            $("<div>").addClass("messages").attr({
              id: "messages",
            }),
          ),
      );

    return elem;
  }

  renderMessagebox(inputBoxId) {
    let elem = $("<div>")
      .addClass("row")
      .append(
        $("<div>")
          .addClass("col-11")
          .append(
            $("<div>")
              .addClass("message-input")
              .append(
                $("<input>").attr({
                  id: inputBoxId,
                  type: "text",
                  placeholder: "Enter message",
                }),
              ),
          ),
      )
      .append(
        $("<div>")
          .addClass("col-1")
          .css({ padding: 0 })
          .append(
            $("<div>")
              .addClass("send-message")
              .attr({
                id: "send",
              })
              .append(
                $("<i>").addClass("fa fa-paper-plane").attr({
                  "aria-hidden": "true",
                }),
              ),
          ),
      );

    return elem;
  }

  populateNewAddedUserForOthers(userDetails, isChatWindow = false) {
    if (!Utility.isNullOrEmpty(userDetails)) {
      let userStatusClass = isChatWindow ? "user-window-status" : "user-status";
      let userElem = $("<div>").addClass(userStatusClass).attr({
        email: userDetails["email"],
        name: userDetails["userName"],
      });
      let spanElem = $("<span>").text(userDetails["userName"]);

      let activeStatusElem = $("<span>").append(
        $("<i>").addClass("fa fa-circle-o user-status-pos").attr({
          "aria-hidden": true,
        }),
      );

      let favouriteElem = $("<span>")
        .css({
          "padding-left": "5px",
        })
        .append(
          $("<i>").addClass("fa fa-star-o").attr({
            "aria-hidden": true,
          }),
        );

      //status  of the user
      userElem.append(activeStatusElem);
      //name of the user
      userElem.append(spanElem);
      //favourite selection of the user
      isChatWindow && userElem.append(favouriteElem);

      return userElem;
    }
  }

  populateChannelInfo(channelName) {
    if (!Utility.isNullOrEmpty(channelName)) {
      let channelElem = $("<div>").addClass("channel-window-status").attr({
        name: channelName,
      });
      let spanElem = $("<span>").text(channelName);

      let groupIconElem = $("<span>").append(
        $("<i>").addClass("fa fa-lock channel-icon").attr({
          "aria-hidden": true,
        }),
      );

      let favouriteElem = $("<span>")
        .css({
          "padding-left": "5px",
        })
        .append(
          $("<i>").addClass("fa fa-star-o").attr({
            "aria-hidden": true,
          }),
        );

      let channelInfoElem = $("<span>")
        .css({
          "padding-right": "5px",
          float: "right",
        })
        .append(
          $("<i>").addClass("fa fa-exclamation-circle").attr({
            "aria-hidden": true,
          }),
        );

      channelElem.append(groupIconElem);
      channelElem.append(spanElem);
      channelElem.append(favouriteElem);
      channelElem.append(channelInfoElem);
      return channelElem;
    }
  }

  populateConversations(messagePayload, container) {
    let messageElem;
    let messageElemArr = [];
    if (!Utility.isNullOrEmpty(messagePayload)) {
      /**
       * instance of array checking is required to check whether single message sind by the user
       * OR any pending messages that has not seen by the user
       */
      if (messagePayload instanceof Array) {
        messagePayload.forEach((message) => {
          messageElem = this.populateIndividualMessage(message);
          messageElemArr.push(messageElem);
        });
        container.append(messageElemArr);
      } else {
        messageElem = this.populateIndividualMessage(messagePayload);
        container.append(messageElem);
      }
    }
  }

  populateIndividualMessage(messagePayload) {
    /**
     * check the class whether the message is sent by the user itself or other user
     */
    let { ownMessage } = messagePayload;
    let messageElem = ownMessage ? this.populateOwnMessage(messagePayload) : this.populateOthersMessage(messagePayload);
    return messageElem;
  }

  populateOwnMessage(messagePayload) {
    let { message, time } = messagePayload;
    let messageElem = $("<div>")
      .addClass("message-details-container")
      .append($("<div>").addClass("self-message").text(message))
      .append(
        $("<div>")
          .addClass(`time-container position-right`)
          .append($("<span>").addClass(`time position-right`).text(Utility.formatTime(time))),
      );
    return messageElem;
  }

  populateOthersMessage(messagePayload) {
    let { senderName, message, time } = messagePayload;
    let messageElem = $("<div>")
      .addClass("message-details-container")
      .append(
        $("<div>")
          .addClass("row")
          .css({ width: "100%" })
          .append(
            $("<div>")
              .addClass("col-1")
              .append(
                $("<span>")
                  .addClass("avatar")
                  .append($("<p>").attr({ "data-letter-chat": Utility.getAlphabentFromName(senderName) })),
              ),
          )
          .append(
            $("<div>")
              .addClass("col-11 no-padding")
              .append($("<div>").addClass(`others-message tri-right left-in`).text(message))
              .append(
                $("<div>")
                  .addClass(`time-container position-right`)
                  .append($("<span>").addClass(`time position-right`).text(Utility.formatTime(time))),
              ),
          ),
      );

    return messageElem;
  }
}

export default CommonActionView;
