class ResponseManager {
  static sendSuccessStatus(response, statusCode, responseDetails) {
    let responseMessage = {
      header: {
        header_id: "chatServiceHeader",
        version: 1.0,
      },
      body: {
        status: statusCode,
        message: responseDetails,
      },
    };

    response.send(responseMessage);
  }

  static sendErrorStatus(response, statusCode, responseDetails) {
    let responseMessage = {
      header: {
        header_id: "chatServiceHeader",
        version: 1.0,
      },
      body: {
        status: statusCode,
        message: responseDetails,
      },
    };
    response.send(responseMessage);
  }
}

module.exports = ResponseManager;
