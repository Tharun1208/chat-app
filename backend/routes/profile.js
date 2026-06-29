const router = require("express").Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

destination:(req,file,cb)=>{

cb(null,"uploads/");

},

filename:(req,file,cb)=>{

cb(

null,

Date.now() +

"-" +

file.originalname

);

}

});

const upload = multer({
storage
});

router.put(

"/update",

upload.single("profilePic"),

async(req,res)=>{

try{

const updateData = {

bio:req.body.bio

};

if(req.file){

updateData.profilePic =

`http://localhost:5000/uploads/${req.file.filename}`;

}

const updated =

await User.findByIdAndUpdate(

req.body.id,

updateData,

{ new:true }

);

res.send(updated);

}

catch(err){

console.log(err);

res.status(500).send("Failed");

}


}


);

module.exports = router;
