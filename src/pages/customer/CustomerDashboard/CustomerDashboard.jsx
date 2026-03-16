import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { customerAPI, bookingAPI } from '../../../services/api'
import './CustomerDashboard.css'

const CustomerDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalSpent: 0
  })

  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, bookingsRes] = await Promise.all([
          customerAPI.getDashboard(),
          bookingAPI.getMyBookings({ limit: 3, sort: 'recent' })
        ])

        setStats(dashboardRes.data.stats)
        setRecentBookings(bookingsRes.data.bookings || [])
      } catch (error) {
        console.error('Error fetching customer dashboard:', error)
        // Fallback to mock data if API fails
        setStats({
          totalBookings: 12,
          activeBookings: 2,
          completedBookings: 10,
          totalSpent: 45000
        })
        setRecentBookings([
          {
            id: 1,
            equipment: 'JCB 3DX',
            date: '2024-03-15',
            status: 'completed',
            amount: 3600
          },
          {
            id: 2,
            equipment: 'Mahindra Tractor',
            date: '2024-03-18',
            status: 'confirmed',
            amount: 2400
          },
          {
            id: 3,
            equipment: 'Hydra Crane',
            date: '2024-03-20',
            status: 'pending',
            amount: 7500
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="customer-dashboard">Loading dashboard...</div>
  }

  return (
    <div className="customer-dashboard">
      <div className="container">
        <h1 className="dashboard-title">Customer Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-details">
              <h3>{stats.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-spinner"></i>
            </div>
            <div className="stat-details">
              <h3>{stats.activeBookings}</h3>
              <p>Active Bookings</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-details">
              <h3>{stats.completedBookings}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="stat-details">
              <h3>₹{stats.totalSpent}</h3>
              <p>Total Spent</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/equipment" className="action-card">
              <i className="fas fa-search"></i>
              <h3>Browse Equipment</h3>
              <p>Find equipment for your project</p>
            </Link>

            <Link to="/customer/bookings" className="action-card">
              <i className="fas fa-list"></i>
              <h3>My Bookings</h3>
              <p>View all your bookings</p>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="recent-bookings">
          <h2>Recent Bookings</h2>
          <div className="bookings-list">
            {recentBookings.map(booking => (
              <div key={booking.id} className="booking-item">
                <div className="booking-info">
                  <h3>{booking.equipment}</h3>
                  <p>Date: {booking.date}</p>
                </div>
                <div className="booking-status">
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                  <span className="booking-amount">₹{booking.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard