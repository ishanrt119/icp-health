import React, { useState } from 'react';
import LandingPage from './components/pages/LandingPage'; // Optional if you want to keep it
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
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'landing' | 'dashboard'

  const handleLogin = (principal, user) => {
    setPrincipalId(principal);
    if (!user) {
      setNeedsRegistration(true);
    } else {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setCurrentView('dashboard');
    }
  };

  const handleRegistrationComplete = (newUser) => {
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setNeedsRegistration(false);
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setIsLoggedIn(false);
    setNeedsRegistration(false);
    setCurrentUser(null);
    setPatientViewMode('dashboard');
    setCurrentView('login');
  };

  const handleDemoLogin = (role) => {
    setCurrentUser({
      name: 'Demo User',
      email: 'demo@healthvault.com',
      role: role
    });
    setIsLoggedIn(true);
    setCurrentView('dashboard');
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

  if (!isLoggedIn && currentView === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentView === 'landing') {
    return <LandingPage onLogin={handleDemoLogin} />;
  }

  return (
    <div className="app-wrapper">
      <Header
        currentUser={currentUser}
        onBackToLanding={handleBackToLanding}
        onMyUploadsClick={() => setPatientViewMode('uploads')}
        onNewResearchClick={() => setShowResearchModal(true)}
      />
      <main className="main-content">{renderDashboard()}</main>
      <Footer />
    </div>
  );
}

export default App;
