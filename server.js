const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const formatmessage = require("./utils/message.js");
const { userJoin, getCurrentUser,userLeave, getRoomUser } = require("./utils/user.js");
//creating server
const server = http.createServer(app);
/* `const io = socketio(server)` is creating a new instance of the Socket.IO server and attaching it to
the existing HTTP server. This allows the server to handle WebSocket connections and enables
real-time communication between the server and the connected clients. The `io` object is used to
emit and receive events between the server and the clients. */
const io = socketio(server);

const bot = "chatbot";

//set static folder
app.use(express.static(__dirname + "/public"));

//for client connection
/* `io.on("connection",socket=>{` is an event listener that listens for a new client connection to the
server using a WebSocket connection. When a new client connects, the callback function is executed,
and the `socket` parameter represents the individual client socket that is connected. */
io.on("connection", (socket) => {
  //data(with request) from user to join
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    /* `socket.emit("message","connected to wechat")` is sending a message to the client that is
            connected to the server using the WebSocket connection. The message being sent is "connected
            to wechat". */
    // for welcome
    socket.emit("message", formatmessage(bot, "Welcome to wechat"));
    //to announce to everyone
    socket.broadcast
      .to(user.room)
      .emit("message", formatmessage(bot, `${user.username} has connected `));
    // user and  room  info
    io.to(user.room).emit('roomUsers',{room:user.room,users:getRoomUser(user.room)})
});
socket.on("chatmessage", (msg) => {
    const user=getCurrentUser(socket.id)
    io.to(user.room).emit("message", formatmessage(user.username, msg));
});
//for disconnection
socket.on("disconnect", () => {
    const user=userLeave(socket.id)
    if(user){
        io.to(user.room).emit("message", formatmessage(bot, `${user.username} has left the chat`));
        io.to(user.room).emit('roomUsers',{room:user.room,users:getRoomUser(user.room)})
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`server is running on port${PORT}`);
});
