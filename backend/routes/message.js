const router=
require("express")
.Router();

const Message=
require("../models/Message");

router.post(
"/send",

async(
req,
res
)=>{

try{

const newMessage=
new Message({

sender:
req.body.sender,

receiver:
req.body.receiver,

text:
req.body.text,

time:
req.body.time

});

await newMessage.save();

res
.status(200)
.send(
"Sent"
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