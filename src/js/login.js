"use strict";
const socket = io();

const userInput = document.querySelector("#user");
const loginButton = document.querySelector(".login-button");

socket.on("login", (data) => {
  console.log("login info:");
  console.log(location.search);

  const url = new URL(location);
  console.log(url);
  console.log(url.searchParams.get("id"));
  console.log(data);
});

loginButton.addEventListener("click", () => {
  const name = userInput.value;
  socket.emit("login", name);
  console.log("login button clicked");
});
