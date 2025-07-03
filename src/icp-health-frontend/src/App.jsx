import React, { useState } from 'react';
import LoginPage from './components/pages/LoginPage';
import RegistrationPage from './components/pages/RegistrationPage';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import PatientDashboard from './components/dashboards/PatientDashboard';
import ProviderDashboard from './components/dashboards/ProviderDashboard';
import ResearcherDashboard from './components/dashboards/ResearcherDashboard';
import './app.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [principalId, setPrincipalId] = useState('');
  const [patientViewMode, setPatientViewMode] = useState('dashboard'); // 'dashboard' or 'uploads'
  const [showResearchModal, setShowResearchModal] = useState(false);

  const handleLogin = (principal, user) => {
    setPrincipalId(principal);
    if (!user) {
      setNeedsRegistration(true);
    } else {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  };

  const handleRegistrationComplete = (newUser) => {
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setNeedsRegistration(false);
  };

  const handleBackToLanding = () => {
    setIsLoggedIn(false);
    setNeedsRegistration(false);
    setCurrentUser(null);
    setPatientViewMode('dashboard'); // reset view
  };

  const renderDashboard = () => {
    switch (currentUser?.role) {
      case 'patient':
        return (
          <PatientDashboard
            user={currentUser}
            viewMode={patientViewMode}
            onBackToDashboard={() => setPatientViewMode('dashboard')}
          />
        );
      case 'provider':
        return <ProviderDashboard />;
      case 'researcher':
        return (
          <ResearcherDashboard
            showModal={showResearchModal}
            setShowModal={setShowResearchModal}
          />
        );
      default:
        return null;
    }
  };

  if (needsRegistration) {
    return (
      <RegistrationPage
        principal={principalId}
        onRegistered={handleRegistrationComplete}
        onBack={handleBackToLanding}
      />
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-wrapper">
      <Header
  currentUser={currentUser}
  onBackToLanding={handleBackToLanding}
  onMyUploadsClick={() => setPatientViewMode('uploads')}
  onNewResearchClick={() => setShowResearchModal(true)} // ✅ Add this
/>
      <main className="main-content">{renderDashboard()}</main>
      <Footer />
    </div>
  );
}

export default App;