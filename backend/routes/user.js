const router=require("express").Router();

const User=require("../models/User");

router.post(
"/register",

async(req,res)=>{

try{

const user=
new User(req.body);

await user.save();

res.status(200)
.send("Registered");

}

catch(err){

console.log(err);

res.status(500)
.send("Register Failed");

}

}

);

router.post(
"/login",

async(req,res)=>{

try{

console.log(
"LOGIN:",
req.body
);

const user=
await User.findOne({

username:
req.body.username

});

if(!user){

return res
.status(401)
.send(
"User Not Found"
);

}

if(
user.password
!==req.body.password
){

return res
.status(401)
.send(
"Wrong Password"
);

}

res.status(200)
.send(user);

}

catch(err){

console.log(err);

res.status(500)
.send(
"Login Failed"
);

}

}

);

module.exports=router;