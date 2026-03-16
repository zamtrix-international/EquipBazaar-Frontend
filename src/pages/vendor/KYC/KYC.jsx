import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { vendorAPI } from '../../../services/api'
import './KYC.css'

const KYC = () => {
  const navigate = useNavigate()
  const [kycData, setKycData] = useState({
    aadharNumber: '',
    panNumber: '',
    businessLicense: '',
    addressProof: '',
    bankAccount: '',
    ifscCode: '',
    accountHolderName: ''
  })

  const [documents, setDocuments] = useState({
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    businessLicense: null,
    addressProof: null,
    bankPassbook: null
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [existingKyc, setExistingKyc] = useState(null)

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const response = await vendorAPI.getKycStatus()
        setExistingKyc(response.data)
      } catch (error) {
        console.error('Error fetching KYC status:', error)
      }
    }

    fetchKycStatus()
  }, [])

  const handleInputChange = (e) => {
    setKycData({
      ...kycData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files[0]) {
      setDocuments({
        ...documents,
        [name]: files[0]
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()

      // Add text data
      Object.keys(kycData).forEach(key => {
        formData.append(key, kycData[key])
      })

      // Add files
      Object.keys(documents).forEach(key => {
        if (documents[key]) {
          formData.append(key, documents[key])
        }
      })

      const response = await vendorAPI.submitKyc(formData)
      alert('KYC documents submitted successfully!')
      navigate('/vendor/dashboard')
    } catch (error) {
      console.error('KYC submission error:', error)
      setError('Failed to submit KYC. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (existingKyc && existingKyc.status === 'verified') {
    return (
      <div className="kyc-page">
        <div className="container">
          <div className="kyc-verified">
            <i className="fas fa-check-circle"></i>
            <h2>KYC Verified</h2>
            <p>Your KYC documents have been verified. You can now start adding equipment.</p>
            <button onClick={() => navigate('/vendor/add-equipment')} className="btn-primary">
              Add Equipment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="kyc-page">
      <div className="container">
        <h1 className="page-title">KYC Verification</h1>
        <p className="page-subtitle">Please submit your documents for verification to start renting equipment</p>

        {existingKyc && existingKyc.status === 'pending' && (
          <div className="kyc-status pending">
            <i className="fas fa-clock"></i>
            <span>Your KYC is under review. We'll notify you once verified.</span>
          </div>
        )}

        {existingKyc && existingKyc.status === 'rejected' && (
          <div className="kyc-status rejected">
            <i className="fas fa-times-circle"></i>
            <span>Your KYC was rejected. Reason: {existingKyc.rejectionReason}</span>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="kyc-form">
          {/* Personal Information */}
          <div className="form-section">
            <h2>Personal Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Aadhar Number *</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={kycData.aadharNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter 12-digit Aadhar number"
                  maxLength="12"
                />
              </div>

              <div className="form-group">
                <label>PAN Number *</label>
                <input
                  type="text"
                  name="panNumber"
                  value={kycData.panNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter PAN number"
                  maxLength="10"
                />
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="form-section">
            <h2>Document Uploads</h2>

            <div className="document-grid">
              <div className="document-item">
                <label>Aadhar Front *</label>
                <input
                  type="file"
                  name="aadharFront"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  required
                />
                {documents.aadharFront && <span className="file-name">{documents.aadharFront.name}</span>}
              </div>

              <div className="document-item">
                <label>Aadhar Back *</label>
                <input
                  type="file"
                  name="aadharBack"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  required
                />
                {documents.aadharBack && <span className="file-name">{documents.aadharBack.name}</span>}
              </div>

              <div className="document-item">
                <label>PAN Card *</label>
                <input
                  type="file"
                  name="panCard"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  required
                />
                {documents.panCard && <span className="file-name">{documents.panCard.name}</span>}
              </div>

              <div className="document-item">
                <label>Business License</label>
                <input
                  type="file"
                  name="businessLicense"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
                {documents.businessLicense && <span className="file-name">{documents.businessLicense.name}</span>}
              </div>

              <div className="document-item">
                <label>Address Proof *</label>
                <input
                  type="file"
                  name="addressProof"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  required
                />
                {documents.addressProof && <span className="file-name">{documents.addressProof.name}</span>}
              </div>

              <div className="document-item">
                <label>Bank Passbook/Statement *</label>
                <input
                  type="file"
                  name="bankPassbook"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  required
                />
                {documents.bankPassbook && <span className="file-name">{documents.bankPassbook.name}</span>}
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="form-section">
            <h2>Bank Account Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Account Holder Name *</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={kycData.accountHolderName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter account holder name"
                />
              </div>

              <div className="form-group">
                <label>Bank Account Number *</label>
                <input
                  type="text"
                  name="bankAccount"
                  value={kycData.bankAccount}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter bank account number"
                />
              </div>

              <div className="form-group">
                <label>IFSC Code *</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={kycData.ifscCode}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/vendor/dashboard')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Submitting...' : 'Submit KYC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default KYC