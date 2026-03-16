// import { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { vendorAPI, bookingAPI } from '../../../services/api'
// import './VendorDashboard.css'

// const VendorDashboard = () => {
//   const [stats, setStats] = useState({
//     totalEquipment: 0,
//     activeBookings: 0,
//     totalEarnings: 0,
//     pendingApprovals: 0
//   })

//   const [recentBookings, setRecentBookings] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const [dashboardRes, bookingsRes] = await Promise.all([
//           vendorAPI.getDashboard(),
//           bookingAPI.getMyBookings({ limit: 3, sort: 'recent' })
//         ])

//         setStats(dashboardRes.data.stats)
//         setRecentBookings(bookingsRes.data.bookings || [])
//       } catch (error) {
//         console.error('Error fetching vendor dashboard:', error)
//         // Fallback to mock data if API fails
//         setStats({
//           totalEquipment: 8,
//           activeBookings: 3,
//           totalEarnings: 45000,
//           pendingApprovals: 2
//         })
//         setRecentBookings([
//           {
//             id: 1,
//             equipment: 'JCB 3DX',
//             customer: 'Rajesh Kumar',
//             date: '2024-03-15',
//             status: 'pending',
//             amount: 4800
//           },
//           {
//             id: 2,
//             equipment: 'Mahindra Tractor',
//             customer: 'Amit Singh',
//             date: '2024-03-18',
//             status: 'confirmed',
//             amount: 6400
//           },
//           {
//             id: 3,
//             equipment: 'Hydra Crane',
//             customer: 'Vikas Sharma',
//             date: '2024-03-20',
//             status: 'completed',
//             amount: 5000
//           }
//         ])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   if (loading) {
//     return <div className="vendor-dashboard">Loading dashboard...</div>
//   }

//   return (
//     <div className="vendor-dashboard">
//       <div className="container">
//         <h1 className="dashboard-title">Vendor Dashboard</h1>

//         {/* Stats Cards */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-tools"></i>
//             </div>
//             <div className="stat-details">
//               <h3>{stats.totalEquipment}</h3>
//               <p>Total Equipment</p>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-calendar-check"></i>
//             </div>
//             <div className="stat-details">
//               <h3>{stats.activeBookings}</h3>
//               <p>Active Bookings</p>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-rupee-sign"></i>
//             </div>
//             <div className="stat-details">
//               <h3>₹{stats.totalEarnings}</h3>
//               <p>Total Earnings</p>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-clock"></i>
//             </div>
//             <div className="stat-details">
//               <h3>{stats.pendingApprovals}</h3>
//               <p>Pending Approvals</p>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="quick-actions">
//           <h2>Quick Actions</h2>
//           <div className="actions-grid">
//             <Link to="/vendor/add-equipment" className="action-card">
//               <i className="fas fa-plus-circle"></i>
//               <h3>Add Equipment</h3>
//               <p>List new equipment for rent</p>
//             </Link>

//             <Link to="/vendor/my-equipment" className="action-card">
//               <i className="fas fa-list"></i>
//               <h3>My Equipment</h3>
//               <p>Manage your equipment</p>
//             </Link>

//             <Link to="/vendor/bookings" className="action-card">
//               <i className="fas fa-calendar-alt"></i>
//               <h3>Manage Bookings</h3>
//               <p>Accept or reject bookings</p>
//             </Link>

//             <Link to="/vendor/earnings" className="action-card">
//               <i className="fas fa-chart-line"></i>
//               <h3>Earnings</h3>
//               <p>View your earnings</p>
//             </Link>
//           </div>
//         </div>

//         {/* Recent Bookings */}
//         <div className="recent-bookings">
//           <div className="section-header">
//             <h2>Recent Booking Requests</h2>
//             <Link to="/vendor/bookings" className="view-all">View All</Link>
//           </div>

