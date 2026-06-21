import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });

  const register = () => {
    if (!user.username || !user.password) {
      alert("Fill required fields");
      return;
    }

    alert("Registered (frontend only)");
    navigate("/");
  };

  return (
    <div className="register">

      <h1>Create Account</h1>

      <input
        placeholder="Name"
        onChange={(e) =>
          setUser({ ...user, name: e.target.value })
        }
      />

      <input
        placeholder="Username"
        onChange={(e) =>
          setUser({ ...user, username: e.target.value })
        }
      />

      <input
        placeholder="Email"
        onChange={(e) =>
          setUser({ ...user, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setUser({ ...user, password: e.target.value })
        }
      />

      <button onClick={register}>Register</button>

      <button onClick={() => navigate("/")}>
        Already have account
      </button>

    </div>
  );
}

export default Register;