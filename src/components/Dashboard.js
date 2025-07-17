import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import TaxForm from './TaxForm';
import api from '../services/api';

function Dashboard() {
  const { user, logout } = useAuth();
  const [taxReturns, setTaxReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const fetchTaxReturns = useCallback(async () => {
    try {
      const response = await api.get('/tax-returns');
      setTaxReturns(response.data);
    } catch (error) {
      console.error('Error fetching tax returns:', error);
      addNotification('Failed to load tax returns', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaxReturns();
  }, [fetchTaxReturns]);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleLogout = () => {
    logout();
  };

  const handleTaxFormSuccess = (newTaxReturn) => {
    setShowTaxForm(false);
    fetchTaxReturns();
    addNotification('Tax return filed successfully! 🎉');
  };

  const handleUploadDocument = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(50);
      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadProgress(100);
      addNotification('Document uploaded successfully! 📄');
      setTimeout(() => {
        setShowUploadForm(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error uploading document:', error);
      addNotification('Failed to upload document', 'error');
      setUploadProgress(0);
    }
  };

  const downloadTaxReturn = async (taxReturnId) => {
    try {
      const response = await api.get(`/tax-returns/${taxReturnId}/export/json`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tax_return_${taxReturnId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      addNotification('Tax return downloaded successfully! 📥');
    } catch (error) {
      console.error('Error downloading tax return:', error);
      addNotification('Failed to download tax return', 'error');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const totalRefunds = taxReturns.reduce((sum, tr) => sum + tr.refund_amount, 0);
  const totalIncome = taxReturns.reduce((sum, tr) => sum + tr.income, 0);
  const pendingReturns = taxReturns.filter(tr => tr.status === 'draft').length;

  return (
    <div className="dashboard-container">
      {/* Notifications */}
      <div className="notifications">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="greeting-section">
            <h1 className="greeting">{getGreeting()}, {user?.full_name?.split(' ')[0]}! 👋</h1>
            <p className="subtitle">Ready to manage your taxes with confidence?</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => {setShowTaxForm(false); setShowUploadForm(false);}} 
              className={`nav-btn ${!showTaxForm && !showUploadForm ? 'active' : ''}`}
            >
              📊 Dashboard
            </button>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {!showTaxForm && !showUploadForm && (
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">📄</div>
            <div className="stat-content">
              <div className="stat-number">{taxReturns.length}</div>
              <div className="stat-label">Tax Returns</div>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">${totalRefunds.toLocaleString()}</div>
              <div className="stat-label">Total Refunds</div>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-number">${totalIncome.toLocaleString()}</div>
              <div className="stat-label">Total Income</div>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{pendingReturns}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        </div>
      )}

      {/* Tax Form */}
      {showTaxForm && (
        <div className="form-container animate-in">
          <TaxForm onSuccess={handleTaxFormSuccess} />
        </div>
      )}

      {/* Upload Form */}
      {showUploadForm && (
        <div className="form-container animate-in">
          <div className="upload-card">
            <h2 className="form-title">📄 Upload Tax Documents</h2>
            <div className="upload-area">
              <div className="upload-icon">📁</div>
              <h3>Drag & drop your files here</h3>
              <p>or click to browse</p>
              <label className="upload-btn">
                Choose Files
                <input
                  type="file"
                  onChange={handleUploadDocument}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  style={{ display: 'none' }}
                  multiple
                />
              </label>
              <div className="upload-info">
                <small>Supported: PDF, JPG, PNG, DOC, DOCX • Max 10MB each</small>
              </div>
              {uploadProgress > 0 && (
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowUploadForm(false)} 
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!showTaxForm && !showUploadForm && (
        <div className="actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card primary" onClick={() => setShowTaxForm(true)}>
              <div className="action-icon">📝</div>
              <div className="action-content">
                <h3>File New Return</h3>
                <p>Start your 2024 tax return</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
            
            <div className="action-card secondary" onClick={() => setShowUploadForm(true)}>
              <div className="action-icon">📄</div>
              <div className="action-content">
                <h3>Upload Documents</h3>
                <p>W-2, 1099, and other forms</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
            
            <div className="action-card accent" onClick={() => setShowTaxForm(true)}>
              <div className="action-icon">💰</div>
              <div className="action-content">
                <h3>Calculate Refund</h3>
                <p>Estimate your tax refund</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          </div>
        </div>
      )}

      {/* Tax Returns History */}
      {!showTaxForm && !showUploadForm && (
        <div className="returns-section">
          <div className="section-header">
            <h2 className="section-title">Your Tax Returns</h2>
            <button 
              onClick={() => setShowTaxForm(true)} 
              className="primary-btn"
            >
              + New Return
            </button>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your tax returns...</p>
            </div>
          ) : taxReturns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No tax returns yet</h3>
              <p>Start your first return to see it here</p>
              <button 
                onClick={() => setShowTaxForm(true)} 
                className="primary-btn"
              >
                File Your First Return
              </button>
            </div>
          ) : (
            <div className="returns-grid">
              {taxReturns.map((taxReturn, index) => (
                <div key={taxReturn.id} className="return-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="return-header">
                    <div className="return-year">
                      <span className="year-label">Tax Year</span>
                      <span className="year-number">{taxReturn.tax_year}</span>
                    </div>
                    <span className={`status-badge ${taxReturn.status}`}>
                      {taxReturn.status === 'draft' ? '📝' : '✅'} {taxReturn.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="return-details">
                    <div className="detail-row">
                      <span className="detail-label">Income</span>
                      <span className="detail-value">${taxReturn.income.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Deductions</span>
                      <span className="detail-value">${taxReturn.deductions.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Tax Owed</span>
                      <span className="detail-value">${taxReturn.tax_owed.toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Withholdings</span>
                      <span className="detail-value">${taxReturn.withholdings.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="return-result">
                    {taxReturn.refund_amount > 0 ? (
                      <div className="refund-amount">
                        <span className="refund-icon">💰</span>
                        <span className="refund-text">Refund: ${taxReturn.refund_amount.toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="owed-amount">
                        <span className="owed-icon">💸</span>
                        <span className="owed-text">Owed: ${taxReturn.amount_owed.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="return-actions">
                    <button className="action-btn secondary">
                      👁️ View Details
                    </button>
                    {taxReturn.status === 'draft' && (
                      <button className="action-btn primary">
                        📝 Continue
                      </button>
                    )}
                    <button 
                      onClick={() => downloadTaxReturn(taxReturn.id)}
                      className="action-btn outline"
                    >
                      📥 Download
                    </button>
                  </div>
                  
                  <div className="return-date">
                    Created: {new Date(taxReturn.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .notifications {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .notification {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          color: white;
          font-weight: 500;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          animation: slideIn 0.3s ease-out;
          max-width: 300px;
        }

        .notification.success {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .notification.error {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .dashboard-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .greeting {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          margin: 0.5rem 0 0 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .nav-btn, .logout-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .nav-btn.active {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .logout-btn {
          background: rgba(239, 68, 68, 0.8);
          color: white;
        }

        .nav-btn:hover, .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          font-size: 3rem;
          opacity: 0.8;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-label {
          color: #6b7280;
          font-weight: 500;
        }

        .stat-card.primary .stat-icon { filter: hue-rotate(200deg); }
        .stat-card.success .stat-icon { filter: hue-rotate(120deg); }
        .stat-card.info .stat-icon { filter: hue-rotate(180deg); }
        .stat-card.warning .stat-icon { filter: hue-rotate(40deg); }

        .form-container {
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .upload-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2rem;
        }

        .upload-area {
          border: 3px dashed #d1d5db;
          border-radius: 20px;
          padding: 3rem;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
          background: rgba(249, 250, 251, 0.5);
        }

        .upload-area:hover {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
        }

        .upload-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .upload-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
          margin-top: 1rem;
        }

        .upload-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        }

        .progress-container {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          transition: width 0.3s ease;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .action-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .action-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .action-icon {
          font-size: 3rem;
          opacity: 0.8;
        }

        .action-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .action-content p {
          color: #6b7280;
          margin: 0;
        }

        .action-arrow {
          font-size: 1.5rem;
          color: #6b7280;
          margin-left: auto;
          transition: transform 0.3s ease;
        }

        .action-card:hover .action-arrow {
          transform: translateX(5px);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .primary-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .loading-container {
          text-align: center;
          padding: 4rem 2rem;
          color: white;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .empty-state h3 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .returns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
        }

        .return-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.5);
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .return-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .return-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .year-label {
          display: block;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .year-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-badge.draft {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.filed {
          background: #d1fae5;
          color: #065f46;
        }

        .return-details {
          margin-bottom: 1.5rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .detail-label {
          color: #6b7280;
          font-weight: 500;
        }

        .detail-value {
          color: #1f2937;
          font-weight: 600;
        }

        .return-result {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 12px;
          text-align: center;
        }

        .refund-amount {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          color: #065f46;
          font-weight: 700;
        }

        .owed-amount {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          color: #991b1b;
          font-weight: 700;
        }

        .return-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .action-btn {
          flex: 1;
          min-width: 120px;
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }

        .action-btn.secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .action-btn.outline {
          background: transparent;
          border: 2px solid #e5e7eb;
          color: #6b7280;
        }

        .action-btn:hover {
          transform: translateY(-2px);
        }

        .return-date {
          font-size: 0.875rem;
          color: #9ca3af;
          text-align: center;
        }

        .cancel-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .cancel-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
        }

        .upload-info {
          margin-top: 1rem;
        }

        .upload-info small {
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .greeting {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }

          .stat-card {
            padding: 1.5rem;
            flex-direction: column;
            text-align: center;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .returns-grid {
            grid-template-columns: 1fr;
          }

          .return-actions {
            flex-direction: column;
          }

          .action-btn {
            min-width: auto;
          }

          .section-header {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 0.5rem;
          }

          .dashboard-header {
            padding: 1.5rem;
          }

          .greeting {
            font-size: 1.75rem;
          }

          .upload-card {
            padding: 2rem;
          }

          .upload-area {
            padding: 2rem;
          }

          .notifications {
            left: 1rem;
            right: 1rem;
            top: 1rem;
          }

          .notification {
            max-width: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .dashboard-container {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          }

          .stat-card, .action-card, .return-card, .upload-card, .empty-state {
            background: rgba(31, 41, 55, 0.95);
            border-color: rgba(75, 85, 99, 0.3);
          }

          .greeting, .section-title {
            color: #f9fafb;
          }

          .stat-number, .action-content h3, .year-number, .detail-value {
            color: #f9fafb;
          }

          .empty-state h3 {
            color: #f9fafb;
          }

          .form-title {
            color: #f9fafb;
          }
        }

        /* Animation for better UX */
        .animate-in {
          animation: slideInScale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes slideInScale {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Hover effects for better interactivity */
        .stat-card, .action-card, .return-card {
          position: relative;
          overflow: hidden;
        }

        .stat-card::before, .action-card::before, .return-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }

        .stat-card:hover::before, .action-card:hover::before, .return-card:hover::before {
          left: 100%;
        }

        /* Focus states for accessibility */
        .nav-btn:focus, .logout-btn:focus, .primary-btn:focus, .action-btn:focus, .upload-btn:focus, .cancel-btn:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Print styles */
        @media print {
          .dashboard-container {
            background: white;
            color: black;
          }

          .header-actions, .action-card, .notifications {
            display: none;
          }

          .stat-card, .return-card {
            box-shadow: none;
            border: 1px solid #e5e7eb;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
