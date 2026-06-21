import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const login = () => {
    if (!data.username || !data.password) {
      alert("Fill all fields");
      return;
    }

    // fake login
    localStorage.setItem("chat-user", JSON.stringify(data));
    navigate("/chat");
  };

  return (
    <div className="login">
      <h1>Login</h1>

      <input
        name="username"
        placeholder="Username"
        onChange={(e) =>
          setData({ ...data, username: e.target.value })
        }
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={(e) =>
          setData({ ...data, password: e.target.value })
        }
      />

      <button onClick={login}>Login</button>

      <button onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  );
}

export default Login;