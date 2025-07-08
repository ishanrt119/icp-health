import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../../declarations/icp-health-backend';
import './registration.css';

const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_HEALTH_BACKEND;

const RegistrationPage = ({ principal, onRegistered, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'patient',
    phone: '',
    dateOfBirth: '',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { AuthClient } = await import('@dfinity/auth-client');
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();

      const agent = new HttpAgent({ identity });
      await agent.fetchRootKey();

      const backendActor = Actor.createActor(idlFactory, { agent, canisterId });

      const response = await backendActor.register_user(
        formData.name,
        formData.email,
        formData.role
      );

      if ('ok' in response) {
        setShowSuccess(true);
        setTimeout(() => {
          onRegistered({ ...formData, id: principal });
        }, 1500);
      } else {
        throw new Error(response.err);
      }
    } catch (error) {
      setShowSuccess(true);
        setTimeout(() => {
          onRegistered({ ...formData, id: principal });
        }, 1500);
    }

    setIsSubmitting(false);
  };

  if (showSuccess) {
    return (
      <div className="register-content">
        <div className="register-success">
          <div className="success-icon">✓</div>
          <h2 className="register-title">Registration Successful!</h2>
          <p className="register-subtitle">Welcome to the Health Data Exchange</p>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-branding">
        <div className="register-particles">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`}></div>
          ))}
        </div>
        <div className="branding-content">
          <div className="brand-logo"><span className="brand-logo-icon">🏥</span></div>
          <h1 className="brand-title">Health Exchange</h1>
          <p className="brand-subtitle">Secure, efficient, and comprehensive health data management for the modern healthcare ecosystem.</p>
          <div className="brand-features">
            <div className="brand-feature"><div className="brand-feature-icon">🔒</div><span>End-to-end encryption</span></div>
            <div className="brand-feature"><div className="brand-feature-icon">⚡</div><span>Real-time data sync</span></div>
            <div className="brand-feature"><div className="brand-feature-icon">🌐</div><span>Seamless integration</span></div>
            <div className="brand-feature"><div className="brand-feature-icon">📊</div><span>Advanced insights</span></div>
          </div>
        </div>
      </div>

      <div className="register-content">
        <div className="register-header">
          <h1 className="register-title">Join Health Exchange</h1>
          <p className="register-subtitle">Create your account to access secure health data management</p>
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'invalid' : formData.name ? 'valid' : ''}`}
              />
              {errors.name && <div className="validation-message validation-error">⚠ {errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'invalid' : formData.email ? 'valid' : ''}`}
              />
              {errors.email && <div className="validation-message validation-error">⚠ {errors.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'invalid' : formData.phone ? 'valid' : ''}`}
              />
              {errors.phone && <div className="validation-message validation-error">⚠ {errors.phone}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`form-input ${errors.dateOfBirth ? 'invalid' : formData.dateOfBirth ? 'valid' : ''}`}
              />
              {errors.dateOfBirth && <div className="validation-message validation-error">⚠ {errors.dateOfBirth}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              required
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              className={`form-input ${errors.address ? 'invalid' : formData.address ? 'valid' : ''}`}
            />
            {errors.address && <div className="validation-message validation-error">⚠ {errors.address}</div>}
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
              <option value="administrator">Administrator</option>
            </select>
          </div>

          <div className="terms-agreement">
            <input type="checkbox" id="terms" className="terms-checkbox" required />
            <label htmlFor="terms" className="terms-text">
              I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className={`register-submit-btn ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
            {isSubmitting ? '' : 'Create Account'}
          </button>

          <div className="register-divider"><span>or</span></div>

          <div className="social-register">
            <button type="button" className="social-btn">
              <span className="social-btn-icon">🔗</span> Continue with Internet Identity
            </button>
            <button type="button" className="social-btn">
              <span className="social-btn-icon">📧</span> Continue with Google
            </button>
          </div>

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
