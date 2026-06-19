import React,{useState} from "react";

import {useNavigate}
from "react-router-dom";

import axios from "axios";

import "../styles/register.css";

function Register(){

const navigate=
useNavigate();

const [user,setUser]=
useState({

name:"",
username:"",
email:"",
password:""

});

const handleChange=
(e)=>{

setUser({

...user,

[e.target.name]:
e.target.value

});

};

const register=
async()=>{

if(
!user.name||
!user.username||
!user.email||
!user.password
){

alert(
"Fill all fields"
);

return;

}

try{

const response=
await axios.post(

"http://localhost:5000/api/register",

user

);

console.log(
response.data
);

alert(
"Registration Successful"
);

navigate("/");

}

catch(error){

console.log(error);

alert(
"Registration Failed"
);

}

};

return(

<div className="register">

<h1>
Create Account
</h1>

<input
name="name"
placeholder="Full Name"
onChange={handleChange}
/>

<input
name="username"
placeholder="Username"
onChange={handleChange}
/>

<input
name="email"
placeholder="Email"
onChange={handleChange}
/>

<input
type="password"
name="password"
placeholder="Password"
onChange={handleChange}
/>

<button
onClick={register}
>

Register

</button>

<button
onClick={()=>
navigate("/")
}
>

Already Have Account

</button>

</div>

);

}

export default Register;