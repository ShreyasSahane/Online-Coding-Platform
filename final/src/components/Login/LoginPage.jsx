import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SocialLogin from "./SocialLogin";
import InputField from "./InputField";
import { Link } from "react-router-dom";
import '../../css/Login/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // New state to track errors

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // Reset error message
    console.log("Submitting login with email:", email, "and password:", password); // Debug log

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Ensure this body is valid
      });

      console.log("Server responded with status:", response.status); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful, token received:", data.token); // Debug log
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email); // Assuming API response includes email
        localStorage.setItem("user_id", data.user_id);
        navigate("/dashboard");
      } else {
        const error = await response.text();
        console.log("Server responded with error:", error); // Debug log
        setError(error); // Show error message
      }
    } catch (err) {
      console.error("An error occurred while logging in:", err);
      setError("An error occurred while logging in.");
    }
  };

  // Function to handle Admin button click
  const handleAdminClick = (e) => {
    e.preventDefault(); // Prevent default form submission
    navigate("/admin-login"); // Navigate to the AdminLogin page
  };

  return (
    <div className="abc">
      <div className="login-container">
        <h2 className="form-title">Log in with</h2>
        <SocialLogin />
        <p className="separator"><span>or</span></p>

        <form onSubmit={handleSubmit} className="login-form">
          <InputField
            type="email"
            placeholder="Email Address"
            icon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            icon="lock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to="/forgot" className="forgot-pass-link">Forgot Password?</Link>

          <button type="submit" className="login-button">Log In</button>
          <button type="button" className="login-button" onClick={handleAdminClick}>Admin</button>
        </form>

        <div className="error-container">
          {error && <p style={{ fontWeight: 'bold' }} className="error-message">{error}</p>}
        </div>

        <p className="signup-text">
          Don&apos;t have an account?
          <Link to="/signup">Signup Now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
