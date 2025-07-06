import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Shield, 
  Users, 
  Activity, 
  Brain, 
  Zap, 
  FileText, 
  Calendar,
  UserCheck,
  Database,
  Lock,
  CheckCircle,
  Play,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Infinity,
  Mail,
  Phone,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import './landing.css'; // Assuming you have a CSS file for styles

const Landing = ({ onLoginClick, onDemoLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [counters, setCounters] = useState({
    users: 0,
    rewards: 0,
    uptime: 0
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const targets = {
      users: 10000,
      rewards: 2500000, // $2.5M
      uptime: 99.9
    };

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const intervalIds = [];

    Object.keys(targets).forEach(key => {
      const target = targets[key];
      const increment = target / steps;
      let current = 0;

      const id = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(id);
        }

        setCounters(prev => ({
          ...prev,
          [key]: key === 'uptime' ? current.toFixed(1) : Math.floor(current)
        }));
      }, stepTime);

      intervalIds.push(id);
    });

    return () => {
      intervalIds.forEach(clearInterval);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleGetStarted = () => {
    onLoginClick();
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`nav ${isScrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-brand">
            <div className="nav-logo">HV</div>
            <span className="nav-title">HealthVault</span>
          </div>
          <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a>
            <a href="#security" onClick={(e) => { e.preventDefault(); scrollToSection('security'); }}>Security</a>
            <button className="nav-cta-btn" onClick={handleGetStarted}>Get Started</button>
          </div>
          <button className="nav-toggle" onClick={toggleMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="hero-shape hero-shape-1"></div>
            <div className="hero-shape hero-shape-2"></div>
            <div className="hero-shape hero-shape-3"></div>
            <div className="hero-shape hero-shape-4"></div>
            <div className="hero-shape hero-shape-5"></div>
            <div className="hero-shape hero-shape-6"></div>
          </div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Star size={16} /><span style={{ marginLeft: '8px' }}>🚀 Powered by Internet Computer</span>
            </div>
            <h1 className="hero-title">Your Health Data,<span className="hero-title-gradient"> Your Control</span></h1>
            <p className="hero-subtitle">
              The first decentralized platform that puts you in complete control of your health data. 
              Secure, private, and profitable - earn rewards while contributing to medical breakthroughs.
            </p>
            <div className="hero-actions">
              <button className="hero-btn-primary" onClick={handleGetStarted}>Start Your Vault</button>
              <button className="hero-btn-secondary">
                <Play size={20} className="hero-btn-icon" />Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-number">{counters.users.toLocaleString()}+</div>
                <div className="hero-stat-label">Active Users</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">${(counters.rewards / 1000000).toFixed(1)}M</div>
                <div className="hero-stat-label">Rewards Paid</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">{counters.uptime}%</div>
                <div className="hero-stat-label">Uptime</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-dashboard">
              <div className="dashboard-header">
                <div className="dashboard-dots"><span></span><span></span><span></span></div>
                <div className="dashboard-title">HealthVault Dashboard</div>
              </div>
              <div className="dashboard-content">
                <div className="dashboard-card">
                  <FileText size={24} className="card-icon" style={{ color: '#ef4444' }} />
                  <div><div className="card-title">Medical Records</div><div className="card-value">247 Files</div></div>
                </div>
                <div className="dashboard-card">
                  <Infinity size={24} className="card-icon" style={{ color: '#10b981' }} />
                  <div><div className="card-title">Earnings</div><div className="card-value">1,247</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Revolutionary Features</h2>
            <p className="section-subtitle">
              Experience the future of health data management with cutting-edge blockchain technology
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-item">
              <FileText size={48} className="feature-icon" style={{ color: '#3b82f6' }} />
              <h3 className="feature-title">Zero-Knowledge Security</h3>
              <p className="feature-description">
                Your data is encrypted with military-grade security. Even we can't access your personal information.
              </p>
              <span className="feature-link">Learn more →</span>
            </div>
            
            <div className="feature-item">
              <Calendar size={48} className="feature-icon" style={{ color: '#10b981' }} />
              <h3 className="feature-title">Blockchain Verified</h3>
              <p className="feature-description">
                Every record is immutably stored on the Internet Computer, ensuring authenticity and preventing tampering.
              </p>
              <span className="feature-link">Learn more →</span>
            </div>
            
            <div className="feature-item">
              <Activity size={48} className="feature-icon" style={{ color: '#f59e0b' }} />
              <h3 className="feature-title">Earn While You Share</h3>
              <p className="feature-description">
                Monetize your anonymized health data by contributing to medical research and pharmaceutical studies.
              </p>
              <span className="feature-link">Learn more →</span>
            </div>
            
            <div className="feature-item">
              <Users size={48} className="feature-icon" style={{ color: '#8b5cf6' }} />
              <h3 className="feature-title">Global Accessibility</h3>
              <p className="feature-description">
                Access your health records from anywhere in the world, share with any healthcare provider instantly.
              </p>
              <span className="feature-link">Learn more →</span>
            </div>
            
            <div className="feature-item">
              <Brain size={48} className="feature-icon" style={{ color: '#ef4444' }} />
              <h3 className="feature-title">AI-Powered Insights</h3>
              <p className="feature-description">
                Get personalized health insights and recommendations powered by advanced machine learning algorithms.
              </p>
              <span className="feature-link">Learn more →</span>
            </div>
            
            <div className="feature-item">
              <Shield size={48} className="feature-icon" style={{ color: '#059669' }} />
              <h3 className="feature-title">Provider Integration</h3>
              <p className="feature-description">
                Seamlessly connect with hospitals, clinics, and healthcare providers for instant record sharing.
              </p>
              <span className="feature-link">Learn more →</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How HealthVault Works</h2>
            <p className="section-subtitle">
              Simple steps to take control of your health data and start earning
            </p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3 className="step-title">Create Your Vault</h3>
                <p className="step-description">
                  Sign up with Internet Identity and create your secure health data vault in minutes.
                </p>
              </div>
              <div className="step-visual">
                <UserCheck size={48} className="step-icon" />
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3 className="step-title">Upload Your Records</h3>
                <p className="step-description">
                  Securely upload your medical records, lab results, and health data with end-to-end encryption.
                </p>
              </div>
              <div className="step-visual">
                <Database size={48} className="step-icon" />
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3 className="step-title">Control & Share</h3>
                <p className="step-description">
                  Decide who can access your data, when, and for what purpose. You maintain complete control.
                </p>
              </div>
              <div className="step-visual">
                <Zap size={48} className="step-icon" />
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3 className="step-title">Earn Rewards</h3>
                <p className="step-description">
                  Contribute anonymized data to research studies and earn cryptocurrency rewards for your participation.
                </p>
              </div>
              <div className="step-visual">
                <Star size={48} className="step-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="security">
        <div className="container">
          <div className="security-content">
            <div>
              <div className="section-header" style={{ textAlign: 'left', marginBottom: '3rem' }}>
                <h2 className="section-title">Bank-Level Security</h2>
                <p className="section-subtitle" style={{ margin: '0.5rem 0' }}>
                  Your health data deserves the highest level of protection. We use cutting-edge cryptography and blockchain technology.
                </p>
              </div>
              
              <div className="security-features">
                <div className="security-feature">
                  <Lock size={32} className="security-feature-icon" style={{ color: '#3b82f6' }} />
                  <div className="security-feature-content">
                    <h4>End-to-End Encryption</h4>
                    <p>AES-256 encryption ensures your data is protected at rest and in transit</p>
                  </div>
                </div>
                
                <div className="security-feature">
                  <Shield size={32} className="security-feature-icon" style={{ color: '#10b981' }} />
                  <div className="security-feature-content">
                    <h4>Zero-Knowledge Architecture</h4>
                    <p>We never have access to your unencrypted data, ensuring complete privacy</p>
                  </div>
                </div>
                
                <div className="security-feature">
                  <CheckCircle size={32} className="security-feature-icon" style={{ color: '#8b5cf6' }} />
                  <div className="security-feature-content">
                    <h4>Blockchain Immutability</h4>
                    <p>Records stored on Internet Computer cannot be altered or deleted</p>
                  </div>
                </div>
              </div>
              
              <button className="security-cta">View Security Details</button>
            </div>
            
            <div className="security-visual">
              <div className="security-shield">
                <div className="shield-layers">
                  <div className="shield-layer shield-layer-1"></div>
                  <div className="shield-layer shield-layer-2"></div>
                  <div className="shield-layer shield-layer-3"></div>
                </div>
                <Shield size={120} className="shield-center" style={{ color: '#3b82f6' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Take Control?</h2>
            <p className="cta-subtitle">
              Join thousands of users who have already secured their health data and started earning rewards.
            </p>
            
            <div className="cta-actions">
              <button className="cta-btn-primary" onClick={handleGetStarted}>Create Your Vault</button>
              <button className="cta-btn-secondary">Schedule Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  HV
                </div>
                <span className="footer-logo-text">HealthVault</span>
              </div>
              
              <p className="footer-description">
                Empowering individuals to own, control, and monetize their health data through blockchain technology.
              </p>
              
              <div className="footer-social">
                <a href="#" className="footer-social-link">
                  <Facebook size={18} />
                </a>
                <a href="#" className="footer-social-link">
                  <Twitter size={18} />
                </a>
                <a href="#" className="footer-social-link">
                  <Instagram size={18} />
                </a>
                <a href="#" className="footer-social-link">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
            
            <div className="footer-links">
              <div>
                <h4 className="footer-column-title">Product</h4>
                <a href="#" className="footer-link">Features</a>
                <a href="#" className="footer-link">Security</a>
                <a href="#" className="footer-link">API</a>
              </div>
              
              <div>
                <h4 className="footer-column-title">Company</h4>
                <a href="#" className="footer-link">About</a>
                <a href="#" className="footer-link">Careers</a>
                <a href="#" className="footer-link">Press</a>
                <a href="#" className="footer-link">Contact</a>
              </div>
              
              <div>
                <h4 className="footer-column-title">Resources</h4>
                <a href="#" className="footer-link">Documentation</a>
                <a href="#" className="footer-link">Help Center</a>
                <a href="#" className="footer-link">Blog</a>
                <a href="#" className="footer-link">Community</a>
              </div>
              
              <div>
                <h4 className="footer-column-title">Legal</h4>
                <a href="#" className="footer-link">Privacy Policy</a>
                <a href="#" className="footer-link">Terms of Service</a>
                <a href="#" className="footer-link">Cookie Policy</a>
                <a href="#" className="footer-link">GDPR</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-copyright">
              © 2024 HealthVault Labs. All rights reserved.
            </div>
            <div className="footer-powered">
              Powered by Internet Computer
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
};

export default Landing;
