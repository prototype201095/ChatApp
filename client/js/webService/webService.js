class WebService {
  constructor() {}

  /* requested API's */
  getConnectedUserList(searchedUserName) {
    let url = `/getConnectedUsers?user=${searchedUserName}`;
    return this._get(url);
  }

  registerUser(requestObj) {
    let url = `/registeruser`;
    return this._post(url, requestObj);
  }

  createChannel(requestObj) {
    let url = `/createChannel`;
    return this._post(url, requestObj);
  }

  getAllUsers() {
    let url = `/getAllUsers`;
    return this._get(url);
  }

  /*post request*/
  async _post(url, requestBody) {
    return $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify(requestBody),
      contentType: "application/json",
    });
  }

  /* get request*/
  async _get(url) {
    return $.ajax({
      type: "GET",
      url: url,
      contentType: "application/json",
    });
  }
}

export default WebService;
