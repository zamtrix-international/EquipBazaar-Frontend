// pages/customer/Payment/Payment.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../../services/api';
import './Payment.css';

// Icon Components
const Icons = {
  CreditCard: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  ),
  MoneyBill: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
      <circle cx="12" cy="12" r="2"></circle>
      <line x1="6" y1="12" x2="6.01" y2="12"></line>
      <line x1="18" y1="12" x2="18.01" y2="12"></line>
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  Spinner: () => (
    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M6.9 17.1l-2.82 2.82M17.1 6.9l2.82-2.82M4.93 19.07l2.83-2.83"></path>
    </svg>
  )
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { equipment, duration, date, hours, total } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: ''
  });

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Handle card input changes
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formatted = formatCardNumber(value);
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiry') {
      let formatted = value.replace(/[^0-9]/g, '');
      if (formatted.length >= 2) {
        formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
      }
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'cvv') {
      const formatted = value.replace(/[^0-9]/g, '').substring(0, 4);
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
    } else {
      setCardDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  // Validate card details
  const validateCardDetails = () => {
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    if (!cardDetails.nameOnCard.trim()) {
      setError('Please enter the name on card');
      return false;
    }
    return true;
  };

  // Handle payment submission
  const handlePayment = async () => {
    if (!equipment) {
      navigate('/equipment');
      return;
    }

    if (paymentMethod === 'online' && !validateCardDetails()) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const bookingData = {
        equipmentId: equipment.id,
        startDate: date,
        duration: duration,
        hours: hours,
        totalAmount: total,
        paymentMethod: paymentMethod,
        ...(paymentMethod === 'online' && {
          cardLast4: cardDetails.cardNumber.slice(-4),
          cardHolderName: cardDetails.nameOnCard
        })
      };

      const response = await bookingAPI.createBooking(bookingData);
      
      if (response?.data?.success) {
        alert(paymentMethod === 'cash' 
          ? 'Booking confirmed! Pay when equipment arrives.' 
          : 'Payment successful! Booking confirmed.'
        );
        navigate('/customer/bookings');
      } else {
        throw new Error(response?.data?.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Payment failed:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
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
    if (!dateString) return 'Not selected';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // If no equipment data, redirect
  if (!equipment) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="error-state">
            <Icons.AlertCircle />
            <h2>No Booking Data Found</h2>
            <p>Please select equipment and try again.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/equipment')}
            >
              Browse Equipment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <h1 className="page-title">Complete Your Booking</h1>

        <div className="payment-grid">
          {/* Booking Summary */}
          <div className="summary-card">
            <h2>Booking Summary</h2>
            
            <div className="equipment-info">
              <h3>{equipment.name}</h3>
              <span className="equipment-category">{equipment.category}</span>
            </div>

            <div className="summary-details">
              <div className="summary-item">
                <Icons.Calendar />
                <span className="label">Date</span>
                <span className="value">{formatDate(date)}</span>
              </div>

              <div className="summary-item">
                <Icons.Clock />
                <span className="label">Duration</span>
                <span className="value">
                  {duration === 'hourly' ? `${hours} hours` : 
                   duration === 'daily' ? '1 day' : '1 week'}
                </span>
              </div>

              <div className="summary-item">
                <Icons.User />
                <span className="label">Vendor</span>
                <span className="value">{equipment.vendor?.name || equipment.vendor}</span>
              </div>
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Base Price</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="price-row">
                <span>Taxes & Fees</span>
                <span>Included</span>
              </div>
              <div className="price-row total">
                <span>Total Amount</span>
                <span className="total-price">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-card">
            <h2>Select Payment Method</h2>

            {error && (
              <div className="error-message">
                <Icons.AlertCircle />
                <span>{error}</span>
              </div>
            )}

            <div className="payment-methods">
              {/* Online Payment Option */}
              <label className={`payment-method ${paymentMethod === 'online' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setError('');
                  }}
                />
                <div className="method-content">
                  <div className="method-icon">
                    <Icons.CreditCard />
                  </div>
                  <div className="method-info">
                    <h3>Online Payment</h3>
                    <p>Pay via UPI, Card, or NetBanking</p>
                  </div>
                  <div className="method-check">
                    <span className="checkmark"></span>
                  </div>
                </div>
              </label>

              {/* Cash on Delivery Option */}
              <label className={`payment-method ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    setError('');
                  }}
                />
                <div className="method-content">
                  <div className="method-icon">
                    <Icons.MoneyBill />
                  </div>
                  <div className="method-info">
                    <h3>Cash on Delivery</h3>
                    <p>Pay when equipment arrives</p>
                  </div>
                  <div className="method-check">
                    <span className="checkmark"></span>
                  </div>
                </div>
              </label>
            </div>

            {/* Card Details Form (Online Payment) */}
            {paymentMethod === 'online' && (
              <div className="card-details-form">
                <h3>Card Details</h3>
                
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={handleCardChange}
                    maxLength="19"
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input
                      type="text"
                      id="expiry"
                      name="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={handleCardChange}
                      maxLength="5"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="password"
                      id="cvv"
                      name="cvv"
                      placeholder="***"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      maxLength="4"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="nameOnCard">Name on Card</label>
                  <input
                    type="text"
                    id="nameOnCard"
                    name="nameOnCard"
                    placeholder="John Doe"
                    value={cardDetails.nameOnCard}
                    onChange={handleCardChange}
                    className="form-input"
                  />
                </div>
              </div>
            )}

            {/* Pay Now Button */}
            <button 
              className="pay-now-btn"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Icons.Spinner />
                  Processing...
                </>
              ) : (
                `Pay ${formatCurrency(total)}`
              )}
            </button>

            {/* Security Note */}
            <p className="secure-text">
              <Icons.Lock />
              Your payment information is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;