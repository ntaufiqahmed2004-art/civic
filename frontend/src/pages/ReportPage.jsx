import React, { useState } from 'react';
import axios from 'axios';
import { DEPARTMENTS } from '../constants';
import { getCityFromBrowser } from '../utils/locationHelper';
import './ReportPage.css';

const ReportPage = ({ user, onNavigate, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: user ? user.email : '', 
    description: '',
    department: '',
    location: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); // New state for AI button

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetect = async () => {
    setDetecting(true);
    try {
      const city = await getCityFromBrowser();
      setFormData(prev => ({ ...prev, location: city }));
    } catch (err) {
      alert("Could not detect location: " + err);
    } finally {
      setDetecting(false);
    }
  };

  // NEW: Function to call Gemini for a suggested description
  const handleAISuggest = async () => {
    if (!image) return alert("Please upload a photo first!");
    
    setAiLoading(true);
    const data = new FormData();
    data.append('image', image);

    try {
      const res = await axios.post('http://localhost:8080/api/complaints/describe', data);
      setFormData(prev => ({ ...prev, description: res.data }));
    } catch (err) {
      alert(err.response?.data || "AI could not describe this image.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location) return alert("Please detect your location first!");
    
    setLoading(true);
    const data = new FormData();
    data.append('email', formData.email);
    data.append('description', formData.description);
    data.append('department', formData.department);
    data.append('location', formData.location);
    data.append('image', image);

    try {
      const res = await axios.post('http://localhost:8080/api/complaints/submit', data);
      alert(res.data); // This will show "AI verified..." or specific rejection messages
      if (onSuccess) onSuccess(); 
      else if (onNavigate) onNavigate('landing');
    } catch (err) {
      // This catches the AI "Privacy" or "Invalid Issue" rejections
      alert(err.response?.data || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <h3>Report a Problem</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" name="email" placeholder="Your Email" 
            value={formData.email} onChange={handleChange} 
            required readOnly={!!user} 
          />

          <select name="department" value={formData.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <div className="location-input-group">
            <input 
              type="text" name="location" placeholder="City (Auto-detected)" 
              value={formData.location} readOnly required 
            />
            <button type="button" onClick={handleDetect} className="detect-btn">
              {detecting ? "..." : "📍 Detect"}
            </button>
          </div>

          <div className="description-group">
            <textarea 
              name="description" 
              placeholder="What's the issue? (e.g. Pothole near the market)" 
              value={formData.description}
              onChange={handleChange} 
              required 
            />
            <button 
              type="button" 
              onClick={handleAISuggest} 
              className="ai-suggest-btn"
              disabled={aiLoading || !image}
            >
              {aiLoading ? "AI is thinking..." : "✨ AI Suggest Description"}
            </button>
          </div>

          <div className="file-upload">
            <label>Upload Photo of Issue:</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "AI is Verifying Image..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPage;