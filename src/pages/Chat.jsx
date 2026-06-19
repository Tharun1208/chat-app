import React,{useState} from "react";

import axios from "axios";

import "../styles/chat.css";

function Chat(){

const [text,setText]=
useState("");

const [messages,
setMessages]=
useState([]);

const sendMessage=
async()=>{

if(!text.trim()){

return;

}

try{

await axios.post(

"http://localhost:5000/message/send",

{

sender:"tharun",

receiver:"friend",

message:text

}

);

setMessages([

...messages,

text

]);

setText("");

}

catch(err){

console.log(err);

alert(
"Message Failed"
);

}

};

return(

<div className="chat-container">

<div className="sidebar">

<h2>
ChatHub
</h2>

<input
type="text"
placeholder="Search users"
/>

<div className="user">
John
</div>

<div className="user">
Alex
</div>

</div>

<div className="chat-area">

<div className="chat-header">

Welcome

</div>

<div className="messages">

{

messages.map(
(msg,index)=>

<div
className="message"
key={index}
>

{msg}

</div>

)

}

</div>

<div className="send-box">

<input

value={text}

onChange={(e)=>

setText(
e.target.value
)

}

placeholder=
"Type message"

/>

<button
onClick={
sendMessage
}
>

Send

</button>

</div>

</div>

</div>

);

}

export default Chat;