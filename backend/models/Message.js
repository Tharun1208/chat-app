const mongoose=
require("mongoose");

const messageSchema=
new mongoose.Schema({

sender:String,

receiver:String,

text:String,

time:String

});

module.exports=
mongoose.model(
"Message",
messageSchema
);