// pages/vendor/Earnings/Earnings.jsx
import { useState, useEffect, useCallback } from 'react';
import { vendorAPI, payoutAPI } from '../../../services/api';
import './Earnings.css';

// Icon Components
const Icons = {
  Rupee: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3h12M6 8h12M14 18l4 3M6 13h8a4 4 0 0 0 0-8H6"></path>
    </svg>
  ),
  Calendar: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Clock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  Withdraw: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 7l-5-5-5 5M7 17l5 5 5-5"></path>
    </svg>
  ),
  Spinner: () => (
    <svg className="spinner" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M6.9 17.1l-2.82 2.82M17.1 6.9l2.82-2.82M4.93 19.07l2.83-2.83"></path>
    </svg>
  ),
  Empty: () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="16" y1="3" x2="22" y2="7"></line>
      <line x1="8" y1="3" x2="2" y2="7"></line>
    </svg>
  )
};

const Earnings = () => {
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    pending: 0,
    withdrawn: 0,
    available: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [dateRange, setDateRange] = useState('month');

  // Fetch earnings data
  const fetchEarningsData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [summaryRes, transactionsRes] = await Promise.all([
        vendorAPI.getEarningsSummary({ range: dateRange }),
        vendorAPI.getEarningsTransactions({ limit: 10, sort: '-date' })
      ]);

      // Handle earnings summary
      if (summaryRes?.data?.success) {
        setEarnings(summaryRes.data.data || {
          total: 0,
          thisMonth: 0,
          pending: 0,
          withdrawn: 0,
          available: 0
        });
      } else if (summaryRes?.data) {
        setEarnings({
          total: summaryRes.data.total || 0,
          thisMonth: summaryRes.data.thisMonth || 0,
          pending: summaryRes.data.pending || 0,
          withdrawn: summaryRes.data.withdrawn || 0,
          available: (summaryRes.data.total || 0) - (summaryRes.data.withdrawn || 0)
        });
      } else {
        throw new Error(summaryRes?.data?.message || 'Failed to fetch earnings');
      }

      // Handle transactions
      if (transactionsRes?.data?.success) {
        setTransactions(transactionsRes.data.data.transactions || []);
      } else if (transactionsRes?.data?.transactions) {
        setTransactions(transactionsRes.data.transactions);
      } else if (Array.isArray(transactionsRes?.data)) {
        setTransactions(transactionsRes.data);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error('Error fetching earnings data:', err);
      setError(err.message || 'Failed to load earnings. Please try again.');
      setEarnings({ total: 0, thisMonth: 0, pending: 0, withdrawn: 0, available: 0 });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchEarningsData();
  }, [fetchEarningsData]);

  // Handle withdraw
  const handleWithdraw = async () => {
    const availableAmount = earnings.total - earnings.withdrawn;
    
    if (availableAmount <= 0) {
      alert('No funds available for withdrawal');
      return;
    }

    if (!window.confirm(`Are you sure you want to withdraw ₹${availableAmount.toLocaleString('en-IN')}?`)) {
      return;
    }

    setWithdrawLoading(true);
    setError('');

    try {
      const response = await payoutAPI.createWithdrawalRequest({
        amount: availableAmount
      });

      if (response?.data?.success) {
        alert('Withdrawal request submitted successfully!');
        fetchEarningsData();
      } else {
        throw new Error(response?.data?.message || 'Withdrawal failed');
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
      setError(err.message || 'Failed to process withdrawal. Please try again.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Get status class
  const getStatusClass = (status) => {
    const statusMap = {
      'paid': 'status-paid',
      'pending': 'status-pending',
      'failed': 'status-failed',
      'withdrawn': 'status-withdrawn'
    };
    return statusMap[status?.toLowerCase()] || 'status-pending';
  };

  // Loading state
  if (loading) {
    return (
      <div className="earnings-page">
        <div className="container">
          <div className="loading-state">
            <Icons.Spinner />
            <p>Loading earnings data...</p>
          </div>
        </div>
      </div>
    );
  }

  const availableBalance = earnings.total - earnings.withdrawn;

  return (
    <div className="earnings-page">
      <div className="container">
        {/* Header - Title Left, Button Right */}
        <div className="page-header">
          <h1 className="page-title">Earnings</h1>
          <div className="header-right">
            <div className="date-filter">
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="date-select"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={fetchEarningsData} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="earnings-stats">
          <div className="stat-card stat-total">
            <div className="stat-icon">
              <Icons.Rupee />
            </div>
            <div className="stat-details">
              <span className="stat-label">Total Earnings</span>
              <span className="stat-value">{formatCurrency(earnings.total)}</span>
            </div>
          </div>

          <div className="stat-card stat-month">
            <div className="stat-icon">
              <Icons.Calendar />
            </div>
            <div className="stat-details">
              <span className="stat-label">This Month</span>
              <span className="stat-value">{formatCurrency(earnings.thisMonth)}</span>
            </div>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-icon">
              <Icons.Clock />
            </div>
            <div className="stat-details">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{formatCurrency(earnings.pending)}</span>
            </div>
          </div>

          <div className="stat-card stat-withdrawn">
            <div className="stat-icon">
              <Icons.CheckCircle />
            </div>
            <div className="stat-details">
              <span className="stat-label">Withdrawn</span>
              <span className="stat-value">{formatCurrency(earnings.withdrawn)}</span>
            </div>
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="withdraw-section">
          <h2>Withdraw Earnings</h2>
          <div className="withdraw-card">
            <div className="balance-info">
              <span className="balance-label">Available Balance</span>
              <strong className="balance-amount">{formatCurrency(availableBalance)}</strong>
              <span className="balance-note">Minimum withdrawal: ₹1000</span>
            </div>
            <button 
              className="withdraw-btn"
              onClick={handleWithdraw}
              disabled={withdrawLoading || availableBalance < 1000}
            >
              {withdrawLoading ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                <>
                  <Icons.Withdraw />
                  Withdraw Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="transactions-section">
          <div className="section-header">
            <h2>Transaction History</h2>
            {transactions.length > 0 && (
              <span className="transaction-count">
                {transactions.length} transactions
              </span>
            )}
          </div>

          {transactions.length === 0 ? (
            <div className="empty-state">
              <Icons.Empty />
              <h3>No transactions yet</h3>
              <p>Your earnings will appear here once you start getting bookings</p>
            </div>
          ) : (
            <div className="transactions-table-wrapper">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Equipment</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>
                        <span className="transaction-date">
                          {formatDate(transaction.date)}
                        </span>
                      </td>
                      <td>
                        <span className="equipment-name">
                          {transaction.equipment?.name || transaction.equipment}
                        </span>
                      </td>
                      <td>
                        <span className="customer-name">
                          {transaction.customer?.name || transaction.customer}
                        </span>
                      </td>
                      <td>
                        <span className="transaction-amount">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;