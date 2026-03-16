// import { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { adminAPI } from '../../../services/api'
// import './AdminDashboard.css'

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalVendors: 0,
//     totalBookings: 0,
//     totalRevenue: 0,
//     pendingVendors: 0
//   })

//   const [recentVendors, setRecentVendors] = useState([])
//   const [recentBookings, setRecentBookings] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const [dashboardRes, vendorsRes, bookingsRes] = await Promise.all([
//           adminAPI.getDashboard(),
//           adminAPI.getVendors({ limit: 3, sort: 'recent' }),
//           adminAPI.getBookings({ limit: 3, sort: 'recent' })
//         ])

//         setStats(dashboardRes.data.stats)
//         setRecentVendors(vendorsRes.data.vendors || [])
//         setRecentBookings(bookingsRes.data.bookings || [])
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error)
//         // Fallback to mock data if API fails
//         setStats({
//           totalUsers: 1250,
//           totalVendors: 45,
//           totalBookings: 380,
//           totalRevenue: 1250000,
//           pendingVendors: 8
//         })
//         setRecentVendors([
//           {
//             id: 1,
//             name: 'Ramesh Construction',
//             email: 'ramesh@example.com',
//             equipment: 'JCB, Tractor',
//             status: 'pending',
//             joinedDate: '2024-03-15'
//           },
//           {
//             id: 2,
//             name: 'Singh Agro Services',
//             email: 'singh@example.com',
//             equipment: 'Tractor, Dumper',
//             status: 'approved',
//             joinedDate: '2024-03-14'
//           },
//           {
//             id: 3,
//             name: 'Meerut Crane Services',
//             email: 'crane@example.com',
//             equipment: 'Crane',
//             status: 'pending',
//             joinedDate: '2024-03-13'
//           }
//         ])
//         setRecentBookings([
//           {
//             id: 1,
//             equipment: 'JCB 3DX',
//             customer: 'Rajesh Kumar',
//             vendor: 'Ramesh Construction',
//             amount: 2400,
//             status: 'completed',
//             date: '2024-03-15'
//           },
//           {
//             id: 2,
//             equipment: 'Tractor',
//             customer: 'Amit Singh',
//             vendor: 'Singh Agro',
//             amount: 1600,
//             status: 'confirmed',
//             date: '2024-03-14'
//           },
//           {
//             id: 3,
//             equipment: 'Crane',
//             customer: 'Vijay Verma',
//             vendor: 'Meerut Crane',
//             amount: 5000,
//             status: 'pending',
//             date: '2024-03-13'
//           }
//         ])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchDashboardData()
//   }, [])

//   if (loading) {
//     return <div className="admin-dashboard">Loading dashboard...</div>
//   }

//   return (
//     <div className="admin-dashboard">
//       <div className="container">
//         <h1 className="dashboard-title">Admin Dashboard</h1>

//         {/* Stats Cards */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-users"></i>
//             </div>
//             <div className="stat-details">
//               <span className="stat-label">Total Users</span>
//               <span className="stat-value">{stats.totalUsers}</span>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-truck"></i>
//             </div>
//             <div className="stat-details">
//               <span className="stat-label">Total Vendors</span>
//               <span className="stat-value">{stats.totalVendors}</span>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-calendar-check"></i>
//             </div>
//             <div className="stat-details">
//               <span className="stat-label">Total Bookings</span>
//               <span className="stat-value">{stats.totalBookings}</span>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-rupee-sign"></i>
//             </div>
//             <div className="stat-details">
//               <span className="stat-label">Total Revenue</span>
//               <span className="stat-value">₹{stats.totalRevenue}</span>
//             </div>
//           </div>

