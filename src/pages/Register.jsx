import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

function Register(){

const navigate=
useNavigate();

const [user,setUser]=useState({

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

alert(
response.data.message
);

navigate("/");

}

catch(err){

if(
err.response
){

alert(
err.response.data.message
);

}

else{

alert(
"Server Error"
);

}

console.log(err);

}

};

return(

<div className="register">

<div className="register-card">

<h1>
Create Account
</h1>

<p>
Start your new journey
</p>

<input
name="name"
placeholder="Name"
value={user.name}
onChange={handleChange}
/>

<input
name="username"
placeholder="Username"
value={user.username}
onChange={handleChange}
/>

<input
name="email"
placeholder="Email"
value={user.email}
onChange={handleChange}
/>

<input
type="password"
name="password"
placeholder="Password"
value={user.password}
onChange={handleChange}
/>

<button
onClick={register}
>
Register
</button>

<button
className="secondary"
onClick={()=>
navigate("/")
}
>

Already have account

</button>

</div>

</div>

);

}

export default Register;