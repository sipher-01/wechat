const express = require("express");
const http =require("http")
const socketio = require("socket.io")
const app = express();

//creating server
const server = http.createServer(app);
const io = socketio(server)

//set static folder
app.use(express.static(__dirname + "/public"));

//for client connection
io.on("connection",socket=>{
        console.log("new web socket connection")
    })
    const PORT = 3000 || process.env.PORT;
    
server.listen(PORT, () => {
  console.log(`server is running on port${PORT}`);
});
