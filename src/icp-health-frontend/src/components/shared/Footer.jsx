import React from 'react';
import { Shield } from 'lucide-react';
import './footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-header">
          <div className="footer-security">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-sm text-gray-300">
              End-to-end encrypted on ICP blockchain
            </span>
          </div>
          <div className="footer-copyright text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} HealthVault. All rights reserved.</p>
            <p className="text-xs mt-1">Secure health data exchange platform</p>
          </div>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4 className="text-white font-semibold mb-2">For Patients</h4>
            <ul className="space-y-1">
              <li>Own your health data</li>
              <li>Earn from data sharing</li>
              <li>Control access permissions</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="text-white font-semibold mb-2">For Providers</h4>
            <ul className="space-y-1">
              <li>Secure patient data access</li>
              <li>HIPAA compliant platform</li>
              <li>Streamlined workflows</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="text-white font-semibold mb-2">For Researchers</h4>
            <ul className="space-y-1">
              <li>Anonymized health datasets</li>
              <li>Real-time data access</li>
              <li>Ethical research platform</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;