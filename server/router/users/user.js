const UserDbManager = require("../../DbManager/userDbManager.js");
const UserService = require("../../services/userService.js");
const { response } = require("express");
class Users {
  constructor(app, socketEventInstance) {
    this.instantiateUserEndpoints(app, socketEventInstance);
    this.userDbManager = new UserDbManager();
    this.userService = new UserService();
  }

  instantiateUserEndpoints(router, socketEventInstance) {
    router.get("/hello", (request, response) => {
      response.send("Hello from the chat server");
    });

    router.get("/getUserByName", (request, response) => {
      this.userService.getUserByName(request, response);
    });

    router.post("/registerUser", (request, response) => {
      this.userService.createUser(request.body, response, socketEventInstance);
    });

    router.get("/getAllUsers", (request, response) => {
      this.userService.getAllUsers(request, response);
    });
  }
}
module.exports = Users;