//           <div className="stat-card warning">
//             <div className="stat-icon">
//               <i className="fas fa-clock"></i>
//             </div>
//             <div className="stat-details">
//               <span className="stat-label">Pending Vendors</span>
//               <span className="stat-value">{stats.pendingVendors}</span>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="quick-actions">
//           <h2>Quick Actions</h2>
//           <div className="actions-grid">
//             <Link to="/admin/vendors" className="action-card">
//               <i className="fas fa-user-check"></i>
//               <h3>Verify Vendors</h3>
//               <p>{stats.pendingVendors} pending approvals</p>
//             </Link>

//             <Link to="/admin/users" className="action-card">
//               <i className="fas fa-users-cog"></i>
//               <h3>Manage Users</h3>
//               <p>View all customers</p>
//             </Link>

//             <Link to="/admin/commission" className="action-card">
//               <i className="fas fa-percent"></i>
//               <h3>Set Commission</h3>
//               <p>Update commission rates</p>
//             </Link>

//             <Link to="/admin/reports" className="action-card">
//               <i className="fas fa-chart-bar"></i>
//               <h3>View Reports</h3>
//               <p>Analytics & insights</p>
//             </Link>
//           </div>
//         </div>

//         {/* Recent Vendors */}
//         <div className="recent-section">
//           <div className="section-header">
//             <h2>Pending Vendor Approvals</h2>
//             <Link to="/admin/vendors" className="view-all">View All</Link>
//           </div>

//           <div className="table-responsive">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Vendor Name</th>
//                   <th>Email</th>
//                   <th>Equipment</th>
//                   <th>Joined</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentVendors.map(vendor => (
//                   <tr key={vendor.id}>
//                     <td>{vendor.name}</td>
//                     <td>{vendor.email}</td>
//                     <td>{vendor.equipment}</td>
//                     <td>{vendor.joinedDate}</td>
//                     <td>
//                       <span className={`status-badge ${vendor.status}`}>
//                         {vendor.status}
//                       </span>
//                     </td>
//                     <td>
//                       {vendor.status === 'pending' && (
//                         <div className="action-buttons">
//                           <button className="btn-approve">✓ Approve</button>
//                           <button className="btn-reject">✗ Reject</button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recent Bookings */}
//         <div className="recent-section">
//           <div className="section-header">
//             <h2>Recent Bookings</h2>
//             <Link to="/admin/bookings" className="view-all">View All</Link>
//           </div>

//           <div className="table-responsive">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Equipment</th>
//                   <th>Customer</th>
//                   <th>Vendor</th>
//                   <th>Amount</th>
//                   <th>Date</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentBookings.map(booking => (
//                   <tr key={booking.id}>
//                     <td>{booking.equipment}</td>
//                     <td>{booking.customer}</td>
//                     <td>{booking.vendor}</td>
//                     <td>₹{booking.amount}</td>
//                     <td>{booking.date}</td>
//                     <td>
//                       <span className={`status-badge ${booking.status}`}>
//                         {booking.status}
//                       </span>
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

