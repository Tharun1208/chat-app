const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const path = require("path");

const { Server } = require("socket.io");

const userRoute = require("./routes/user");
const messageRoute = require("./routes/message");
const profileRoute = require("./routes/profile");

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
cors:{
origin:"http://localhost:3000",
methods:["GET","POST","PUT"]
}
});

const onlineUsers = new Set();

app.use(cors());
app.use(express.json());

app.use(
"/uploads",
express.static(
path.join(__dirname,"uploads")
)
);

app.use("/api",userRoute);
app.use("/message",messageRoute);
app.use("/profile",profileRoute);

mongoose
.connect(
"mongodb://127.0.0.1:27017/chathub"
)
.then(()=>{
console.log("Mongo Connected");
})
.catch((err)=>{
console.log(err);
});

io.on("connection",(socket)=>{

console.log(
"Connected:",
socket.id
);

socket.on(
"join",
(username)=>{

socket.username = username;

onlineUsers.add(username);

io.emit(
"onlineUsers",
Array.from(onlineUsers)
);

}
);

socket.on(
"sendMessage",
(data)=>{

io.emit(
"receiveMessage",
data
);

}
);

socket.on(
"disconnect",
()=>{

console.log(
"Disconnected:",
socket.id
);

if(socket.username){

onlineUsers.delete(
socket.username
);

}

io.emit(
"onlineUsers",
Array.from(onlineUsers)
);

}
);

});

server.listen(
5000,
()=>{

console.log(
"Server Running on Port 5000"
);

}
);
