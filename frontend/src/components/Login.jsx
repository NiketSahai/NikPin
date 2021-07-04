import React, { useState, useRef } from "react";
import "./login.css";
import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";

const Login = (props) => {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", user);
      props.myStorage.setItem("user", res.data.username);
      props.setCurrentUser(res.data.username);
      props.setShowLogin(false);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        NikPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button className="loginButton">Login</button>
        {error && <span className="failure">Something went wrong</span>}
      </form>
      <Cancel
        className="loginCancel"
        onClick={() => props.setShowLogin(false)}
      />
    </div>
  );
};

export default Login;
