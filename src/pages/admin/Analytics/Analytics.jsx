import { useState, useEffect } from 'react'
import './Analytics.css'

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Mock analytics data - replace with actual API call
      const mockData = {
        overview: {
          totalBookings: 1247,
          totalRevenue: 2847500,
          activeEquipment: 89,
          totalUsers: 456
        },
        bookingsTrend: [
          { date: '2024-01-01', bookings: 45 },
          { date: '2024-01-02', bookings: 52 },
          { date: '2024-01-03', bookings: 38 },
          { date: '2024-01-04', bookings: 67 },
          { date: '2024-01-05', bookings: 43 },
          { date: '2024-01-06', bookings: 71 },
          { date: '2024-01-07', bookings: 58 }
        ],
        revenueByCategory: [
          { category: 'JCB', revenue: 1250000, percentage: 44 },
          { category: 'Crane', revenue: 680000, percentage: 24 },
          { category: 'Truck', revenue: 520000, percentage: 18 },
          { category: 'Excavator', revenue: 397500, percentage: 14 }
        ],
        topEquipment: [
          { name: 'JCB 3DX', bookings: 156, revenue: 187200 },
          { name: 'Tata Crane 25T', bookings: 98, revenue: 147000 },
          { name: 'Ashok Leyland Truck', bookings: 87, revenue: 104400 },
          { name: 'Komatsu Excavator', bookings: 76, revenue: 114000 }
        ],
        userGrowth: [
          { month: 'Jan', users: 120 },
          { month: 'Feb', users: 145 },
          { month: 'Mar', users: 178 },
          { month: 'Apr', users: 203 },
          { month: 'May', users: 245 },
          { month: 'Jun', users: 289 }
        ]
      }
      setAnalyticsData(mockData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return <div className="analytics-loading">Loading analytics...</div>
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <div className="time-range-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards">
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="metric-content">
            <h3>{analyticsData.overview.totalBookings.toLocaleString()}</h3>
            <p>Total Bookings</p>
            <span className="metric-change positive">+12.5%</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-rupee-sign"></i>
          </div>
          <div className="metric-content">
            <h3>{formatCurrency(analyticsData.overview.totalRevenue)}</h3>
            <p>Total Revenue</p>
            <span className="metric-change positive">+18.2%</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-cogs"></i>
          </div>
          <div className="metric-content">
            <h3>{analyticsData.overview.activeEquipment}</h3>
            <p>Active Equipment</p>
            <span className="metric-change neutral">+2</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="metric-content">
            <h3>{analyticsData.overview.totalUsers}</h3>
            <p>Total Users</p>
            <span className="metric-change positive">+8.7%</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Bookings Trend Chart */}
        <div className="chart-card">
          <h2>Bookings Trend</h2>
          <div className="chart-container">
            <div className="simple-bar-chart">
              {analyticsData.bookingsTrend.map((item, index) => (
                <div key={index} className="bar-item">
                  <div
                    className="bar"
                    style={{
                      height: `${(item.bookings / Math.max(...analyticsData.bookingsTrend.map(d => d.bookings))) * 100}%`
                    }}
                  >
                    <span className="bar-value">{item.bookings}</span>
                  </div>
                  <span className="bar-label">
                    {new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="chart-card">
          <h2>Revenue by Category</h2>
          <div className="chart-container">
            <div className="pie-chart">
              {analyticsData.revenueByCategory.map((item, index) => (
                <div key={index} className="pie-segment" style={{
                  '--percentage': item.percentage,
                  '--color': `hsl(${index * 90}, 70%, 50%)`
                }}>
                  <div className="pie-label">
                    <span className="category-name">{item.category}</span>
                    <span className="category-value">{formatCurrency(item.revenue)}</span>
                    <span className="category-percentage">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Equipment */}
        <div className="chart-card">
          <h2>Top Performing Equipment</h2>
          <div className="table-container">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topEquipment.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.bookings}</td>
                    <td>{formatCurrency(item.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Growth */}
        <div className="chart-card">
          <h2>User Growth</h2>
          <div className="chart-container">
            <div className="line-chart">
              {analyticsData.userGrowth.map((item, index) => (
                <div key={index} className="line-point" style={{
                  left: `${(index / (analyticsData.userGrowth.length - 1)) * 100}%`,
                  bottom: `${(item.users / Math.max(...analyticsData.userGrowth.map(d => d.users))) * 100}%`
                }}>
                  <span className="point-value">{item.users}</span>
                </div>
              ))}
              <svg className="line-path" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={analyticsData.userGrowth.map((item, index) =>
                    `${(index / (analyticsData.userGrowth.length - 1)) * 100},${100 - (item.users / Math.max(...analyticsData.userGrowth.map(d => d.users))) * 100}`
                  ).join(' ')}
                />
              </svg>
            </div>
            <div className="chart-labels">
              {analyticsData.userGrowth.map((item, index) => (
                <span key={index} className="chart-label">{item.month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics