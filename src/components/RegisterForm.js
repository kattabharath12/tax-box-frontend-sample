import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const { register } = useAuth();

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very Weak';
        break;
      case 2:
        feedback = 'Weak';
        break;
      case 3:
        feedback = 'Fair';
        break;
      case 4:
        feedback = 'Good';
        break;
      case 5:
        feedback = 'Strong';
        break;
      default:
        feedback = 'Very Weak';
    }

    return { score, feedback };
  };

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password');
      setLoading(false);
      return;
    }

    try {
      await register(email, fullName, password);
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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

        <div className="success-content">
          <div className="success-card">
            <div className="success-animation">
              <div className="checkmark-circle">
                <div className="checkmark">✓</div>
              </div>
            </div>
            <h2 className="success-title">Welcome to TaxBox.AI! 🎉</h2>
            <p className="success-message">
              Your account has been created successfully. You're now ready to start your tax journey with us.
            </p>
            <div className="success-features">
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span>Fast tax filing</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <span>AI-powered calculations</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💰</span>
                <span>Maximum refund optimization</span>
              </div>
            </div>
            <a href="/login" className="success-button">
              Sign In to Your Account
            </a>
          </div>
        </div>

        <style jsx>{`
          .success-content {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
          }

          .success-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 3rem;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.5);
            animation: scaleIn 0.8s ease-out;
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .success-animation {
            margin-bottom: 2rem;
          }

          .checkmark-circle {
            width: 100px;
            height: 100px;
            margin: 0 auto;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            70% {
              transform: scale(1.05);
              box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
            }
          }

          .checkmark {
            color: white;
            font-size: 2.5rem;
            font-weight: bold;
          }

          .success-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
          }

          .success-message {
            color: #6b7280;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .success-features {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .feature-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 12px;
            color: #374151;
            font-weight: 500;
          }

          .feature-icon {
            font-size: 1.5rem;
          }

          .success-button {
            display: inline-block;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .success-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          }
        `}</style>
      </div>
    );
  }

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
        <div className="auth-info">
          <div className="info-header">
            <h2>Join TaxBox.AI Today</h2>
            <p>Start your journey to stress-free tax filing</p>
          </div>
          
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">⚡</div>
              <div className="benefit-content">
                <h4>Lightning Fast</h4>
                <p>Complete your taxes in under 30 minutes</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <div className="benefit-content">
                <h4>Maximum Accuracy</h4>
                <p>AI-powered calculations ensure error-free returns</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💎</div>
              <div className="benefit-content">
                <h4>Premium Security</h4>
                <p>Bank-level encryption protects your data</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📈</div>
              <div className="benefit-content">
                <h4>Maximize Refunds</h4>
                <p>Smart deduction finder increases your refund</p>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="testimonial-content">
              <p>"TaxBox.AI made filing my taxes so simple. Got my refund in just 5 days!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💼</div>
                <div>
                  <div className="author-name">Michael Chen</div>
                  <div className="author-title">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-section">
              <div className="logo">🎯</div>
              <h1 className="brand-name">TaxBox.AI</h1>
            </div>
            <h2 className="auth-title">Create Your Account</h2>
            <p className="auth-subtitle">Join thousands of satisfied taxpayers</p>
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
                <div className="input-icon">👤</div>
                <input
                  type="text"
                  className="auth-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
                <label className="input-label">Full Name</label>
              </div>
            </div>

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
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Create a password"
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
              {password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className={`strength-fill strength-${passwordStrength.score}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`strength-text strength-${passwordStrength.score}`}>
                    {passwordStrength.feedback}
                  </span>
                </div>
              )}
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <div className="input-icon">🔒</div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="auth-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <label className="input-label">Confirm Password</label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <div className="password-mismatch">
                  <span className="mismatch-icon">❌</span>
                  <span>Passwords don't match</span>
                </div>
              )}
              {confirmPassword && password === confirmPassword && (
                <div className="password-match">
                  <span className="match-icon">✅</span>
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            <div className="terms-agreement">
              <label className="checkbox-wrapper">
                <input type="checkbox" className="checkbox" required />
                <span className="checkmark"></span>
                <span className="checkbox-label">
                  I agree to the <a href="#terms" className="terms-link">Terms of Service</a> and 
                  <a href="#privacy" className="terms-link">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading || passwordStrength.score < 3}
            >
              {loading ? (
                <div className="button-loading">
                  <div className="spinner"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or sign up with</span>
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
              Already have an account? 
              <a href="/login" className="auth-link">Sign In</a>
            </p>
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
          max-width: 1400px;
          width: 100%;
          align-items: center;
        }

        .auth-info {
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

        .info-header {
          margin-bottom: 3rem;
        }

        .info-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .info-header p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        .benefits-list {
          margin-bottom: 3rem;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .benefit-item:hover {
          transform: translateX(10px);
          background: rgba(255, 255, 255, 0.15);
        }

        .benefit-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .benefit-content h4 {
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
        }

        .benefit-content p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          line-height: 1.5;
        }

        .testimonial {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .testimonial-content p {
          color: white;
          font-size: 1.1rem;
          font-style: italic;
          margin: 0 0 1.5rem 0;
          line-height: 1.6;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .author-name {
          color: white;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .author-title {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.5);
          animation: slideInRight 0.8s ease-out;
          max-height: 90vh;
          overflow-y: auto;
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

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-section {
          margin-bottom: 1.5rem;
        }

        .logo {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .brand-name {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-title {
          font-size: 1.5rem;
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

        .password-strength {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .strength-fill.strength-1 { background: #ef4444; }
        .strength-fill.strength-2 { background: #f97316; }
        .strength-fill.strength-3 { background: #eab308; }
        .strength-fill.strength-4 { background: #22c55e; }
        .strength-fill.strength-5 { background: #10b981; }

        .strength-text {
          font-size: 0.8rem;
          font-weight: 500;
        }

        .strength-text.strength-1 { color: #ef4444; }
        .strength-text.strength-2 { color: #f97316; }
        .strength-text.strength-3 { color: #eab308; }
        .strength-text.strength-4 { color: #22c55e; }
        .strength-text.strength-5 { color: #10b981; }

        .password-mismatch, .password-match {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .password-mismatch {
          color: #ef4444;
        }

        .password-match {
          color: #10b981;
        }

        .terms-agreement {
          margin-bottom: 1.5rem;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: flex-start;
          cursor: pointer;
          line-height: 1.5;
        }

        .checkbox {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 4px;
          margin-right: 0.75rem;
          margin-top: 0.125rem;
          position: relative;
          transition: all 0.3s ease;
          flex-shrink: 0;
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

        .terms-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          margin: 0 0.25rem;
        }

        .terms-link:hover {
          color: #764ba2;
          text-decoration: underline;
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
          background: #9ca3af;
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

        /* Responsive Design */
        @media (max-width: 1200px) {
          .auth-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .auth-info {
            order: 2;
          }

          .auth-card {
            order: 1;
          }

          .benefits-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
          }

          .benefit-item {
            margin-bottom: 0;
          }
        }

        @media (max-width: 768px) {
          .auth-container {
            padding: 1rem;
          }

          .auth-card {
            padding: 2rem;
          }

          .info-header h2 {
            font-size: 2rem;
          }

          .benefits-list {
            grid-template-columns: 1fr;
          }

          .social-buttons {
            grid-template-columns: 1fr;
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
            font-size: 1.25rem;
          }

          .benefit-item {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default RegisterForm;
