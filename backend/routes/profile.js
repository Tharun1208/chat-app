const router=
require("express").Router();

const User=
require("../models/User");

router.put(
"/update",
async(req,res)=>{

try{

const updated=

await User.findByIdAndUpdate(

req.body.id,

{

profilePic:
req.body.profilePic,

bio:
req.body.bio

},

{
new:true
}

);

res.send(updated);

}

catch(err){

res.status(500)
.send("Failed");

}

}
);

module.exports=router;