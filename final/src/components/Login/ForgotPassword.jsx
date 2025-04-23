import React, { useState } from 'react';
import '../../css/Login/ForgotPassword.css';
import InputField from './InputField';
import { Link ,useNavigate} from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:8080/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText);
        setMessage('');
      } else {
        const data = await response.json();
        setMessage(data.message);
        setError('');
        navigate("/");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setMessage('');
      console.error("Error during password reset:", error);
    }
  };

  return (
    <div className='outer-forgot'>
    <div className="container-forgot">
      <h2 className="form-title">Forgot Password</h2>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <InputField
          type="email"
          name="email"
          placeholder="Enter your email"
          icon="mail"
          value={formData.email}
          onChange={handleChange}
        />
        <InputField
          type="password"
          name="password"
          placeholder="Enter your new password"
          icon="lock"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit" className="forgot-password-button">Reset Password</button>
        {message && <p className="success-message">{message}</p>}
        <div className="error-container">
            {error && <p style={{ fontWeight: 'bold' }} className="error-message">{error}</p>}
          </div>
      </form>

      <p className="back-to-login-text">
        Remembered your password? <Link to="/">Log In</Link>
      </p>
    </div>
    </div>
  );
};

export default ForgotPassword;
