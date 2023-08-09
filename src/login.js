"use strict";
const socket = io();

const user1Btn = document.querySelector("#user1-login-button");
const user2Btn = document.querySelector("#user2-login-button");
socket.on("login", (data) => {
  console.log("login info:");
  console.log(location.search);

  const url = new URL(location);
  console.log(url);
  console.log(url.searchParams.get("id"));
  console.log(data);
});

user1Btn.addEventListener("click", loginToChat);
user2Btn.addEventListener("click", loginToSecret);

function loginToChat() {
  window.location.replace("/chat?id=1");
}

function loginToSecret() {
  window.location.replace("/secret?id=2");
}
