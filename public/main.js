/* The line `const socket = io();` is creating a new socket connection using the `io()` function. The
`io()` function is typically provided by a library like Socket.io and is used to establish a
connection between the client and the server. The `socket` variable is then assigned the newly
created socket connection, which can be used to send and receive data between the client and the
server. */
const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");

// get username & room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
//joining a room
console.log(username,room)
socket.emit("joinRoom", { username, room });

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room)
    outputRoomUsers(users)
})

//to take message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatmessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// function for outputmeassage
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.user} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room){
   const roomName = document.getElementById('room-name');
   roomName.innerText = room
}

function outputRoomUsers(users){
const roomUsers = document.getElementById('users')
  roomUsers.innerHTML =`${users.map(user=>`<li>${user.username}</li>`).join('')}`
}