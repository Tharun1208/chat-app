import React,{useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "../styles/login.css";

function Login(){

const navigate=
useNavigate();

const [data,setData]=
useState({

username:"",
password:""

});

const login=
async()=>{

if(

!data.username||
!data.password

){

alert(
"Fill all fields"
);

return;

}

try{

const response=

await axios.post(

"http://localhost:5000/api/login",

data

);

localStorage.setItem(

"user",

JSON.stringify(
response.data
)

);

alert(
"Login Success"
);

navigate(
"/chat"
);

}

catch(err){

if(
err.response
){

alert(
err.response.data
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

<div className="login">

<h1>

Login

</h1>

<input

name="username"

placeholder="Username"

onChange={(e)=>

setData({

...data,

username:
e.target.value

})

}

/>

<input

type="password"

name="password"

placeholder="Password"

onChange={(e)=>

setData({

...data,

password:
e.target.value

})

}

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

Register

</button>

</div>

);

}

export default Login;
