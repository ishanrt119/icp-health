// src/components/pages/RegistrationPage.jsx
import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../../declarations/icp-health-backend';
import './registration.css';

const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND;

const RegistrationPage = ({ principal, onRegistered, onBack }) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'patient' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { AuthClient } = await import('@dfinity/auth-client');
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();

      const agent = new HttpAgent({ identity });
      await agent.fetchRootKey();

      const backendActor = Actor.createActor(idlFactory, {
        agent,
        canisterId,
      });

      const response = await backendActor.register_user(
        formData.name,
        formData.email,
        formData.role
      );

      if ("ok" in response) {
        onRegistered({ ...formData, id: principal });
      } else {
        throw new Error(response.err);
      }
    } catch (error) {
        onRegistered({ ...formData, id: principal }); 
}

    setIsSubmitting(false);
  };

  return (
    <div className="register-container">
  <div className="register-card">
    <div className="register-header">
      <div className="register-logo">
        <span className="register-logo-icon">👤</span>
      </div>
      <h2 className="register-title">Complete Your Registration</h2>
      <p className="register-subtitle">Join the Health Data Exchange</p>
    </div>

    <form onSubmit={handleSubmit} className="register-form">
      <div className="form-group floating-label">
        <input
          type="text"
          name="name"
          required
          placeholder=" "
          value={formData.name}
          onChange={handleChange}
          className="form-input"
        />
        <label className="form-label">Full Name</label>
      </div>

      <div className="form-group floating-label">
        <input
          type="email"
          name="email"
          required
          placeholder=" "
          value={formData.email}
          onChange={handleChange}
          className="form-input"
        />
        <label className="form-label">Email Address</label>
      </div>

      <div className="form-group">
        <label className="form-label">User Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="patient">Patient</option>
          <option value="provider">Healthcare Provider</option>
          <option value="researcher">Researcher</option>
        </select>
      </div>

      <button type="submit" className={`register-submit-btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
        {isSubmitting ? '' : 'Register'}
      </button>

      <div className="login-link">
        <p>Already have an account?</p>
        <a onClick={onBack} style={{ cursor: 'pointer' }}>← Back to Login</a>
      </div>
    </form>
  </div>
</div>

  );
};

export default RegistrationPage;
