import React from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../../declarations/icp-health-backend';
import './login.css';

const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND;

const LoginPage = ({ onLogin }) => {
  const handleLogin = async () => {
    const authClient = await AuthClient.create(); // ✅ use this instead of window.authClient

    await authClient.login({
      identityProvider: " http://uzt4z-lp777-77774-qaabq-cai.localhost:4943/#authorize",
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
    <div className="login-page">
      <div className="login-box">
        <h1 className="login-title">
          Welcome to <span>HealthVault</span>
        </h1>
        <p className="login-subtitle">Secure Blockchain-based Health Data Exchange</p>

        <button className="login-button" onClick={handleLogin}>
          Login with Internet Identity
        </button>
      </div>

      <div className="login-info">
        HealthVault is a secure platform for managing your health data on the Internet Computer
        blockchain. Log in to access your health records, share data with providers, and earn from
        data sharing.
      </div>
    </div>
  );
};

export default LoginPage;