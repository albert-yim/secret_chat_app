const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

const moment = require("moment");
const { db } = require("./config.js");

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "src")));

// io.of("/work").adapter.on("join-room", (room, id) => {
//   console.log(`socket ${id} has joined room: ${room}`);
// });
// SELECT content, DATE_FORMAT(created,%y-%m-%d) as created, id, user, name FROM message JOIN user ON message.user = user.id
io.on("connection", (socket) => {
  socket.on("joinChat", () => {
    console.log(`join chat ${socket.id}!!`);
    db.query(
      `
         SELECT content, DATE_FORMAT(created,'%y-%m-%d %H:%i') as created, user.id, user, name FROM message JOIN user ON message.user = user.id 
    `,
      [],
      (error, result) => {
        if (error) {
          throw error;
        }
        io.to(socket.id).emit("getMessages", result);
      },
    );
  });
  socket.on("login", (data) => {
    io.emit("login", data);
    console.log("app.js: connection login");
  });

  socket.on("chatting", (data) => {
    const { user, msg } = data;
    addMessageOnDB(user, msg);
    emitMessageToOther(user, msg);
  });
});

function addMessageOnDB(user, msg) {
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
}

function emitMessageToOther(user, msg) {
  db.query(
    `
SELECT * from user WHERE id=?
      `,
    [user],
    (error, result) => {
      if (error) {
        console.log(error);
        throw error;
      }
      console.log(result);
      console.log(result[0].name);
      io.emit("chatting", {
        user,
        userName: result[0].name,
        msg,
        time: moment(new Date()).format("h:ss A"),
      });
    },
  );
}
server.listen(PORT, () => console.log(`server is running ${PORT}`));
