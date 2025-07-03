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
    <div className="registration-container">
      <div className="registration-card">
        <h2>Complete Your Registration</h2>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <label>User Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="patient">Patient</option>
            <option value="provider">Healthcare Provider</option>
            <option value="researcher">Researcher</option>
          </select>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
           
          </button>

          <button type="button" onClick={onBack} className="back-button">
            ← Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
