// import { useState, useEffect } from 'react'
// import { bookingAPI } from '../../../services/api'
// import './MyBookings.css'

// const MyBookings = () => {
//   const [bookings, setBookings] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [filter, setFilter] = useState('all')

//   useEffect(() => {
//     const fetchMyBookings = async () => {
//       try {
//         setLoading(true)
//         setError(null)
//         const response = await bookingAPI.getMyBookings({ 
//           status: filter === 'all' ? undefined : filter 
//         })
//         setBookings(response.data.bookings || [])
//       } catch (error) {
//         console.error('Error fetching my bookings:', error)
//         setError('Failed to load bookings. Please try again.')
//         // Fallback to mock data if API fails
//         setBookings([
//           {
//             id: 1,
//             equipment: 'JCB 3DX',
//             image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
//             date: '2024-03-15',
//             duration: '4 hours',
//             amount: 4800,
//             status: 'completed',
//             vendor: 'Ramesh Construction'
//           },
//           {
//             id: 2,
//             equipment: 'Mahindra Tractor',
//             image: 'https://images.unsplash.com/photo-1597161016902-80a5b1b10b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
//             date: '2024-03-18',
//             duration: '8 hours',
//             amount: 6400,
//             status: 'confirmed',
//             vendor: 'Singh Agro Services'
//           },
//           {
//             id: 3,
//             equipment: 'Hydra Crane',
//             image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
//             date: '2024-03-20',
//             duration: '2 hours',
//             amount: 5000,
//             status: 'pending',
//             vendor: 'Meerut Crane Services'
//           },
//           {
//             id: 4,
//             equipment: 'Ashok Leyland Dumper',
//             image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
//             date: '2024-03-22',
//             duration: '1 day',
//             amount: 10000,
//             status: 'in_progress',
//             vendor: 'Verma Transport'
//           }
//         ])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchMyBookings()
//   }, [filter]) // Added filter dependency

//   const filteredBookings = filter === 'all' 
//     ? bookings 
//     : bookings.filter(b => b.status === filter)

//   const getStatusClass = (status) => {
//     switch(status) {
//       case 'completed': return 'status-completed'
//       case 'confirmed': return 'status-confirmed'
//       case 'pending': return 'status-pending'
//       case 'in_progress': return 'status-progress'
//       default: return ''
//     }
//   }

//   const handleCancelBooking = async (bookingId) => {
//     if (window.confirm('Are you sure you want to cancel this booking?')) {
//       try {
//         // Call API to cancel booking
//         // await bookingAPI.cancelBooking(bookingId)
        
//         // Update local state
//         setBookings(prevBookings => 
//           prevBookings.map(booking => 
//             booking.id === bookingId 
//               ? { ...booking, status: 'cancelled' } 
//               : booking
//           )
//         )
//       } catch (error) {
//         console.error('Error cancelling booking:', error)
//         alert('Failed to cancel booking. Please try again.')
//       }
//     }
//   }

//   const handleTrackBooking = (bookingId) => {
//     // Navigate to tracking page
//     console.log('Track booking:', bookingId)
//   }

//   const handleWriteReview = (bookingId) => {
//     // Navigate to review page
//     console.log('Write review for booking:', bookingId)
//   }

//   const handleViewDetails = (bookingId) => {
//     // Navigate to booking details page
//     console.log('View details for booking:', bookingId)
//   }

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     })
//   }

//   const formatStatus = (status) => {
//     return status.split('_').map(word => 
//       word.charAt(0).toUpperCase() + word.slice(1)
//     ).join(' ')
//   }

//   if (loading) {
//     return (
//       <div className="my-bookings-page">
//         <div className="container">
//           <div className="loading-spinner">
//             <i className="fas fa-spinner fa-spin"></i>
//             <p>Loading your bookings...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="my-bookings-page">
//       <div className="container">
//         <h1 className="page-title">My Bookings</h1>

//         {error && (
//           <div className="error-message">
//             <i className="fas fa-exclamation-circle"></i>
//             <p>{error}</p>
//             <button onClick={() => window.location.reload()}>Retry</button>
//           </div>
//         )}

