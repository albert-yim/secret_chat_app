"use strict";

const socket = io();

socket.emit("chatting", "from frontend");

socket.on("chatting", (data) => {
  console.log(data);
});
