import React, { useState } from 'react';
import './login.css';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../../declarations/icp-health-backend';

const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND;

const LoginPage = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    const authClient = await AuthClient.create();

    await authClient.login({
      identityProvider: "http://uzt4z-lp777-77774-qaabq-cai.localhost:4943/#authorize",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toText();
        const agent = new HttpAgent({ identity });

        // For local development only
        await agent.fetchRootKey();

        const backendActor = Actor.createActor(idlFactory, {
          agent,
          canisterId,
        });

        try {
          const exists = await backendActor.check_user_exists();
          if (exists) {
            const user = await backendActor.get_user();
            onLogin(principal, user);
          } else {
            onLogin(principal, null);
          }

          localStorage.setItem('lastLogin', new Date().toISOString());
        } catch (err) {
          console.error("Login error:", err);
          alert("Something went wrong. Check console.");
        } finally {
          setIsLoading(false);
        }
      },
      onError: (err) => {
        console.error("Login failed", err);
        alert("Login failed.");
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="login-container">
      {/* Left Branding Section */}
      <div className="login-left">
        <div className="geometric-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>

        <div className="brand-header">
          <div className="brand-nav">
            <div className="brand-logo-small">HV</div>
            <div className="brand-version">Web3</div>
          </div>
        </div>

        <div className="brand-content">
          <h1 className="brand-title-main">HealthVault</h1>
          <p className="brand-subtitle-main">
            Next-generation blockchain platform for secure health data management and monetization
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-large">🔐</div>
              <div className="feature-title">Zero-Knowledge Security</div>
              <div className="feature-description">
                Advanced cryptographic protection for your medical data
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">⛓️</div>
              <div className="feature-title">Blockchain Verified</div>
              <div className="feature-description">
                Immutable records on Internet Computer protocol
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">💰</div>
              <div className="feature-title">Data Monetization</div>
              <div className="feature-description">
                Earn rewards while contributing to medical research
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-large">🌐</div>
              <div className="feature-title">Global Access</div>
              <div className="feature-description">
                Access your health data anywhere, anytime
              </div>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          <div className="social-links">
            <a href="#" className="social-link">𝕏</a>
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">📷</a>
          </div>
          <div className="brand-copyright">
            © 2024 HealthVault Labs
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">
              Sign in to access your health data vault and start managing your medical records securely.
            </p>
          </div>

          <div className="login-form">
            <button className="login-submit-btn" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login with Internet Identity'}
            </button>
          </div>

          <div className="login-divider">
            <span>About HealthVault</span>
          </div>

          <div className="login-info">
            HealthVault leverages Internet Computer blockchain technology to provide you with complete control over your health data. Share your medical records with healthcare providers securely and earn rewards for contributing to medical research while maintaining full privacy and ownership of your information.
          </div>
        </div>

        <div className="login-footer">
          <p>© 2024 HealthVault. Powered by Internet Computer.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
