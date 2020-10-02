import Utility from "./Utility/utility.js";
import WebService from "./webService/webService.js";
import ChatActionView from "./chatActionView/chatActionView.js";
class StartUp {
  constructor() {
    this.registerEvents();
    this.webService = new WebService();
    this.chatActionView = new ChatActionView();
  }

  registerEvents() {
    $("#add-user").on("click", async (_event) => {
      let userName = $("#user-name-container [name = 'username']").val();
      let userEmail = $("#user-name-container [name = 'email']").val();
      if (Utility.isNullOrEmpty(userName) && Utility.isNullOrEmpty(userEmail)) {
        alert("Enter user details");
        return false;
      }

      let requestPayload = {
        userName: userName,
        email: userEmail,
        userActiveStatus: "true",
      };

      await this.webService.registerUser(requestPayload);

      $(".wrapper").load("./pages/chatWindow.html", async () => {
        try {
          $("#connected-user").attr({ "connected-user-name": userName });
          $("#connected-user").attr({ email: userEmail });
          let connectedUserList = await this.webService.getAllUsers();
          if (connectedUserList["body"]["status"] === 200) {
            connectedUserList = connectedUserList["body"]["message"].map((d) => {
              if (d["email"] !== userEmail) return d;
            });
          }
          this.chatActionView.populateConnectedUserList(connectedUserList);
          g_socket.emit("userConnected", requestPayload);
        } catch (_excp) {
          console.log(_excp);
        }
      });
    });
  }
}

$(document).ready(() => {
  new StartUp();
});