// export default AdminDashboard

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../../services/api'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalVendors: 0, totalBookings: 0, totalRevenue: 0, pendingVendors: 0 })
  const [recentVendors, setRecentVendors] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const handleVendorAction = async (vendorId, newStatus) => {
    try {
      await adminAPI.updateVendorStatus(vendorId, newStatus)
      setRecentVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: newStatus } : v))
    } catch (error) {
      console.error('Error updating vendor:', error)
      alert('Failed to update vendor status.')
    }
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, vendorsRes, bookingsRes] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getVendors({ limit: 3, sort: 'recent' }),
          adminAPI.getBookings({ limit: 3, sort: 'recent' })
        ])
        setStats(dashboardRes.data.stats)
        setRecentVendors(vendorsRes.data.vendors || [])
        setRecentBookings(bookingsRes.data.bookings || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setStats({ totalUsers: 1250, totalVendors: 45, totalBookings: 380, totalRevenue: 1250000, pendingVendors: 8 })
        setRecentVendors([
          { id: 1, name: 'Ramesh Construction', email: 'ramesh@example.com', equipment: 'JCB, Tractor', status: 'pending', joinedDate: '2024-03-15' },
          { id: 2, name: 'Singh Agro Services', email: 'singh@example.com', equipment: 'Tractor, Dumper', status: 'approved', joinedDate: '2024-03-14' },
          { id: 3, name: 'Meerut Crane Services', email: 'crane@example.com', equipment: 'Crane', status: 'pending', joinedDate: '2024-03-13' }
        ])
        setRecentBookings([
          { id: 1, equipment: 'JCB 3DX', customer: 'Rajesh Kumar', vendor: 'Ramesh Construction', amount: 2400, status: 'completed', date: '2024-03-15' },
          { id: 2, equipment: 'Tractor', customer: 'Amit Singh', vendor: 'Singh Agro', amount: 1600, status: 'confirmed', date: '2024-03-14' },
          { id: 3, equipment: 'Crane', customer: 'Vijay Verma', vendor: 'Meerut Crane', amount: 5000, status: 'pending', date: '2024-03-13' }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) return <div className="admin-dashboard">Loading dashboard...</div>

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-users"></i></div><div className="stat-details"><span className="stat-label">Total Users</span><span className="stat-value">{stats.totalUsers}</span></div></div>
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-truck"></i></div><div className="stat-details"><span className="stat-label">Total Vendors</span><span className="stat-value">{stats.totalVendors}</span></div></div>
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-calendar-check"></i></div><div className="stat-details"><span className="stat-label">Total Bookings</span><span className="stat-value">{stats.totalBookings}</span></div></div>
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-rupee-sign"></i></div><div className="stat-details"><span className="stat-label">Total Revenue</span><span className="stat-value">₹{stats.totalRevenue}</span></div></div>
          <div className="stat-card warning"><div className="stat-icon"><i className="fas fa-clock"></i></div><div className="stat-details"><span className="stat-label">Pending Vendors</span><span className="stat-value">{stats.pendingVendors}</span></div></div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/vendors" className="action-card"><i className="fas fa-user-check"></i><h3>Verify Vendors</h3><p>{stats.pendingVendors} pending approvals</p></Link>
            <Link to="/admin/users" className="action-card"><i className="fas fa-users-cog"></i><h3>Manage Users</h3><p>View all customers</p></Link>
            <Link to="/admin/commission" className="action-card"><i className="fas fa-percent"></i><h3>Set Commission</h3><p>Update commission rates</p></Link>
            <Link to="/admin/reports" className="action-card"><i className="fas fa-chart-bar"></i><h3>View Reports</h3><p>Analytics & insights</p></Link>
          </div>
        </div>

        <div className="recent-section">
          <div className="section-header"><h2>Pending Vendor Approvals</h2><Link to="/admin/vendors" className="view-all">View All</Link></div>
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Vendor Name</th><th>Email</th><th>Equipment</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {recentVendors.map(vendor => (
                  <tr key={vendor.id}>
                    <td>{vendor.name}</td><td>{vendor.email}</td><td>{vendor.equipment}</td><td>{vendor.joinedDate}</td>
                    <td><span className={`status-badge ${vendor.status}`}>{vendor.status}</span></td>
                    <td>
                      {vendor.status === 'pending' && (
                        <div className="action-buttons">
                          <button className="btn-approve" onClick={() => handleVendorAction(vendor.id, 'approved')}>✓ Approve</button>
                          <button className="btn-reject" onClick={() => handleVendorAction(vendor.id, 'suspended')}>✗ Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="recent-section">
          <div className="section-header"><h2>Recent Bookings</h2><Link to="/admin/bookings" className="view-all">View All</Link></div>
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Equipment</th><th>Customer</th><th>Vendor</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.equipment}</td><td>{booking.customer}</td><td>{booking.vendor}</td>
                    <td>₹{booking.amount}</td><td>{booking.date}</td>
                    <td><span className={`status-badge ${booking.status}`}>{booking.status}</span></td>
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

export default AdminDashboard