//         {/* Filter Tabs */}
//         <div className="filter-tabs">
//           {['all', 'pending', 'confirmed', 'in_progress', 'completed'].map((tab) => (
//             <button
//               key={tab}
//               className={`filter-tab ${filter === tab ? 'active' : ''}`}
//               onClick={() => setFilter(tab)}
//             >
//               {formatStatus(tab)}
//             </button>
//           ))}
//         </div>

//         {/* Bookings List */}
//         <div className="bookings-container">
//           {filteredBookings.length > 0 ? (
//             filteredBookings.map(booking => (
//               <div key={booking.id} className="booking-card">
//                 <div className="booking-image">
//                   <img src={booking.image} alt={booking.equipment} />
//                 </div>
                
//                 <div className="booking-details">
//                   <div className="booking-header">
//                     <h3>{booking.equipment}</h3>
//                     <span className={`booking-status ${getStatusClass(booking.status)}`}>
//                       {formatStatus(booking.status)}
//                     </span>
//                   </div>

//                   <div className="booking-info">
//                     <p><i className="fas fa-calendar"></i> {formatDate(booking.date)}</p>
//                     <p><i className="fas fa-clock"></i> {booking.duration}</p>
//                     <p><i className="fas fa-user"></i> {booking.vendor}</p>
//                   </div>

//                   <div className="booking-footer">
//                     <div className="booking-amount">
//                       <span>Total Amount:</span>
//                       <strong>₹{booking.amount.toLocaleString('en-IN')}</strong>
//                     </div>
                    
//                     <div className="booking-actions">
//                       {booking.status === 'pending' && (
//                         <>
//                           <button 
//                             className="btn-cancel"
//                             onClick={() => handleCancelBooking(booking.id)}
//                           >
//                             <i className="fas fa-times"></i> Cancel
//                           </button>
//                           <button 
//                             className="btn-view"
//                             onClick={() => handleViewDetails(booking.id)}
//                           >
//                             View Details
//                           </button>
//                         </>
//                       )}
                      
//                       {booking.status === 'confirmed' && (
//                         <>
//                           <button 
//                             className="btn-track"
//                             onClick={() => handleTrackBooking(booking.id)}
//                           >
//                             <i className="fas fa-map-marker-alt"></i> Track
//                           </button>
//                           <button 
//                             className="btn-view"
//                             onClick={() => handleViewDetails(booking.id)}
//                           >
//                             View Details
//                           </button>
//                         </>
//                       )}
                      
//                       {booking.status === 'in_progress' && (
//                         <>
//                           <button 
//                             className="btn-track"
//                             onClick={() => handleTrackBooking(booking.id)}
//                           >
//                             <i className="fas fa-map-marker-alt"></i> Track
//                           </button>
//                           <button 
//                             className="btn-view"
//                             onClick={() => handleViewDetails(booking.id)}
//                           >
//                             View Details
//                           </button>
//                         </>
//                       )}
                      
