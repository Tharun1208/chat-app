import React,{useState}
from "react";

import axios
from "axios";

import {
useNavigate
}
from "react-router-dom";

import "../styles/login.css";

function Login(){

const navigate=
useNavigate();

const [data,setData]=
useState({

username:"",
password:""

});

const handleChange=
(e)=>{

setData({

...data,

[e.target.name]:
e.target.value

});

};

const login=
async()=>{

try{

await axios.post(

"http://localhost:5000/api/login",

data

);

alert(
"Login Success"
);

navigate("/chat");

}

catch{

alert(
"Invalid Login"
);

}

};

return(

<div className="login">

<h1>
Login
</h1>

<input
name="username"
placeholder="Username"
onChange={handleChange}
/>

<input
type="password"
name="password"
placeholder="Password"
onChange={handleChange}
/>

<button
onClick={login}
>

Login

</button>

<button
onClick={()=>
navigate(
"/register"
)
}
>

New User

</button>

</div>

);

}

export default Login;