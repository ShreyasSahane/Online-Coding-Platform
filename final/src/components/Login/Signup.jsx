import React, { useState } from "react";
import "../../css/Login/Signup.css";
import InputField from "./InputField";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password Match Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords does not match");
      return;
    }

    const payload = {
      username: formData.username,
      user_email: formData.email,
      user_password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Signup failed:", errorText);
        setError(errorText);
      } else {
        const data = await response.json();
        console.log("Signup successful:", data);
        // alert("Signup successful! Redirecting to login...");
        navigate("/"); // Redirect to login page
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="out-contain">
      <div className="container-sign">
        <h2 className="form-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <InputField
            type="text"
            name="username"
            placeholder="User Name"
            icon="person"
            value={formData.username}
            onChange={handleChange}
          />
          <InputField
            type="email"
            name="email"
            placeholder="Email Address"
            icon="mail"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            icon="lock"
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            togglePasswordVisibility={handlePasswordVisibility}
          />
          <InputField
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            icon="lock"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
          <div className="error-container">
            {error && <p style={{ fontWeight: 'bold' }} className="error-message">{error}</p>}
          </div>

        </form>
        <p className="signup-text">
          Already have an account? <Link to="/">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
