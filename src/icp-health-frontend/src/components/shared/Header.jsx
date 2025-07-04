import React, { useState } from 'react';
import { User, Shield, Bell, Settings, Search, ArrowLeft } from 'lucide-react';
import './header.css';

const Header = ({ currentUser = {}, onUserSwitch, onBackToLanding, onMyUploadsClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getRoleColor = (role) => {
    switch (role) {
      case 'patient':
        return 'bg-blue-100';
      case 'provider':
        return 'bg-green-100';
      case 'researcher':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'patient':
        return 'Patient';
      case 'provider':
        return 'Provider';
      case 'researcher':
        return 'Researcher';
      default:
        return 'Unknown';
    }
  };

  const getSearchPlaceholder = (role) => {
    switch (role) {
      case 'patient':
        return 'Search records...';
      case 'provider':
        return 'Search patients...';
      case 'researcher':
        return 'Search studies...';
      default:
        return 'Search...';
    }
  };

  const getDisplayName = () => {
    return currentUser?.name || 'N/A';
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
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
            placeholder={getSearchPlaceholder(currentUser.role)}
            className="search-input"
          />
        </div>
      </div>

      {/* Right: My Uploads + Icons + Dropdown */}
      <div className="header-right">
        {currentUser.role === 'patient' && (
          <div className="my-upload-link" onClick={onMyUploadsClick}>
            <button className="my-uploads-button">My Uploads</button>
          </div>
        )}

        <div className="action-icons">
          <Bell className="action-icon" size={18} />
          <Settings className="action-icon" size={18} />
        </div>

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
                  <span className="detail-value">{getDisplayName()}</span>
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
    </header>
  );
};

export default Header;