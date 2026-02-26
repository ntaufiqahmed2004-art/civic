import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Send, MapPin } from 'lucide-react';

const ReportPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    description: '',
    department: 'Roads',
    location: '',
    image: null
  });

  // Automatically get location when page loads
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          location: `${position.coords.latitude}, ${position.coords.longitude}`
        }));
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // FormData is required for sending Files to Spring Boot
    const data = new FormData();
    data.append('email', formData.email);
    data.append('description', formData.description);
    data.append('department', formData.department);
    data.append('location', formData.location);
    data.append('image', formData.image);

    try {
      const response = await axios.post('http://localhost:8080/api/complaints/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(response.data); // Should show your success message from Java
      onNavigate('landing'); // Go back to home after success
    } catch (error) {
      console.error(error);
      alert("Submission failed. Check if Backend is running!");
    }
  };

  return (
    <div className="report-container" style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2>Submit Civic Complaint</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" placeholder="Your Email" required 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        
        <select onChange={(e) => setFormData({...formData, department: e.target.value})}>
          <option value="Roads">Roads & Potholes</option>
          <option value="Sanitation">Sanitation / Trash</option>
          <option value="Electricity">Electricity</option>
        </select>

        <input 
          type="text" value={formData.location} placeholder="Location (GPS)" readOnly 
          style={{ background: '#eee' }}
        />

        <textarea 
          placeholder="Describe the issue..." 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
        />

        <div className="file-input">
          <label><Camera /> Upload Photo</label>
          <input 
            type="file" accept="image/*" required
            onChange={(e) => setFormData({...formData, image: e.target.files[0]})} 
          />
        </div>

        <button type="submit" className="cta-button">
          <Send size={18} /> Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportPage;