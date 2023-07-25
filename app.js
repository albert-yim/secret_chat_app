const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);
const socketIO = require("socket.io");
const moment = require("moment");

const io = socketIO(server);

app.use(express.static(path.join(__dirname, "src")));
const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("Success connection");

  socket.on("login", (data) => {
    io.emit("login", data);
    console.log("app.js: connection login");
  });

  socket.on("chatting", (data) => {
    const { user, msg } = data;
    console.log(data);
    io.emit("chatting", {
      user,
      msg,
      time: moment(new Date()).format("h:ss A"),
    });
  });
});
server.listen(PORT, () => console.log(`server is running ${PORT}`));
