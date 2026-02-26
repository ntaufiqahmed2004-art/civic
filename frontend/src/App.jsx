import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ReportPage from './pages/ReportPage';
import CitizenDashboard from './pages/CitizenDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  // ADD THIS: handleLogout was missing!
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('landing');
  };

  return (
    <div className="App">
      {/* LANDING */}
      {currentPage === 'landing' && <LandingPage onNavigate={setCurrentPage} />}
      
      {/* AUTH */}
      {currentPage === 'register' && <RegisterPage onNavigate={setCurrentPage} />}
      {currentPage === 'login' && <LoginPage onNavigate={setCurrentPage} onLoginSuccess={handleLoginSuccess} />}

      {/* GUEST REPORTING */}
      {currentPage === 'report' && (
        <div className="guest-flow">
          <button onClick={() => setCurrentPage('landing')} style={{margin: '20px'}}>← Back</button>
          <ReportPage user={null} onNavigate={setCurrentPage} /> 
        </div>
      )}

      {/* DASHBOARDS */}
      {/* 1. Admin Dash */}
      {currentPage === 'admin-dash' && user?.role === 'ADMIN' && (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}

      {/* 2. Citizen Dash - REMOVED the extra <div> that was blocking it */}
      {currentPage === 'citizen-dash' && user?.role === 'CITIZEN' && (
        <CitizenDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;