import React,{useState,useEffect,useRef}from "react";
import {io}from "socket.io-client";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "../styles/chat.css";

const socket=io("http://localhost:5000");
function Chat(){

const navigate=useNavigate();

const bottomRef = useRef(null);


const [currentUser,setCurrentUser]=useState(
JSON.parse(
localStorage.getItem("user")
)
||
{
name:"",
username:"",
bio:"",
profilePic:"https://i.imgur.com/6VBx3io.png"
}
);

const [profileOpen,setProfileOpen]=useState(false);

const [tempBio,setTempBio]=useState(currentUser.bio);

const [unreadCounts,setUnreadCounts] = useState(

JSON.parse(
localStorage.getItem("unreadCounts")
)

||

{}

);

const [tempImage,setTempImage]=useState(null);

const [selectedProfileUser,
setSelectedProfileUser]=useState(null);

const [search,setSearch]=useState("");

const [searchUsers,
setSearchUsers]=
useState([]);

const [chatUsers,setChatUsers]=useState(

JSON.parse(

localStorage.getItem(
`chatUsers_${currentUser.username}`
)

)

||

[]

);

const [activeUser,
setActiveUser]=
useState(null);


const [messages,
setMessages]=
useState(

JSON.parse(
localStorage.getItem(
"messages"
)
)

||

[]

);


const [text,
setText]=useState("");

const searchUser=
async(value)=>{

setSearch(value);

if(!value){

setSearchUsers([]);

return;

}

try{

const res=
await axios.get(
`http://localhost:5000/api/search/${value}`
);

setSearchUsers(
res.data
);

}

catch(err){

console.log(err);

}

};
const openChat=async(user)=>{

setUnreadCounts(prev=>{

const updated={

...prev,

[user.username]:0

};

localStorage.setItem(
"unreadCounts",
JSON.stringify(updated)
);

return updated;

});

const latest=

JSON.parse(
localStorage.getItem("user")
);


if(
latest?.username
===
user.username
){

setActiveUser(
latest
);

}else{

setActiveUser(
user
);

}

localStorage.setItem(
"activeUser",
JSON.stringify(user)
);

try{

const res=
await axios.get(

`http://localhost:5000/message/${currentUser.username}/${user.username}`

);

const formatted=

res.data.map(
m=>({

...m,

from:

m.sender===currentUser.username

?

"me"

:

"them"

})
);

setMessages(
formatted
);

localStorage.setItem(
"messages",
JSON.stringify(
formatted
)
);

}

catch(err){

console.log(err);

setMessages([]);

}

const existing =
JSON.parse(
localStorage.getItem(`chatUsers_${currentUser.username}`)
)
||
[];

const already =
existing.find(
u => u._id === user._id
);

if(!already){

const updated = [
...existing,
user
];

localStorage.setItem(
`chatUsers_${currentUser.username}`,
JSON.stringify(updated)
);

setChatUsers(updated);

console.log(
"Saved Users:",
updated
);

}


};


const saveProfile=
async()=>{

try{

const formData=
new FormData();

formData.append(
"id",
currentUser._id
);

formData.append(
"bio",
tempBio
);

if(tempImage){

formData.append(
"profilePic",
tempImage
);

}

const res=
await axios.put(

"http://localhost:5000/profile/update",

formData,

{
headers:{
"Content-Type":
"multipart/form-data"
}
}

);

setCurrentUser(
res.data
);

localStorage.setItem(

"user",

JSON.stringify(
res.data
)

);
const users =

JSON.parse(
localStorage.getItem(`chatUsers_${currentUser.username}`)
)

||

[];

const updatedUsers =

users.map(u =>

u._id === res.data._id

?

{
...u,
profilePic: res.data.profilePic,
bio: res.data.bio
}

:

u

);

localStorage.setItem(

`chatUsers_${currentUser.username}`,

JSON.stringify(
updatedUsers
)

);

setChatUsers(
updatedUsers
);

setProfileOpen(false);

}

catch(err){

console.log(err);

}

};
const logout=
()=>{

localStorage.removeItem(
"user"
);

navigate("/");

};
const sendMessage=
async()=>{

if(
!text.trim()
||
!activeUser
)
return;

const time=
new Date()
.toLocaleTimeString(
[],
{
hour:"2-digit",
minute:"2-digit"
}
);

const msg={

sender:
currentUser.username,

receiver:
activeUser.username,

text,

time,

from:"me"

};

try{

await axios.post(

"http://localhost:5000/message/send",

msg

);

socket.emit(

"sendMessage",

msg

);

setMessages(

prev=>

[

...prev,

msg

]

);

const updatedUsers =

chatUsers.map(u =>

u.username === activeUser.username

?

{
...u,
lastMessage:text
}

:

u

);

setChatUsers(
updatedUsers
);

localStorage.setItem(

`chatUsers_${currentUser.username}`,

JSON.stringify(
updatedUsers
)

);

setText("");

}

catch(err){

console.log(err);

}

};
useEffect(()=>{

const handleReceiveMessage = (data) => {

if(
data.sender === currentUser.username
){
return;
}

if (
data.sender !== currentUser.username &&
data.sender !== activeUser?.username
) {

setUnreadCounts(prev=>{

const updated={

...prev,

[data.sender]:
(prev[data.sender] || 0) + 1

};

localStorage.setItem(
"unreadCounts",
JSON.stringify(updated)
);

return updated;

});

}

if (
data.sender === activeUser?.username ||
data.receiver === activeUser?.username
) {

setMessages(prev => [

...prev,

{
...data,
from:"them"
}

]);

}

};


socket.on("receiveMessage", handleReceiveMessage);

return () => {
  socket.off("receiveMessage", handleReceiveMessage);
};

}, [
activeUser,
currentUser.username
]);

const [onlineUsers,setOnlineUsers]=useState([]);
useEffect(()=>{

bottomRef.current?.scrollIntoView({

behavior:"smooth"

});

},[messages]);

useEffect(()=>{

socket.emit(
"join",
currentUser.username
);

socket.on(
"onlineUsers",
(users)=>{

setOnlineUsers(users);

}
);

return()=>{

socket.off(
"onlineUsers"
);

};

},[
currentUser.username
]);

return(

<div className="wa">

<div className="sidebar">

<div className="sidebar-top">

<h3>

NexTalk

</h3>

<img
className="profile-small"
src={
currentUser.profilePic
?
`${currentUser.profilePic}?t=${Date.now()}`
:
"https://i.imgur.com/6VBx3io.png"
}
alt=""
onClick={()=>
setProfileOpen(true)
}
/>

</div>

<div className="search">

<input

placeholder="Search username"

value={search}

onChange={(e)=>
searchUser(
e.target.value
)
}

/>

</div>


<div className="chat-list">


{

(search
?
searchUsers
:
chatUsers
).map((u)=>(

<div
key={u._id}
className="chat-item"
>

<img
className="avatar-circle"
src={u.profilePic}
alt="profile"
onError={(e)=>{
e.target.src =
"https://i.imgur.com/6VBx3io.png";
}}
onClick={()=>
setSelectedProfileUser(u)
}
/>

<div
onClick={()=>
openChat(u)
}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>

<b>
{u.username}
</b>

{

unreadCounts[
u.username
] > 0

&&

<span
className="unread-badge"

>

{
unreadCounts[
u.username
]
}

</span>

}

</div>

<p
className="last-msg"
>

{
u.lastMessage
||
u.name
}

</p>

</div>

</div>

))


}

</div>

</div>

<div className="chat">

{

activeUser

?

<>

<div className="chat-header">

<img

className="avatar-circle"

src={
activeUser.profilePic
||
"https://i.imgur.com/6VBx3io.png"
}

alt=""

/>

<div>

<div className="chat-name">

{activeUser.username}

</div>

<div className="online">

{

onlineUsers.includes(
activeUser.username
)

?

"🟢 Online"

:

"⚫ Offline"

}

</div>

</div>

</div>

<div className="messages">

{

messages.map(
(m,i)=>

<div
key={i}
className={`bubble ${m.from}`}
>
<div className="msg-text">

{m.text}

</div>

<div className="msg-time">

{m.time}

</div>

</div>

)

}
<div ref={bottomRef}></div>

</div>

<div className="input-bar">

<input

value={text}

placeholder="Type message"

onChange={(e)=>
setText(
e.target.value
)
}

onKeyDown={(e)=>

e.key==="Enter"

&&

sendMessage()

}

/>

<button
onClick={
sendMessage
}
>

➤

</button>

</div>

</>

:

<div className="empty">

Search users

</div>

}

</div>

{

profileOpen

&&

<div
className="overlay"
>

<div
className="drawer"
>

<img
className="big-avatar"

src={
tempImage
?
URL.createObjectURL(tempImage)
:
currentUser.profilePic
}

alt=""
/>

<h2>

{currentUser.name}

</h2>

<p>

@{currentUser.username}

</p>

<textarea

value={tempBio}

onChange={(e)=>
setTempBio(
e.target.value
)
}

/>

<input

type="file"

onChange={(e)=>
setTempImage(
e.target.files[0]
)
}

/>

<button
onClick={
saveProfile
}
>

Save

</button>

<button
onClick={
logout
}
>

Logout

</button>

</div>

</div>

}

{

selectedProfileUser

&&

<div
className="overlay"
onClick={()=>
setSelectedProfileUser(null)
}
>

<div
className="drawer"
>

<img

className="big-avatar"

src={
selectedProfileUser.profilePic
||
"https://i.imgur.com/6VBx3io.png"
}

alt=""

/>

<h2>

{selectedProfileUser.name}

</h2>

<p>

@{selectedProfileUser.username}

</p>

<p>

{selectedProfileUser.bio}

</p>

</div>

</div>

}

</div>

);

}

export default Chat;