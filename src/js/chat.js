"use strict";
const socket = io();

const enterSend = document.querySelector("#enterSend");
const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const displayConatiner = document.querySelector(".display-container");
const url = new URL(location);
const userId = url.searchParams.get("id");
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
  document.body.style.zoom = 0.99;
});

document.addEventListener("gesturechange", function (e) {
  e.preventDefault();

  document.body.style.zoom = 0.99;
});
document.addEventListener("gestureend", function (e) {
  e.preventDefault();
  document.body.style.zoom = 1;
});

sendButton.addEventListener("click", send);

// Send message with Enter key. When checkbox is checked
chatInput.addEventListener("keypress", (event) => {
  if (!event.shiftKey && event.keyCode === 13 && enterSend.checked) {
    send();
    event.preventDefault();
  }
});
socket.emit("joinChat");
socket.on("getMessages", (data) => {
  var currentDate = new Date(data[0].created || undefined);
  // console.log(currentDate.getDate());
  console.log(currentDate);
  console.log(currentDate.getDate());
  console.log(currentDate.getUTCDate());
  console.log(currentDate.getTime());
  console.log(currentDate.toString());
  data.map((message) => {
    const { content, created, id, user, name } = message;
    const item = new LiModel(user, name, content, created);
    item.makeLi();
  });
  displayConatiner.scrollTo(0, displayConatiner.scrollHeight);
});
socket.on("chatting", (data) => {
  const { user, userName, msg, time } = data;
  const item = new LiModel(user, userName, msg, time);
  item.makeLi();
  displayConatiner.scrollTo(0, displayConatiner.scrollHeight);
});

function send() {
  const param = {
    user: userId,
    msg: chatInput.value,
  };
  if (param.msg === "") {
    chatInput.focus();
    return;
  }
  socket.emit("chatting", param);
  chatInput.value = "";
  chatInput.focus();
}

function LiModel(id, name, msg, time) {
  this.name = name;
  this.msg = msg;
  this.time = time;
  this.id = id;
  this.img =
    id === "1" ? "assets/sol_profile.jpeg" : "assets/yang_profile.jpeg";
  this.makeLi = () => {
    const li = document.createElement("li");
    li.classList.add(userId == this.id ? "sent" : "received");
    const dom = `
            <span class="profile">
              <span class="user">${this.name}</span>
              <img
                class="image"
                src=${this.img}
                alt="any"
              />
            </span>
            <span class="message">${this.msg}</span>
            <span class="time">${this.time}</span>
`;
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}
