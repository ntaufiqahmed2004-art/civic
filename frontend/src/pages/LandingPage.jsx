import React from 'react';
import { Camera, Shield, ArrowRight } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-container">
      <header>
       <h1>CivicFix</h1>
  <div className="auth-buttons">
    <button onClick={() => onNavigate('admin-dash')}>Admin Portal</button>
  </div>
      </header>

      <main>
        <div className="hero-section">
          <h2>Fix Your City in Three Clicks</h2>
          <p>Scan. Report. Resolve. Join thousands of citizens making Coimbatore better.</p>
        </div>

        <div className="features">
          <div className="feature-card">
            <Camera size={48} />
            <h3>Snap & Tag</h3>
            <p>Upload geo-tagged photos directly from your phone.</p>
          </div>
          <div className="feature-card">
            <Shield size={48} />
            <h3>AI Verified</h3>
            <p>Our AI ensures reports reach the right department instantly.</p>
          </div>
        </div>

        <button className="cta-button" onClick={() => onNavigate('report')}>
          Report an Issue Now <ArrowRight />
        </button>
      </main>
    </div>
  );
};

export default LandingPage;