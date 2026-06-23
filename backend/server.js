const express=
require("express");

const mongoose=
require("mongoose");

const cors=
require("cors");

const http=
require("http");

const {Server}=
require("socket.io");

const app=
express();

const server=
http.createServer(app);

const io=
new Server(
server,
{
cors:{
origin:"http://localhost:3000"
}
}
);

const userRoute=
require("./routes/user");

const messageRoute=
require("./routes/message");

const profileRoute=
require("./routes/profile");

app.use(cors());

app.use(express.json());

app.use(
"/api",
userRoute
);

app.use(
"/message",
messageRoute
);

app.use(
"/profile",
profileRoute
);

mongoose
.connect(
"mongodb://127.0.0.1:27017/chathub"
)
.then(()=>{

console.log(
"Mongo Connected"
);

});

io.on(
"connection",
(socket)=>{

console.log(
"Connected:",
socket.id
);

socket.on(
"sendMessage",
(data)=>{

io.emit(
"receiveMessage",
data
);

});

socket.on(
"disconnect",
()=>{

console.log(
"Disconnected"
);

});

});

server.listen(
5000,
()=>{

console.log(
"Server Running"
);

});