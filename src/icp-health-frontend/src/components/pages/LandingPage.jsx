import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Brain, 
  Lock, 
  Heart, 
  Award,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Database,
  Globe
} from 'lucide-react';
import './landing.css';


const LandingPage = ({onLoginClick,onDemoLogin}) => {
  
  const [counters, setCounters] = useState({
    uploads: 0,
    hospitals: 0,
    users: 0,
    security: 0
  });

  // Animated counter effect
  useEffect(() => {
    const targets = {
      uploads: 10000,
      hospitals: 50,
      users: 25000,
      security: 99.9
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepTime = duration / steps;

    const intervals = Object.keys(targets).map(key => {
      const target = targets[key];
      const increment = target / steps;
      let current = 0;

      return setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(intervals.find(i => i === interval));
        }
        setCounters(prev => ({
          ...prev,
          [key]: key === 'security' ? current.toFixed(1) : Math.floor(current)
        }));
      }, stepTime);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const handleLoginClick = () => {
    onLoginClick();
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      {/* Header */}
      <header className="header">
  <div className="header-container">
    {/* Left: Logo */}
    <div className="logo">
      <Shield className="logo-icon" />
      <span className="logo-text">HealthVault</span>
    </div>

    {/* Right: Nav + Button */}
    <div className="nav-actions">
      <nav className="nav">
        <a href="#home" onClick={() => scrollToSection('home')}>Home</a>
        <a href="#about" onClick={() => scrollToSection('about')}>About</a>
        <a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Testimonials</a>
        <a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a>
      </nav>
      <button className="login-btn" onClick={handleLoginClick}>
        <span>Login</span>
        <ArrowRight className="btn-icon" />
      </button>
    </div>
  </div>
</header>


      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Your Health, <span className="gradient-text">Secured</span>.
                <br />
                Your Data, <span className="gradient-text">Empowered</span>.
              </h1>
              <p className="hero-subtitle">
                HealthVault is the future of healthcare data management. Securely store, 
                share, and monetize your health records while enabling groundbreaking 
                medical research through blockchain technology.
              </p>
              <div className="hero-buttons">
                <button 
                  className="cta-btn primary"
                  onClick={() => scrollToSection('about')}
                >
                  <span>Get Started</span>
                  <ArrowRight className="btn-icon" />
                </button>
                <button 
                  className="cta-btn secondary"
                  onClick={() => scrollToSection('testimonials')}
                >
                  <span>Learn More</span>
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card">
                <div className="card-header">
                  <div className="card-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="card-title">Health Dashboard</span>
                </div>
                <div className="card-content">
                  <div className="health-metric">
                    <Heart className="metric-icon" />
                    <div className="metric-data">
                      <span className="metric-value">72 BPM</span>
                      <span className="metric-label">Heart Rate</span>
                    </div>
                  </div>
                  <div className="health-metric">
                    <TrendingUp className="metric-icon" />
                    <div className="metric-data">
                      <span className="metric-value">120/80</span>
                      <span className="metric-label">Blood Pressure</span>
                    </div>
                  </div>
                  <div className="health-metric">
                    <Database className="metric-icon" />
                    <div className="metric-data">
                      <span className="metric-value">15 Records</span>
                      <span className="metric-label">Uploaded</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Revolutionizing Healthcare Data</h2>
            <p className="section-subtitle">
              HealthVault connects patients, providers, and researchers in a secure, 
              transparent ecosystem powered by blockchain technology.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon privacy">
                <Lock />
              </div>
              <h3>Privacy First</h3>
              <p>
                Your health data is encrypted and stored securely on the blockchain. 
                You control who has access and how it's used.
              </p>
              <ul className="feature-list">
                <li><CheckCircle className="check-icon" /> End-to-end encryption</li>
                <li><CheckCircle className="check-icon" /> HIPAA compliant</li>
                <li><CheckCircle className="check-icon" /> Zero-knowledge architecture</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon collaboration">
                <Users />
              </div>
              <h3>Seamless Collaboration</h3>
              <p>
                Enable secure data sharing between healthcare providers and researchers 
                while maintaining complete control over your information.
              </p>
              <ul className="feature-list">
                <li><CheckCircle className="check-icon" /> Instant data sharing</li>
                <li><CheckCircle className="check-icon" /> Provider networks</li>
                <li><CheckCircle className="check-icon" /> Research participation</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon insights">
                <Brain />
              </div>
              <h3>AI-Driven Insights</h3>
              <p>
                Advanced AI algorithms analyze anonymized data to provide personalized 
                health insights and contribute to medical breakthroughs.
              </p>
              <ul className="feature-list">
                <li><CheckCircle className="check-icon" /> Personalized recommendations</li>
                <li><CheckCircle className="check-icon" /> Predictive analytics</li>
                <li><CheckCircle className="check-icon" /> Research contributions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements">
        <div className="container">
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">
                <Database />
              </div>
              <div className="achievement-number">{counters.uploads.toLocaleString()}+</div>
              <div className="achievement-label">Health Records Processed</div>
            </div>
            
            <div className="achievement-card">
              <div className="achievement-icon">
                <Globe />
              </div>
              <div className="achievement-number">{counters.hospitals}+</div>
              <div className="achievement-label">Partner Hospitals</div>
            </div>
            
            <div className="achievement-card">
              <div className="achievement-icon">
                <Users />
              </div>
              <div className="achievement-number">{counters.users.toLocaleString()}+</div>
              <div className="achievement-label">Active Users</div>
            </div>
            
            <div className="achievement-card">
              <div className="achievement-icon">
                <Shield />
              </div>
              <div className="achievement-number">{counters.security}%</div>
              <div className="achievement-label">Security Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">
              Trusted by thousands of patients, providers, and researchers worldwide.
            </p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
                  alt="Sarah Johnson" 
                  className="testimonial-avatar"
                />
                <div className="testimonial-info">
                  <h4>Sarah Johnson</h4>
                  <span className="role patient">Patient</span>
                </div>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star filled" />
                  ))}
                </div>
              </div>
              <p className="testimonial-text">
                "HealthVault has transformed how I manage my health data. I can easily 
                share my records with specialists and even earn from contributing to research. 
                The security gives me complete peace of mind."
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <img 
                  src="https://images.pexels.com/photos/612807/pexels-photo-612807.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
                  alt="Dr. Michael Chen" 
                  className="testimonial-avatar"
                />
                <div className="testimonial-info">
                  <h4>Dr. Michael Chen</h4>
                  <span className="role provider">Healthcare Provider</span>
                </div>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star filled" />
                  ))}
                </div>
              </div>
              <p className="testimonial-text">
                "As a cardiologist, HealthVault has streamlined my practice. I can access 
                patient histories instantly, collaborate with colleagues, and contribute to 
                important research studies. It's the future of healthcare."
              </p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <img 
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop" 
                  alt="Dr. Emily Rodriguez" 
                  className="testimonial-avatar"
                />
                <div className="testimonial-info">
                  <h4>Dr. Emily Rodriguez</h4>
                  <span className="role researcher">Medical Researcher</span>
                </div>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star filled" />
                  ))}
                </div>
              </div>
              <p className="testimonial-text">
                "HealthVault has accelerated our research exponentially. Access to 
                anonymized, high-quality health data has enabled breakthroughs in our 
                diabetes prevention study. The platform is a game-changer."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Ready to revolutionize your healthcare data management? 
                Contact us today to learn more about HealthVault.
              </p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <Mail className="contact-icon" />
                  <div>
                    <h4>Email</h4>
                    <p>support@healthvault.com</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <Phone className="contact-icon" />
                  <div>
                    <h4>Phone</h4>
                    <p>+91-8458745632</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <MapPin className="contact-icon" />
                  <div>
                    <h4>Address</h4>
                    <p>123 Health Tech Ave<br />India</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <a href="#" className="social-link">
                  <Facebook />
                </a>
                <a href="#" className="social-link">
                  <Twitter />
                </a>
                <a href="#" className="social-link">
                  <Linkedin />
                </a>
                <a href="#" className="social-link">
                  <Instagram />
                </a>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  required 
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">
                <span>Send Message</span>
                <ArrowRight className="btn-icon" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <Shield className="logo-icon" />
                <span className="logo-text">HealthVault</span>
              </div>
              <p className="footer-description">
                Empowering healthcare through secure, blockchain-based data management 
                and collaboration.
              </p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#home" onClick={() => scrollToSection('home')}>Home</a></li>
                <li><a href="#about" onClick={() => scrollToSection('about')}>About</a></li>
                <li><a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Testimonials</a></li>
                <li><a href="#contact" onClick={() => scrollToSection('contact')}>Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Platform</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={handleLoginClick}>Login</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 HealthVault. All rights reserved.</p>
            <div className="footer-badges">
              <span className="badge">
                <Award className="badge-icon" />
                ISO Certified
              </span>
              <span className="badge">
                <Shield className="badge-icon" />
                HIPAA Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;