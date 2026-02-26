import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('NOT_REVIEWED');
  const [selectedIssue, setSelectedIssue] = useState(null); // State for the Detail View

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/complaints/all');
      setComplaints(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const params = new URLSearchParams();
      params.append('status', newStatus);
      await axios.put(`http://localhost:8080/api/complaints/${id}/status`, params);
      alert("Status Updated!");
      fetchData();
      setSelectedIssue(null); // Close modal after update
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="adminRoot">
      {/* TOP NAVIGATION */}
      <nav className="topNav">
        <h2 className="logo">CivicFix <span>Admin</span></h2>
        <div className="navTabs">
          {['NOT_REVIEWED', 'REVIEWED', 'RESOLVED'].map(tab => (
            <button 
              key={tab}
              className={`tabBtn ${filter === tab ? 'activeTab' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="profile-circle">AD</div>
      </nav>

      <main className="dashboardMain">
        {/* STATS BAR */}
        <div className="statsBar">
          <div className="statCard">Total: {complaints.length}</div>
          <div className="statCard blue">Current Tab: {complaints.filter(c => (c.status || 'NOT_REVIEWED') === filter).length}</div>
        </div>

        {/* COMPLAINT CARDS */}
        <div className="cardGrid">
          {complaints
            .filter(c => (c.status || 'NOT_REVIEWED') === filter)
            .map(item => (
              <div key={item.id} className="complaintCard">
                <div className="cardLeft">
                  <img 
                    src={`http://localhost:8080/uploads/${item.imageUrl.split('\\').pop()}`} 
                    alt="Issue" className="rectImg" 
                  />
                  <div className="cardIcons">
                    <span><AlertCircle size={14}/> P1</span>
                    <span><MapPin size={14}/> {item.location.split(',')[0]}</span>
                  </div>
                </div>
                <div className="cardRight">
                  <p className="descriptionText">{item.description}</p>
                  <div className="cardActions">
                    <button className="viewBtn" onClick={() => setSelectedIssue(item)}>
                      <Info size={16}/> View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* VIEW DETAILS MODAL */}
      {selectedIssue && (
        <div className="modalOverlay" onClick={() => setSelectedIssue(null)}>
          <div className="detailsModal" onClick={e => e.stopPropagation()}>
            <button className="closeBtn" onClick={() => setSelectedIssue(null)}><X /></button>
            <div className="modalGrid">
              <div className="modalInfo">
                <h3>Complaint Details</h3>
                <hr />
                <p><strong>User:</strong> {selectedIssue.email}</p>
                <p><strong>Dept:</strong> {selectedIssue.department}</p>
                <p><strong>Message:</strong> {selectedIssue.description}</p>
                <img 
                  src={`http://localhost:8080/uploads/${selectedIssue.imageUrl.split('\\').pop()}`} 
                  className="modalImg" 
                />
                <div className="modalActions">
                   <select id="statusUpdate" className="statusSelect">
                      <option value="REVIEWED">Mark Reviewed</option>
                      <option value="RESOLVED">Mark Resolved</option>
                   </select>
                   <button 
                    className="updateBtn"
                    onClick={() => updateStatus(selectedIssue.id, document.getElementById('statusUpdate').value)}
                   >
                     Submit Change
                   </button>
                </div>
              </div>
              <div className="modalMap">
                <h3>Live Location</h3>
                <iframe
                  title="map"
                  width="100%"
                  height="350"
                  style={{ border: 0, borderRadius: '12px' }}
                  src={`https://maps.google.com/maps?q=${selectedIssue.location}&z=15&output=embed`}
                  allowFullScreen
                ></iframe>
                <p className="coordText">GPS: {selectedIssue.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;