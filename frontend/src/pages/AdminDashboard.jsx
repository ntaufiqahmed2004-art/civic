import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, AlertCircle, Info, X, LogOut, Loader2 } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('NOT_REVIEWED');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/complaints/all', {
        params: {
          department: user.department,
          city: user.location
        }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const params = new URLSearchParams();
      params.append('status', newStatus);
      await axios.put(`http://localhost:8080/api/complaints/${id}/status`, params);
      alert("Status updated to: " + newStatus);
      fetchData();
      setSelectedIssue(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="adminRoot">
      <nav className="topNav">
        <div className="navLeft">
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
        </div>
        
        <div className="profile-group">
          <div className="admin-info">
            <p className="admin-name">{user?.name}</p>
            <p className="admin-dept">{user?.department} Dept</p>
          </div>
          <div className="profile-circle">{user?.name?.charAt(0)}</div>
          <button onClick={onLogout} className="logoutBtn">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="dashboardMain">
        <div className="statsBar">
          <div className="statCard">Total {user?.department} Issues: {complaints.length}</div>
          <div className="statCard blue">Viewing: {filter.replace('_', ' ')} ({complaints.filter(c => (c.status || 'NOT_REVIEWED') === filter).length})</div>
        </div>

        {loading ? (
          <div className="loaderContainer"><Loader2 className="spinner" /> Loading reports...</div>
        ) : (
          <div className="cardGrid">
            {complaints
              .filter(c => (c.status || 'NOT_REVIEWED') === filter)
              .map(item => (
                <div key={item.id} className="complaintCard">
                  <div className="cardLeft">
                    {item.imageUrl && (
                      <img 
                        src={`http://localhost:8080/uploads/${item.imageUrl.split('\\').pop()}`} 
                        alt="Issue" className="rectImg" 
                        loading="lazy"
                      />
                    )}
                    <div className="cardIcons">
                      <span className="priorityTag"><AlertCircle size={12}/> AI Verified</span>
                      <span className="locTag"><MapPin size={12}/> {item.location?.split(',')[0]}</span>
                    </div>
                  </div>
                  <div className="cardRight">
                    <p className="descriptionText">{item.description}</p>
                    <button className="viewBtn" onClick={() => setSelectedIssue(item)}>
                      <Info size={16}/> Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {selectedIssue && (
        <div className="modalOverlay" onClick={() => setSelectedIssue(null)}>
          <div className="detailsModal" onClick={e => e.stopPropagation()}>
            <button className="closeBtn" onClick={() => setSelectedIssue(null)}><X /></button>
            <div className="modalGrid">
              <div className="modalInfo">
                <h3>Complaint Details</h3>
                <hr />
                <div className="detailRow"><strong>Reported by:</strong> {selectedIssue.email}</div>
                <div className="detailRow"><strong>Message:</strong> {selectedIssue.description}</div>
                
                <img 
                  src={`http://localhost:8080/uploads/${selectedIssue.imageUrl?.split(/[\\/]/).pop()}`}
                  className="modalImg" 
                  alt="Full view"
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
                     Confirm Change
                   </button>
                </div>
              </div>
              <div className="modalMap">
                <h3>Location Map</h3>
                <iframe
                  title="map"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '12px' }}
                  src={`https://maps.google.com/maps?q=${selectedIssue.location}&z=15&output=embed`}
                  allowFullScreen
                ></iframe>
                <p className="coordText">Location: {selectedIssue.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;