import React from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../../declarations/icp-health-backend';
import './login.css';

const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND;

const LoginPage = ({ onLogin }) => {
  const handleLogin = async () => {
    const authClient = await AuthClient.create();

    await authClient.login({
      identityProvider: "http://uzt4z-lp777-77774-qaabq-cai.localhost:4943/#authorize",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toText();
        const agent = new HttpAgent({ identity });
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

          // ✅ Save login time AFTER successful login
          localStorage.setItem('lastLogin', new Date().toISOString());

        } catch (err) {
          console.error("Login error:", err);
          alert("Something went wrong. Check console.");
        }
      },
      onError: (err) => {
        console.error("Login failed", err);
        alert("Login failed.");
      },
    });
  };


  return (
    <div className="login-container">
      {/* Optional floating particles */}
      <div className="login-particles">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">HV</div>
          </div>
          <h2 className="login-title">Welcome to HealthVault</h2>
          <p className="login-subtitle">
            Secure Blockchain-based Health Data Exchange
          </p>
        </div>

        <div className="login-form">
          <button className="login-submit-btn" onClick={handleLogin}>
            Login with Internet Identity
          </button>
        </div>

        <div className="login-divider">
          <span>About</span>
        </div>

        <div className="login-info">
          HealthVault is a secure platform for managing your health data on the Internet Computer
          blockchain. Log in to access your health records, share data with providers, and earn from
          data sharing.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
