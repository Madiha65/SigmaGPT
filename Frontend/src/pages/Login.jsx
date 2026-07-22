//C:\Users\Msoom Ali\Downloads\SigmaGPT\Frontend\src\pages\Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./auth.css";
import backVideo from "../assets/back.mp4";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch {
      setMessage("Something went wrong");
    }
  };

 return (
  <div className="auth-container">

    {/* Background Video */}
    <video
      className="auth-background-video"
      autoPlay
      loop
      muted
      playsInline
    >
      <source src={backVideo} type="video/mp4" />
    </video>

    {/* Dark Blur Overlay */}
    <div className="auth-overlay"></div>

    {/* Login Card */}
    <div className="auth-card">

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Password</label>
        </div>

        <div className="login-options">
          <label>
            <input type="checkbox" />
            Remember Me
          </label>

          <span>Forgot Password?</span>
        </div>

        <button type="submit">
          Log in
        </button>

      </form>

      <p className="message">
        {message}
      </p>

      <p className="switch-auth">
  <span>Don't have an account?</span>

  <button
    type="button"
    onClick={() => navigate("/signup")}
  >
    Register
  </button>
</p>

    </div>
  </div>
);
}

export default Login;