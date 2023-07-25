const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

const moment = require("moment");
const mysql = require("mysql2");
const { MYSQL_INFO } = require("./config.js");

const db = mysql.createConnection(MYSQL_INFO);

db.connect();
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
    db.query(
      `
        INSERT INTO message (content, created, user)
            VALUES(?, NOW(), ?)
      `,
      [msg, user],
      (error, result) => {
        if (error) {
          throw error;
        }
        console.log(result);
      },
    );
    io.emit("chatting", {
      user,
      msg,
      time: moment(new Date()).format("h:ss A"),
    });
  });
});
server.listen(PORT, () => console.log(`server is running ${PORT}`));
