import { useState, useEffect } from 'react'
import { adminAPI } from '../../../services/api'
import './CommissionSettings.css'

const CommissionSettings = () => {
  const [commissionRules, setCommissionRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCommissionRules = async () => {
      try {
        const response = await adminAPI.getCommissionRules()
        setCommissionRules(response.data.rules || [])
      } catch (error) {
        console.error('Error fetching commission rules:', error)
        // Fallback to default rules
        setCommissionRules([
          {
            id: 1,
            equipmentType: 'Tractor',
            commissionPercentage: 8,
            minCommission: 50,
            maxCommission: 500,
            isActive: true
          },
          {
            id: 2,
            equipmentType: 'JCB',
            commissionPercentage: 10,
            minCommission: 100,
            maxCommission: 1000,
            isActive: true
          },
          {
            id: 3,
            equipmentType: 'Crane',
            commissionPercentage: 12,
            minCommission: 200,
            maxCommission: 2000,
            isActive: true
          },
          {
            id: 4,
            equipmentType: 'Dumper',
            commissionPercentage: 10,
            minCommission: 100,
            maxCommission: 1500,
            isActive: true
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCommissionRules()
  }, [])

  const handleRuleChange = (id, field, value) => {
    setCommissionRules(rules =>
      rules.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    )
  }

  const handleSaveRules = async () => {
    setSaving(true)
    setError('')

    try {
      await adminAPI.updateCommissionRules({ rules: commissionRules })
      alert('Commission rules updated successfully!')
    } catch (error) {
      console.error('Error updating commission rules:', error)
      setError('Failed to update commission rules. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const toggleRuleStatus = (id) => {
    setCommissionRules(rules =>
      rules.map(rule =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    )
  }

  if (loading) {
    return <div className="commission-settings-page">Loading commission settings...</div>
  }

  return (
    <div className="commission-settings-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Commission Settings</h1>
          <p className="page-subtitle">Manage commission rates for different equipment types (5%-15% range)</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="commission-rules">
          <div className="rules-header">
            <h2>Commission Rules</h2>
            <button
              onClick={handleSaveRules}
              disabled={saving}
              className="btn-save"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="rules-table">
            <div className="table-header">
              <div>Equipment Type</div>
              <div>Commission %</div>
              <div>Min Commission (₹)</div>
              <div>Max Commission (₹)</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {commissionRules.map(rule => (
              <div key={rule.id} className="table-row">
                <div className="equipment-type">
                  <strong>{rule.equipmentType}</strong>
                </div>

                <div className="commission-input">
                  <input
                    type="number"
                    min="5"
                    max="15"
                    value={rule.commissionPercentage}
                    onChange={(e) => handleRuleChange(rule.id, 'commissionPercentage', parseFloat(e.target.value))}
                  />
                  <span>%</span>
                </div>

                <div className="min-commission">
                  <input
                    type="number"
                    min="0"
                    value={rule.minCommission}
                    onChange={(e) => handleRuleChange(rule.id, 'minCommission', parseInt(e.target.value))}
                  />
                </div>

                <div className="max-commission">
                  <input
                    type="number"
                    min="0"
                    value={rule.maxCommission}
                    onChange={(e) => handleRuleChange(rule.id, 'maxCommission', parseInt(e.target.value))}
                  />
                </div>

                <div className="status">
                  <span className={`status-badge ${rule.isActive ? 'active' : 'inactive'}`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="actions">
                  <button
                    onClick={() => toggleRuleStatus(rule.id)}
                    className={`btn-toggle ${rule.isActive ? 'deactivate' : 'activate'}`}
                  >
                    {rule.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="commission-info">
          <h3>Commission Calculation</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>How Commission Works</h4>
              <ul>
                <li>Commission is calculated on the booking amount</li>
                <li>Minimum commission ensures fair earnings</li>
                <li>Maximum commission caps high-value bookings</li>
                <li>Percentage applies within min-max range</li>
              </ul>
            </div>

            <div className="info-card">
              <h4>Example Calculation</h4>
              <div className="example">
                <p><strong>Booking Amount:</strong> ₹2,000</p>
                <p><strong>Commission Rate:</strong> 10%</p>
                <p><strong>Min Commission:</strong> ₹100</p>
                <p><strong>Max Commission:</strong> ₹1,000</p>
                <p><strong>Commission Earned:</strong> ₹200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommissionSettings