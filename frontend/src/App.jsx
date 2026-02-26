import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import ReportPage from './pages/ReportPage';
import AdminDashboard from './pages/AdminDashboard'; // 1. Import it

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [userRole, setUserRole] = useState(null); // 'ADMIN' or 'CITIZEN'

  return (
    <div className="App">
      {/* 2. Navigation Logic */}
      {currentPage === 'landing' && (
        <LandingPage onNavigate={setCurrentPage} />
      )}
      
      {currentPage === 'report' && (
        <ReportPage onNavigate={setCurrentPage} />
      )}

      {currentPage === 'admin-dash' && (
        <AdminDashboard onNavigate={setCurrentPage} />
      )}

      {/* 3. Temporary Dev Button to jump to Admin (Top Corner) */}
      <div style={{ position: 'fixed', bottom: 10, right: 10, opacity: 0.5 }}>
        <button onClick={() => setCurrentPage('admin-dash')}>Dev: Open Admin</button>
      </div>
    </div>
  );
}

export default App;