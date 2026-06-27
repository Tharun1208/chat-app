const mongoose=
require("mongoose");

const UserSchema=
new mongoose.Schema({

name:String,

username:{
type:String,
unique:true
},

email:{
type:String,
unique:true
},

password:String,

bio:{
type:String,
default:"Available"
},

profilePic:{
type:String,
default:
"https://i.imgur.com/6VBx3io.png"
}

});

module.exports=
mongoose.model(
"User",
UserSchema
);