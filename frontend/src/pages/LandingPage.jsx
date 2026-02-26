import React from 'react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-container" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 8%', background: 'white' }}>
        <h1 style={{ color: '#2563eb', margin: 0 }}>CivicFix</h1>
        <button 
          onClick={() => onNavigate('login')}
          style={{ background: 'none', border: '1px solid #2563eb', color: '#2563eb', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer' }}
        >
          Login / Register
        </button>
      </header>

      <main style={{ textAlign: 'center', padding: '100px 5%' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#1e293b' }}>Scan. Report. <span style={{ color: '#2563eb' }}>Fixed.</span></h2>
        <p style={{ color: '#64748b', marginBottom: '40px' }}>Helping citizens and authorities build better neighborhoods together.</p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          {/* THE GUEST QR OPTION */}
          <button 
            onClick={() => onNavigate('report')} 
            style={{ background: '#10b981', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            🚀 Quick Report (Guest)
          </button>

          {/* THE REGISTER OPTION */}
          <button 
            onClick={() => onNavigate('register')}
            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Create Account
          </button>
        </div>
        
        <p style={{ marginTop: '20px', color: '#94a3b8', fontSize: '0.9rem' }}>
          * Guest reports are verified by AI but won't show in a personal history.
        </p>
      </main>
    </div>
  );
};

export default LandingPage;