const Utility = require("../utility/utility.js");
const UserDbManager = require("../DbManager/userDbManager.js");
const ResponseManager = require("../config/responseManager.js");
class UserService {
  constructor() {
    this.userDbManager = new UserDbManager();
  }

  getUserByName(request, response) {
    let { name } = request.query;
    if (Utility.isNullOrEmpty(name)) {
      ResponseManager.sendErrorStatus(response, 400, "searched name is empty");
      return;
    }
    this.userDbManager.getUserDetailsByName(name, response);
  }

  createUser(requestPayload, response, socketEventInstance) {
    if (Utility.isNullOrEmpty(requestPayload)) {
      ResponseManager.sendErrorStatus(response, 400, "requestPayload is empty");
      return;
    }

    const { userName, userActiveStatus, email } = requestPayload;
    if (Utility.isNullOrEmpty(userName)) {
      ResponseManager.sendErrorStatus(response, 400, "username is empty");
      return;
    }

    if (Utility.isNullOrEmpty(userActiveStatus)) {
      ResponseManager.sendErrorStatus(response, 400, "userActiveStatus is empty");
      return;
    }

    if (Utility.isNullOrEmpty(email)) {
      ResponseManager.sendErrorStatus(response, 400, "email is empty");
      return;
    }
    this.userDbManager.insertUserData(requestPayload, response);
  }

  getAllUsers(request, response) {
    this.userDbManager.getAllUserListFromDb(request, response);
  }
}

module.exports = UserService;