//                       {booking.status === 'completed' && (
//                         <>
//                           <button 
//                             className="btn-review"
//                             onClick={() => handleWriteReview(booking.id)}
//                           >
//                             <i className="fas fa-star"></i> Write Review
//                           </button>
//                           <button 
//                             className="btn-view"
//                             onClick={() => handleViewDetails(booking.id)}
//                           >
//                             View Details
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="no-bookings">
//               <i className="fas fa-calendar-times"></i>
//               <h3>No bookings found</h3>
//               <p>
//                 {filter !== 'all' 
//                   ? `You don't have any ${formatStatus(filter)} bookings yet` 
//                   : "You haven't made any bookings yet"}
//               </p>
//               <button className="btn-browse">
//                 <i className="fas fa-search"></i> Browse Equipment
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MyBookings

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingAPI } from '../../../services/api'
import './MyBookings.css'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await bookingAPI.getMyBookings({ status: filter === 'all' ? undefined : filter })
        setBookings(response.data.bookings || [])
      } catch (error) {
        console.error('Error fetching my bookings:', error)
        setError('Failed to load bookings. Please try again.')
        setBookings([
          { id: 1, equipment: 'JCB 3DX', image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', date: '2024-03-15', duration: '4 hours', amount: 4800, status: 'completed', vendor: 'Ramesh Construction' },
          { id: 2, equipment: 'Mahindra Tractor', image: 'https://images.unsplash.com/photo-1597161016902-80a5b1b10b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', date: '2024-03-18', duration: '8 hours', amount: 6400, status: 'confirmed', vendor: 'Singh Agro Services' },
          { id: 3, equipment: 'Hydra Crane', image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', date: '2024-03-20', duration: '2 hours', amount: 5000, status: 'pending', vendor: 'Meerut Crane Services' },
          { id: 4, equipment: 'Ashok Leyland Dumper', image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', date: '2024-03-22', duration: '1 day', amount: 10000, status: 'in_progress', vendor: 'Verma Transport' }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchMyBookings()
  }, [filter])

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed'
      case 'confirmed': return 'status-confirmed'
      case 'pending': return 'status-pending'
      case 'in_progress': return 'status-progress'
      default: return ''
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.cancel(bookingId)
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      } catch (error) {
        console.error('Error cancelling booking:', error)
        alert('Failed to cancel booking. Please try again.')
      }
    }
  }

  const handleViewDetails = (bookingId) => navigate(`/customer/bookings/${bookingId}`)
  const handleWriteReview = (bookingId) => navigate(`/customer/review/${bookingId}`)

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const formatStatus = (status) => status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  if (loading) return (
    <div className="my-bookings-page"><div className="container"><div className="loading-spinner"><i className="fas fa-spinner fa-spin"></i><p>Loading your bookings...</p></div></div></div>
  )

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1 className="page-title">My Bookings</h1>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        <div className="filter-tabs">
          {['all', 'pending', 'confirmed', 'in_progress', 'completed'].map((tab) => (
            <button key={tab} className={`filter-tab ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>
              {formatStatus(tab)}
            </button>
          ))}
        </div>

        <div className="bookings-container">
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-image"><img src={booking.image} alt={booking.equipment} /></div>
                <div className="booking-details">
                  <div className="booking-header">
                    <h3>{booking.equipment}</h3>
                    <span className={`booking-status ${getStatusClass(booking.status)}`}>{formatStatus(booking.status)}</span>
                  </div>
                  <div className="booking-info">
                    <p><i className="fas fa-calendar"></i> {formatDate(booking.date)}</p>
                    <p><i className="fas fa-clock"></i> {booking.duration}</p>
                    <p><i className="fas fa-user"></i> {booking.vendor}</p>
                  </div>
                  <div className="booking-footer">
                    <div className="booking-amount">
                      <span>Total Amount:</span>
                      <strong>₹{booking.amount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="booking-actions">
                      {booking.status === 'pending' && (
                        <>
                          <button className="btn-cancel" onClick={() => handleCancelBooking(booking.id)}><i className="fas fa-times"></i> Cancel</button>
                          <button className="btn-view" onClick={() => handleViewDetails(booking.id)}>View Details</button>
                        </>
                      )}
                      {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                        <button className="btn-view" onClick={() => handleViewDetails(booking.id)}>View Details</button>
                      )}
                      {booking.status === 'completed' && (
                        <>
                          <button className="btn-review" onClick={() => handleWriteReview(booking.id)}><i className="fas fa-star"></i> Write Review</button>
                          <button className="btn-view" onClick={() => handleViewDetails(booking.id)}>View Details</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-bookings">
              <i className="fas fa-calendar-times"></i>
              <h3>No bookings found</h3>
              <p>{filter !== 'all' ? `You don't have any ${formatStatus(filter)} bookings yet` : "You haven't made any bookings yet"}</p>
              <button className="btn-browse" onClick={() => navigate('/equipment')}><i className="fas fa-search"></i> Browse Equipment</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyBookings
