import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Settings, Search, ArrowLeft } from 'lucide-react';
import './header.css';

const Header = ({ currentUser = {}, onBackToLanding, onMyUploadsClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'patient': return 'bg-blue-100';
      case 'provider': return 'bg-green-100';
      case 'researcher': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'patient': return 'Patient';
      case 'provider': return 'Provider';
      case 'researcher': return 'Researcher';
      default: return 'Unknown';
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    setSettingsOpen(false);
  };

  const toggleSettings = () => {
    setSettingsOpen((prev) => !prev);
    setDropdownOpen(false);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="header">
      {/* Left: Logo */}
      <div className="header-left">
        <div className="logo">
          <Shield className="logo-icon" size={30} />
          <span className="logo-text">HealthVault</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="header-center">
        <div className="search-container">
          <Search size={18} color="#3b82f6" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="search-input"
          />
        </div>
      </div>

      {/* Right: Buttons & Dropdown */}
      <div className="header-right">
        {currentUser.role === 'patient' && (
          <div className="my-upload-link" onClick={onMyUploadsClick}>
            <button className="my-uploads-button">My Uploads</button>
          </div>
        )}

        <div className="action-icons">
          <Bell className="action-icon" size={18} />
          <Settings className="action-icon" size={18} onClick={toggleSettings} />
        </div>

        {settingsOpen && (
          <div className="settings-menu">
            <ul className="settings-list">
              <li className="settings-item" onClick={() => setShowAccountModal(true)}>
                <div className="settings-title">Account Settings</div>
                <div className="settings-description">Update name, email & password</div>
              </li>
              <li className="settings-item" onClick={toggleTheme}>
                <div className="settings-title">Appearance / Theme</div>
                <div className="settings-description">Toggle between light and dark mode</div>
              </li>
              <li className="settings-item" onClick={() => setHelpModalOpen(true)}>
                <div className="settings-title">Help & Support</div>
                <div className="settings-description">Need help? Click here</div>
              </li>
              <li className="settings-item" onClick={() => setAboutModalOpen(true)}>
                <div className="settings-title">About HealthVault</div>
                <div className="settings-description">Learn more about this platform</div>
              </li>
            </ul>
          </div>
        )}

        <div className="user-info" onClick={toggleDropdown}>
          <div className="user-avatar">
            <User size={14} />
          </div>
          <div className={`user-role ${getRoleColor(currentUser.role)}`}>
            {getRoleName(currentUser.role)}
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="profile-details">
                <div className="profile-detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{currentUser?.name}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{getRoleName(currentUser?.role)}</span>
                </div>
                {currentUser?.email && (
                  <div className="profile-detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{currentUser.email}</span>
                  </div>
                )}
                {currentUser?.id && (
                  <div className="profile-detail-item">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">{currentUser.id}</span>
                  </div>
                )}
              </div>
              <hr />
              <button className="logout-btn" onClick={onBackToLanding}>
                <ArrowLeft size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAccountModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Account Settings</h3>
              <button className="modal-close-btn" onClick={() => setShowAccountModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Name</label><input type="text" placeholder="Enter name" /></div>
              <div className="form-group"><label>Email</label><input type="email" placeholder="Enter email" /></div>
              <div className="form-group"><label>New Password</label><input type="password" placeholder="Enter password" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAccountModal(false)}>Cancel</button>
              <button className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {helpModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Help & Support</h3>
              <button className="modal-close-btn" onClick={() => setHelpModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>If you're facing issues, email us at <strong>support@healthvault.com</strong> or visit our FAQ section.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setHelpModalOpen(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}

      {aboutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>About HealthVault</h3>
              <button className="modal-close-btn" onClick={() => setAboutModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>HealthVault</strong> is a secure digital health platform designed for patients, providers, and researchers to collaborate and exchange health data efficiently.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setAboutModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;