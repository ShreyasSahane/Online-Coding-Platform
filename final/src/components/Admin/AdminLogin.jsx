import React, { useState } from "react";
import "../../css/Admin/AdminLogin.css"; // Ensure you have a CSS file for styling
import InputField from "../Login/InputField";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
  
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const payload = {
        admin_email: formData.email,
        admin_password: formData.password,
      };
  
      try {
        const response = await fetch("http://localhost:8080/admin-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Admin login failed:", errorText);
          setError(errorText);
        } else {
          const data = await response.json();
          console.log("Admin login successful:", data);
          localStorage.setItem("admin_token", data.token); // Store admin token
          navigate("/admin-problems"); // Redirect to admin dashboard
        }
      } catch (error) {
        console.error("Error during admin login:", error);
        setError("An error occurred during admin login. Please try again.");
      }
    };
  
    return (
      <div className="out-contain">
        <div className="container-sign">
          <h2 className="form-title">Admin Login</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <InputField
              type="email"
              name="email"
              placeholder="Admin Email Address"
              icon="mail"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              type="password"
              name="password"
              placeholder="Password"
              icon="lock"
              value={formData.password}
              onChange={handleChange}
            />
            <button type="submit" className="signup-button">
              Log In
            </button>
            <div className="error-container">
              {error && (
                <p style={{ fontWeight: "bold" }} className="error-message">
                  {error}
                </p>
              )}
            </div>
          </form>
          <p className="signup-text">
            Back to <Link to="/">User Login</Link>
          </p>
        </div>
      </div>
    );
  };
  
  export default AdminLogin;
