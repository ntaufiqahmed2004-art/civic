import React, { useState } from 'react';
import axios from 'axios';
import { DEPARTMENTS } from '../constants';
import { getCityFromBrowser } from '../utils/locationHelper';
import './RegisterPage.css';

const RegisterPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    role: 'CITIZEN', department: 'General', location: ''
  });
  const [loadingLoc, setLoadingLoc] = useState(false);

  const handleDetectCity = async () => {
    setLoadingLoc(true);
    try {
      const city = await getCityFromBrowser();
      setFormData({ ...formData, location: city });
    } catch (err) {
      alert(err);
    } finally {
      setLoadingLoc(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      alert("Account Created! Moving to Login...");
      onNavigate('login');
    } catch (err) {
      alert("Registration failed: " + err.response?.data);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" required onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" required onChange={e => setFormData({...formData, password: e.target.value})} />
          
          <div className="loc-row">
            <input type="text" placeholder="City" value={formData.location} required readOnly />
            <button type="button" onClick={handleDetectCity} className="detect-btn">
              {loadingLoc ? "..." : "📍 Detect"}
            </button>
          </div>

          <select onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="CITIZEN">Citizen</option>
            <option value="ADMIN">Authority / Admin</option>
          </select>

          {formData.role === 'ADMIN' && (
            <select onChange={e => setFormData({...formData, department: e.target.value})}>
              <option value="">Select Dept</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          )}

          <button type="submit" className="main-btn">Register</button>
        </form>
        <p onClick={() => onNavigate('login')} className="toggle-link">Already have an account? Login</p>
      </div>
    </div>
  );
};

export default RegisterPage;