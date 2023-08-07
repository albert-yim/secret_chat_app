"use strict";
const socket = io();
const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
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
// Focus textArea so that user can type the message without click textArea
chatInput.focus();
// Send message with Enter key. When checkbox is checked
chatInput.addEventListener("keypress", (event) => {
  if (!event.shiftKey && event.keyCode === 13) {
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
  this.makeLi = () => {
    const li = document.createElement("li");
    const isCurrentUser = userId == this.id;
    const tagName = isCurrentUser ? "li" : "body";
    li.classList.add(isCurrentUser ? "sent" : "received");
    const dom = `
            <div class="profile-start">
              <span class="tag"><</span>
              <span class="tag-type">${tagName}</span>
              <span class="attribute">class</span>
              <span class="equal">=</span>
              <span class="user">"${this.name}"</span>
              <span class="attribute">time</span>
              <span class="equal">=</span>
              <span class="user">${this.time}</span>
              <span class="tag">></span>
            </div>
            <div class="message">${this.msg}</div>
            <div class="profile-end">
              <span class="tag"><&#47;</span>
              <span class="tag-type">${tagName}</span>
              <span class="tag">></span>
            </div>
`;
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}
