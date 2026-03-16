import { useState, useEffect } from 'react'
import { adminAPI } from '../../../services/api'
import './Reports.css'

const Reports = () => {
  const [reportType, setReportType] = useState('bookings')
  const [dateRange, setDateRange] = useState('month')
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await adminAPI.getReports(reportType, { dateRange })
        setReportData(response.data)
      } catch (error) {
        console.error('Error fetching report data:', error)
        // Fallback to mock data if API fails
        setReportData({
          bookingData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [65, 78, 90, 85, 110, 95]
          },
          revenueData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [125000, 150000, 180000, 165000, 220000, 195000]
          },
          equipmentData: [
            { name: 'JCB', bookings: 145, revenue: 174000 },
            { name: 'Tractor', bookings: 210, revenue: 168000 },
            { name: 'Crane', bookings: 85, revenue: 212500 },
            { name: 'Dumper', bookings: 112, revenue: 168000 }
          ],
          topVendors: [
            { name: 'Ramesh Construction', bookings: 45, revenue: 54000, rating: 4.5 },
            { name: 'Singh Agro Services', bookings: 38, revenue: 30400, rating: 4.8 },
            { name: 'Meerut Crane Services', bookings: 32, revenue: 80000, rating: 4.3 },
            { name: 'Verma Transport', bookings: 28, revenue: 42000, rating: 4.2 }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReportData()
  }, [reportType, dateRange])

  if (loading) {
    return <div className="reports-page">Loading reports...</div>
  }

  const { bookingData, revenueData, equipmentData, topVendors } = reportData || {}

  return (
    <div className="reports-page">
      <div className="container">
        <h1 className="page-title">Reports & Analytics</h1>

        {/* Report Controls */}
        <div className="report-controls">
          <div className="control-group">
            <label>Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="bookings">Bookings Report</option>
              <option value="revenue">Revenue Report</option>
              <option value="equipment">Equipment Report</option>
              <option value="vendors">Vendor Report</option>
            </select>
          </div>

          <div className="control-group">
            <label>Date Range</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 3 months</option>
              <option value="year">Last 12 months</option>
            </select>
          </div>

          <button className="export-btn">
            <i className="fas fa-download"></i> Export Report
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="summary-details">
              <span className="summary-label">Total Bookings</span>
              <span className="summary-value">523</span>
              <span className="summary-change positive">+12.5%</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="summary-details">
              <span className="summary-label">Total Revenue</span>
              <span className="summary-value">₹7,22,500</span>
              <span className="summary-change positive">+8.3%</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="summary-details">
              <span className="summary-label">Active Vendors</span>
              <span className="summary-value">42</span>
              <span className="summary-change positive">+5</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="summary-details">
              <span className="summary-label">Avg. Rating</span>
              <span className="summary-value">4.5</span>
              <span className="summary-change positive">+0.3</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>{reportType === 'bookings' ? 'Monthly Bookings' : 'Monthly Revenue'}</h3>
            <div className="chart-container">
              {/* Simple bar chart representation */}
              <div className="bar-chart">
                {(reportType === 'bookings' ? bookingData : revenueData).labels.map((label, index) => (
                  <div key={label} className="chart-bar">
                    <div className="bar-label">{label}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{
                          width: `${(reportType === 'bookings' 
                            ? bookingData.values[index] / 120 * 100 
                            : revenueData.values[index] / 250000 * 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="bar-value">
                      {reportType === 'bookings' 
                        ? bookingData.values[index] 
                        : `₹${revenueData.values[index]}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Equipment Performance</h3>
            <div className="equipment-stats">
              {equipmentData.map(item => (
                <div key={item.name} className="equipment-stat">
                  <div className="stat-header">
                    <span className="equipment-name">{item.name}</span>
                    <span className="equipment-bookings">{item.bookings} bookings</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${item.bookings / 250 * 100}%` }}
                    ></div>
                  </div>
                  <div className="stat-footer">
                    <span>Revenue: ₹{item.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Vendors Table */}
        <div className="top-vendors-section">
          <h3>Top Performing Vendors</h3>
          <div className="table-responsive">
            <table className="vendors-table">
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>Total Bookings</th>
                  <th>Total Revenue</th>
                  <th>Rating</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {topVendors.map((vendor, index) => (
                  <tr key={index}>
                    <td>{vendor.name}</td>
                    <td>{vendor.bookings}</td>
                    <td>₹{vendor.revenue}</td>
                    <td>
                      <div className="rating">
                        <span className="stars">{'★'.repeat(Math.floor(vendor.rating))}</span>
                        <span>{vendor.rating}</span>
                      </div>
                    </td>
                    <td>
                      <div className="performance-bar">
                        <div 
                          className="performance-fill"
                          style={{ width: `${vendor.bookings / 50 * 100}%` }}
                        ></div>
                      </div>
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

export default Reports