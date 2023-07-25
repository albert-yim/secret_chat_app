"use strict";
const socket = io();

const nickname = document.querySelector("#nickname");
const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const displayConatiner = document.querySelector(".display-container");

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

// Send message with Enter key.
// chatInput.addEventListener("keypress", (event) => {
//   if (event.keyCode === 13) {
//     send();
//   }
// });

socket.on("chatting", (data) => {
  console.log("data is ");
  console.log(data);
  const { user, msg, time } = data;
  const item = new LiModel(user, msg, time);
  item.makeLi();
  displayConatiner.scrollTo(0, displayConatiner.scrollHeight);
});

function send() {
  const url = new URL(location);
  const id = url.searchParams.get("id");
  const param = {
    // name: nickname.value,
    user: id,
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

function LiModel(name, msg, time) {
  this.name = name;
  this.msg = msg;
  this.time = time;

  this.makeLi = () => {
    const li = document.createElement("li");
    li.classList.add(nickname.value === this.name ? "sent" : "received");
    const dom = `
            <span class="profile">
              <span class="user">${this.name}</span>
              <img
                class="image"
                src="https://placeimg.com/50/50/any"
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
