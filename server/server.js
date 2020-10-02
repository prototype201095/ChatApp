const express = require("express");
var app = express();
const bodyParser = require("body-parser");
var http = require("http").createServer(app);
const io = require("socket.io")(http);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", express.static("client"));
app.set("port", process.env.PORT || 8000);

require("./router/routes.js")(app, io);

http.listen(app.get("port"), () => {
  console.log(`The server is running at port ${app.get("port")}`);
});
