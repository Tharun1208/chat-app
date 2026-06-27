const router = require("express").Router();

const User = require("../models/User");


// REGISTER
router.post("/register", async (req, res) => {

try {

const existingUsername =
await User.findOne({
username: req.body.username
});

if (existingUsername) {

return res
.status(400)
.json({
message: "Username already exists"
});

}

const existingEmail =
await User.findOne({
email: req.body.email
});

if (existingEmail) {

return res
.status(400)
.json({
message: "Email already exists"
});

}

const user =
new User(req.body);

await user.save();

res.status(200).json({
message: "Registered"
});

}

catch (err) {

console.log(err);

res
.status(500)
.json({
message: "Register Failed"
});

}

});


// LOGIN
router.post("/login", async (req, res) => {

try {

const user =
await User.findOne({

username: req.body.username,
password: req.body.password

});

if (!user) {

return res
.status(400)
.send(
"Invalid Login"
);

}

res.send(user);

}

catch (err) {

console.log(err);

res
.status(500)
.send(
"Login Failed"
);

}

});


// SEARCH USER
router.get("/search/:username", async (req, res) => {

try {

const users =
await User.find({

username: {
$regex: req.params.username,
$options: "i"
}

}).select(
"name username email bio profilePic"
);

res.json(users);

}

catch (err) {

console.log(err);

res
.status(500)
.send(
"Search Failed"
);

}
const mongoose=
require("mongoose");

const userSchema=
new mongoose.Schema({

name:String,

username:String,

email:String,

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
userSchema
);
});


module.exports = router;