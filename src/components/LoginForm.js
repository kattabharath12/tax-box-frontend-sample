import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect will be handled by App.js
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-section">
              <div className="logo">🎯</div>
              <h1 className="brand-name">TaxBox.AI</h1>
              <p className="brand-tagline">Your Smart Tax Filing Assistant</p>
            </div>
            <h2 className="auth-title">Welcome Back!</h2>
            <p className="auth-subtitle">Sign in to continue your tax journey</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <div className="input-wrapper">
                <div className="input-icon">📧</div>
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <label className="input-label">Email Address</label>
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <div className="input-icon">🔒</div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <label className="input-label">Password</label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" className="checkbox" />
                <span className="checkmark"></span>
                <span className="checkbox-label">Remember me</span>
              </label>
              <a href="#forgot" className="forgot-link">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <div className="button-loading">
                  <div className="spinner"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <button className="social-button google">
              <span className="social-icon">🔍</span>
              <span>Google</span>
            </button>
            <button className="social-button microsoft">
              <span className="social-icon">🪟</span>
              <span>Microsoft</span>
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account? 
              <a href="/register" className="auth-link">Create Account</a>
            </p>
          </div>
        </div>

        <div className="auth-info">
          <div className="info-card">
            <div className="info-icon">🚀</div>
            <h3>Fast & Secure</h3>
            <p>File your taxes in minutes with bank-level security</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🤖</div>
            <h3>AI-Powered</h3>
            <p>Smart calculations and maximum refund optimization</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📱</div>
            <h3>Mobile Ready</h3>
            <p>Access your tax information anywhere, anytime</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .auth-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          z-index: -1;
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          opacity: 0.1;
          animation: float 20s infinite ease-in-out;
        }

        .shape-1 {
          top: 10%;
          left: 10%;
          width: 80px;
          height: 80px;
          background: #fff;
          border-radius: 50%;
          animation-delay: 0s;
        }

        .shape-2 {
          top: 20%;
          right: 10%;
          width: 60px;
          height: 60px;
          background: #fff;
          transform: rotate(45deg);
          animation-delay: 2s;
        }

        .shape-3 {
          bottom: 30%;
          left: 20%;
          width: 40px;
          height: 40px;
          background: #fff;
          border-radius: 30%;
          animation-delay: 4s;
        }

        .shape-4 {
          bottom: 10%;
          right: 30%;
          width: 100px;
          height: 100px;
          background: #fff;
          border-radius: 50%;
          animation-delay: 6s;
        }

        .shape-5 {
          top: 50%;
          left: 5%;
          width: 50px;
          height: 50px;
          background: #fff;
          transform: rotate(45deg);
          animation-delay: 8s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateY(-60px) rotate(240deg);
          }
        }

        .auth-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          max-width: 1200px;
          width: 100%;
          align-items: center;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.5);
          animation: slideInLeft 0.8s ease-out;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-section {
          margin-bottom: 2rem;
        }

        .logo {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .brand-name {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-tagline {
          color: #6b7280;
          margin: 0;
          font-size: 0.9rem;
        }

        .auth-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .auth-subtitle {
          color: #6b7280;
          margin: 0;
        }

        .error-message {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          color: #991b1b;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .auth-form {
          margin-bottom: 2rem;
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          z-index: 2;
          font-size: 1.2rem;
          opacity: 0.6;
        }

        .auth-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
        }

        .auth-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .auth-input:focus + .input-label {
          transform: translateY(-1.5rem) scale(0.85);
          color: #667eea;
        }

        .input-label {
          position: absolute;
          left: 3rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 0.9rem;
          pointer-events: none;
          transition: all 0.3s ease;
          background: white;
          padding: 0 0.5rem;
        }

        .auth-input:not(:placeholder-shown) + .input-label {
          transform: translateY(-1.5rem) scale(0.85);
          color: #667eea;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }

        .password-toggle:hover {
          opacity: 1;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .checkbox {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 4px;
          margin-right: 0.5rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .checkbox:checked + .checkmark {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: #667eea;
        }

        .checkbox:checked + .checkmark::after {
          content: '✓';
          position: absolute;
          color: white;
          font-size: 0.8rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .checkbox-label {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .forgot-link {
          color: #667eea;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .forgot-link:hover {
          color: #764ba2;
        }

        .auth-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .auth-divider {
          text-align: center;
          margin: 2rem 0;
          position: relative;
          color: #9ca3af;
          font-size: 0.9rem;
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
          z-index: 1;
        }

        .auth-divider span {
          background: white;
          padding: 0 1rem;
          position: relative;
          z-index: 2;
        }

        .social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .social-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-button:hover {
          border-color: #d1d5db;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .social-icon {
          font-size: 1.2rem;
        }

        .auth-footer {
          text-align: center;
          color: #6b7280;
        }

        .auth-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          margin-left: 0.5rem;
          transition: color 0.3s ease;
        }

        .auth-link:hover {
          color: #764ba2;
        }

        .auth-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          animation: slideInRight 0.8s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .info-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
        }

        .info-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .info-card h3 {
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .info-card p {
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          line-height: 1.5;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .auth-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .auth-info {
            flex-direction: row;
            overflow-x: auto;
            gap: 1rem;
          }

          .info-card {
            min-width: 250px;
          }
        }

        @media (max-width: 768px) {
          .auth-container {
            padding: 1rem;
          }

          .auth-card {
            padding: 2rem;
          }

          .auth-info {
            flex-direction: column;
          }

          .social-buttons {
            grid-template-columns: 1fr;
          }

          .form-options {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 1.5rem;
          }

          .brand-name {
            font-size: 1.5rem;
          }

          .auth-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginForm;
