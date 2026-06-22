
import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "../styles/chat.css";

function Chat(){

const navigate=useNavigate();

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
setSearchUsers]=useState([]);

const [activeUser,
setActiveUser]=useState(null);

const [messages,
setMessages]=useState([]);

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

const openChat=
(user)=>{

setActiveUser(user);

setMessages([

{
from:"them",
text:"Hello 👋",
time:"09:21 PM"
},

{
from:"me",
text:"Hi!",
time:"09:22 PM"
}

]);

};

const sendMessage=
()=>{

if(!text.trim())
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

setMessages([
...messages,
{
from:"me",
text,
time
}
]);

setText("");

};

const saveProfile=
()=>{

const updated={

...currentUser,

bio:tempBio,

profilePic:

tempImage

?

URL.createObjectURL(
tempImage
)

:

currentUser.profilePic

};

setCurrentUser(
updated
);

localStorage.setItem(
"user",
JSON.stringify(
updated
)
);

setProfileOpen(false);

};

const logout=
()=>{

localStorage.removeItem(
"user"
);

navigate("/");

};

return(

<div className={`wa ${theme}`}>

<div className="sidebar">

<div className="sidebar-top">

<h3>

WhatsApp

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

searchUsers.map((u)=>(

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

URL.createObjectURL(
tempImage
)

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
