// pages/customer/MyBookings/MyBookings.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../../services/api';
import './MyBookings.css';

// Icon Components (Construction Theme)
const Icons = {
  Spinner: () => (
    <svg className="spinner" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M6.9 17.1l-2.82 2.82M17.1 6.9l2.82-2.82M4.93 19.07l2.83-2.83"></path>
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
  
  Times: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  ),
  
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  
  CalendarTimes: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <line x1="15" y1="14" x2="9" y2="20"></line>
      <line x1="9" y1="14" x2="15" y2="20"></line>
    </svg>
  ),
  
  Exclamation: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  )
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  const navigate = useNavigate();

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filter !== 'all' && { status: filter })
      };

      const response = await bookingAPI.getMyBookings(params);
      
      if (response?.data?.success) {
        setBookings(response.data.data.bookings || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.data.total || 0,
          pages: response.data.data.pages || 0
        }));
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings. Please try again.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filter, pagination.page, pagination.limit]);

  // Initial fetch
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await bookingAPI.cancelBooking(bookingId);
      
      if (response?.data?.success) {
        // Refresh bookings after cancellation
        fetchBookings();
      } else {
        throw new Error(response?.data?.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err.message || 'Failed to cancel booking. Please try again.');
    }
  };

  // Handle view details
  const handleViewDetails = (bookingId) => {
    navigate(`/customer/bookings/${bookingId}`);
  };

  // Handle write review
  const handleWriteReview = (bookingId) => {
    navigate(`/customer/review/${bookingId}`);
  };

  // Handle browse equipment
  const handleBrowseEquipment = () => {
    navigate('/equipment');
  };

  // Handle retry
  const handleRetry = () => {
    fetchBookings();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Format status
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get status class
  const getStatusClass = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'in_progress': 'status-progress',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status] || '';
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

  // Loading state
  if (loading && bookings.length === 0) {
    return (
      <div className="my-bookings-page">
        <div className="container">
          <div className="loading-state">
            <Icons.Spinner />
            <p>Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">My Bookings</h1>
          {bookings.length > 0 && (
            <p className="bookings-count">
              Showing {bookings.length} of {pagination.total} bookings
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-state">
            <Icons.Exclamation />
            <p>{error}</p>
            <button onClick={handleRetry} className="btn-retry">
              Try Again
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${filter === tab ? 'active' : ''} ${getStatusClass(tab)}`}
              onClick={() => handleFilterChange(tab)}
            >
              {formatStatus(tab)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="bookings-container">
          {bookings.length > 0 ? (
            <>
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  {/* Image */}
                  <div className="booking-image">
                    <img 
                      src={booking.image || '/placeholder-equipment.jpg'} 
                      alt={booking.equipment?.name || 'Equipment'}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/placeholder-equipment.jpg';
                      }}
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="booking-details">
                    <div className="booking-header">
                      <div>
                        <h3>{booking.equipment?.name || 'Equipment'}</h3>
                        <p className="booking-vendor">{booking.vendor?.name || booking.vendor}</p>
                      </div>
                      <span className={`booking-status ${getStatusClass(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </div>

                    <div className="booking-info">
                      <p>
                        <Icons.Calendar />
                        {formatDate(booking.startDate || booking.date)}
                      </p>
                      <p>
                        <Icons.Clock />
                        {booking.duration || `${booking.hours || 1} hours`}
                      </p>
                      <p>
                        <Icons.User />
                        {booking.vendor?.name || booking.vendor || 'Vendor'}
                      </p>
                    </div>

                    <div className="booking-footer">
                      <div className="booking-amount">
                        <span>Total Amount:</span>
                        <strong>{formatCurrency(booking.totalAmount || booking.amount)}</strong>
                      </div>
                      
                      <div className="booking-actions">
                        {/* Pending Bookings */}
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              className="btn-cancel"
                              onClick={() => handleCancelBooking(booking.id)}
                              title="Cancel Booking"
                            >
                              <Icons.Times />
                              <span>Cancel</span>
                            </button>
                            <button 
                              className="btn-view"
                              onClick={() => handleViewDetails(booking.id)}
                              title="View Details"
                            >
                              <Icons.Eye />
                              <span>Details</span>
                            </button>
                          </>
                        )}
                        
                        {/* Confirmed/In Progress Bookings */}
                        {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                          <button 
                            className="btn-view"
                            onClick={() => handleViewDetails(booking.id)}
                            title="View Details"
                          >
                            <Icons.Eye />
                            <span>View Details</span>
                          </button>
                        )}
                        
                        {/* Completed Bookings */}
                        {booking.status === 'completed' && (
                          <>
                            <button 
                              className="btn-review"
                              onClick={() => handleWriteReview(booking.id)}
                              title="Write Review"
                            >
                              <Icons.Star />
                              <span>Write Review</span>
                            </button>
                            <button 
                              className="btn-view"
                              onClick={() => handleViewDetails(booking.id)}
                              title="View Details"
                            >
                              <Icons.Eye />
                              <span>Details</span>
                            </button>
                          </>
                        )}
                        
                        {/* Cancelled Bookings */}
                        {booking.status === 'cancelled' && (
                          <button 
                            className="btn-view"
                            onClick={() => handleViewDetails(booking.id)}
                            title="View Details"
                          >
                            <Icons.Eye />
                            <span>View Details</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    ← Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  
                  <button
                    className="pagination-btn"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            // Empty State
            <div className="empty-state">
              <div className="empty-icon">
                <Icons.CalendarTimes />
              </div>
              <h3>No bookings found</h3>
              <p>
                {filter !== 'all' 
                  ? `You don't have any ${formatStatus(filter)} bookings yet` 
                  : "You haven't made any bookings yet"}
              </p>
              <button 
                className="btn-browse"
                onClick={handleBrowseEquipment}
              >
                <Icons.Search />
                <span>Browse Equipment</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;