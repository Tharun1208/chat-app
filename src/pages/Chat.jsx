import React,{useState,useEffect}from "react";
import {io}from "socket.io-client";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "../styles/chat.css";

function Chat(){

const navigate=useNavigate();
const socket=io("http://localhost:5000");

const [theme,setTheme]=useState("dark");

const [currentUser,setCurrentUser]=useState(
JSON.parse(
localStorage.getItem("user")
)
||
{
name:"",
username:"",
bio:"Available",
profilePic:"https://i.imgur.com/6VBx3io.png"
}
);

const [profileOpen,setProfileOpen]=useState(false);

const [tempBio,setTempBio]=useState(
currentUser.bio
);

const [tempImage,setTempImage]=useState(null);

const [selectedProfileUser,
setSelectedProfileUser]=useState(null);

const [search,setSearch]=useState("");

const [searchUsers,
setSearchUsers]=
useState(

JSON.parse(
localStorage.getItem(
"chatUsers"
)
)

||

[]

);


const [activeUser,
setActiveUser]=
useState(

JSON.parse(
localStorage.getItem(
"activeUser"
)
)

||

null

);


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

const existing=

JSON.parse(
localStorage.getItem(
"chatUsers"
)
)

||

[];

const already=

existing.find(
u=>u._id===user._id
);

if(!already){

const updated=[

...existing,
user

];

localStorage.setItem(

"chatUsers",

JSON.stringify(
updated
)

);

setSearchUsers(
updated
);

}

};





const saveProfile=
async()=>{

const image=

tempImage

?

URL.createObjectURL(
tempImage
)

:

currentUser.profilePic;

try{

const res=

await axios.put(

"http://localhost:5000/profile/update",

{

id:
currentUser._id,

bio:
tempBio,

profilePic:
image

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

setText("");

}

catch(err){

console.log(err);

}

};
useEffect(()=>{

socket.on(

"receiveMessage",

(data)=>{

if(

data.sender===activeUser?.username

||

data.receiver===activeUser?.username

){

setMessages(

prev=>

[

...prev,

{

...data,

from:

data.sender===currentUser.username

?

"me"

:

"them"

}

]

);

}

}

);

return()=>{

socket.off(
"receiveMessage"
);

};

},[
activeUser,
currentUser.username,
socket
]);
return(

<div className={`wa ${theme}`}>

<div className="sidebar">

<div className="sidebar-top">

<h3>

NexTalk

</h3>

<img
className="profile-small"
src={currentUser.profilePic}
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

(searchUsers.length
?
searchUsers
:
[])

.map((u)=>(

<div
key={u._id}
className="chat-item"
>

<img
className="avatar-circle"
src={
u.profilePic
||
"https://i.imgur.com/6VBx3io.png"
}
alt=""
onClick={()=>
setSelectedProfileUser(u)
}
/>

<div
onClick={()=>
openChat(u)
}
>

<b>
{u.username}
</b>

<p>
{u.name}
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

● online

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

onClick={()=>

setTheme(

theme==="dark"

?

"light"

:

"dark"

)

}

>

Theme

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
