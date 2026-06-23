
const router=
require("express")
.Router();

const Message=
require("../models/Message");

router.post(
"/send",

async(req,res)=>{

try{

const newMessage=
new Message(req.body);

await newMessage.save();

res.send("Sent");

}

catch(err){

console.log(err);

res.status(500)
.send("Failed");

}

}
);



router.get(
"/:sender/:receiver",

async(req,res)=>{

try{

const messages=

await Message.find({

$or:[

{

sender:
req.params.sender,

receiver:
req.params.receiver

},

{

sender:
req.params.receiver,

receiver:
req.params.sender

}

]

});

res.send(
messages
);

}

catch(err){

console.log(err);

res
.status(500)
.send(
"Failed"
);

}

}
);

module.exports=
router;
