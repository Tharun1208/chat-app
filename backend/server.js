const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");

const userRoute=
require("./routes/user");

const messageRoute=
require("./routes/message");

const app=
express();

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

mongoose.connect(
"mongodb://127.0.0.1:27017/chathub"
)

.then(()=>{

console.log(
"Mongo Connected"
);

});

app.listen(
5000,

()=>{

console.log(
"Server Started"
);

}
);