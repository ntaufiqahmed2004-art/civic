import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CITIZEN',
    department: 'General',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await axios.post(`http://localhost:8080${endpoint}`, formData);
      // Save user session to local storage
      localStorage.setItem('user', JSON.stringify(response.data));
      onLoginSuccess(response.data);
    } catch (err) {
      alert(err.response?.data || "Authentication failed!");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="subtitle">{isLogin ? 'Login to manage civic issues' : 'Join us to fix your city'}</p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          )}
          
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

          {!isLogin && (
            <>
              <div className="role-selector">
                <label>Register as:</label>
                <select name="role" onChange={handleChange}>
                  <option value="CITIZEN">Citizen</option>
                  <option value="ADMIN">Authority / Admin</option>
                </select>
              </div>

              {formData.role === 'ADMIN' && (
                <select name="department" onChange={handleChange} className="dept-select">
                  <option value="Roads">Roads & Highways</option>
                  <option value="Sanitation">Sanitation / Waste</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water Supply</option>
                </select>
              )}

              <input type="text" name="location" placeholder="Your City (e.g., Coimbatore)" onChange={handleChange} required />
            </>
          )}

          <button type="submit" className="auth-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "New to CivicFix?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Register here' : ' Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;