//           <div className="bookings-table">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Equipment</th>
//                   <th>Customer</th>
//                   <th>Date</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentBookings.map(booking => (
//                   <tr key={booking.id}>
//                     <td>{booking.equipment}</td>
//                     <td>{booking.customer}</td>
//                     <td>{booking.date}</td>
//                     <td>₹{booking.amount}</td>
//                     <td>
//                       <span className={`status-badge ${booking.status}`}>
//                         {booking.status}
//                       </span>
//                     </td>
//                     <td>
//                       {booking.status === 'pending' && (
//                         <div className="action-buttons">
//                           <button className="btn-accept">✓</button>
//                           <button className="btn-reject">✗</button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VendorDashboard

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { vendorAPI, bookingAPI } from '../../../services/api'
import './VendorDashboard.css'

const VendorDashboard = () => {
  const [stats, setStats] = useState({ totalEquipment: 0, activeBookings: 0, totalEarnings: 0, pendingApprovals: 0 })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const handleBookingAction = async (bookingId, action) => {
    try {
      if (action === 'accept') await bookingAPI.accept(bookingId)
      else await bookingAPI.reject(bookingId)
      setRecentBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: action === 'accept' ? 'confirmed' : 'cancelled' } : b))
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Failed to update booking.')
    }
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, bookingsRes] = await Promise.all([
          vendorAPI.getDashboard(),
          bookingAPI.getMyBookings({ limit: 3, sort: 'recent' })
        ])
        setStats(dashboardRes.data.stats)
        setRecentBookings(bookingsRes.data.bookings || [])
      } catch (error) {
        console.error('Error fetching vendor dashboard:', error)
        setStats({ totalEquipment: 8, activeBookings: 3, totalEarnings: 45000, pendingApprovals: 2 })
        setRecentBookings([
          { id: 1, equipment: 'JCB 3DX', customer: 'Rajesh Kumar', date: '2024-03-15', status: 'pending', amount: 4800 },
          { id: 2, equipment: 'Mahindra Tractor', customer: 'Amit Singh', date: '2024-03-18', status: 'confirmed', amount: 6400 },
          { id: 3, equipment: 'Hydra Crane', customer: 'Vikas Sharma', date: '2024-03-20', status: 'completed', amount: 5000 }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) return <div className="vendor-dashboard">Loading dashboard...</div>

  return (
    <div className="vendor-dashboard">
      <div className="container">
        <h1 className="dashboard-title">Vendor Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-tools"></i></div><div className="stat-details"><h3>{stats.totalEquipment}</h3><p>Total Equipment</p></div></div>
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-calendar-check"></i></div><div className="stat-details"><h3>{stats.activeBookings}</h3><p>Active Bookings</p></div></div>
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-rupee-sign"></i></div><div className="stat-details"><h3>₹{stats.totalEarnings}</h3><p>Total Earnings</p></div></div>
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-clock"></i></div><div className="stat-details"><h3>{stats.pendingApprovals}</h3><p>Pending Approvals</p></div></div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/vendor/add-equipment" className="action-card"><i className="fas fa-plus-circle"></i><h3>Add Equipment</h3><p>List new equipment for rent</p></Link>
            <Link to="/vendor/my-equipment" className="action-card"><i className="fas fa-list"></i><h3>My Equipment</h3><p>Manage your equipment</p></Link>
            <Link to="/vendor/bookings" className="action-card"><i className="fas fa-calendar-alt"></i><h3>Manage Bookings</h3><p>Accept or reject bookings</p></Link>
            <Link to="/vendor/earnings" className="action-card"><i className="fas fa-chart-line"></i><h3>Earnings</h3><p>View your earnings</p></Link>
          </div>
        </div>

        <div className="recent-bookings">
          <div className="section-header">
            <h2>Recent Booking Requests</h2>
            <Link to="/vendor/bookings" className="view-all">View All</Link>
          </div>
          <div className="bookings-table">
            <table>
              <thead><tr><th>Equipment</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.equipment}</td>
                    <td>{booking.customer}</td>
                    <td>{booking.date}</td>
                    <td>₹{booking.amount}</td>
                    <td><span className={`status-badge ${booking.status}`}>{booking.status}</span></td>
                    <td>
                      {booking.status === 'pending' && (
                        <div className="action-buttons">
                          <button className="btn-accept" onClick={() => handleBookingAction(booking.id, 'accept')}>✓</button>
                          <button className="btn-reject" onClick={() => handleBookingAction(booking.id, 'reject')}>✗</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboard