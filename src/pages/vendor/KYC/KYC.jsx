// pages/vendor/KYC/KYC.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorAPI } from '../../../services/api';
import './KYC.css';

// Icon Components
const Icons = {
  CheckCircle: () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  Clock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  TimesCircle: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  ),
  Spinner: () => (
    <svg className="spinner" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M6.9 17.1l-2.82 2.82M17.1 6.9l2.82-2.82M4.93 19.07l2.83-2.83"></path>
    </svg>
  )
};

const KYC = () => {
  const navigate = useNavigate();
  const [kycData, setKycData] = useState({
    aadharNumber: '',
    panNumber: '',
    businessLicense: '',
    addressProof: '',
    bankAccount: '',
    ifscCode: '',
    accountHolderName: ''
  });

  const [documents, setDocuments] = useState({
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    businessLicense: null,
    addressProof: null,
    bankPassbook: null
  });

  const [documentNames, setDocumentNames] = useState({
    aadharFront: '',
    aadharBack: '',
    panCard: '',
    businessLicense: '',
    addressProof: '',
    bankPassbook: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [existingKyc, setExistingKyc] = useState(null);

  // Fetch KYC status
  const fetchKycStatus = useCallback(async () => {
    setFetchLoading(true);
    setError('');

    try {
      const response = await vendorAPI.getKycStatus();
      
      if (response?.data?.success) {
        setExistingKyc(response.data.data || null);
      } else if (response?.data) {
        setExistingKyc(response.data);
      } else {
        setExistingKyc(null);
      }
    } catch (err) {
      console.error('Error fetching KYC status:', err);
      setError(err.message || 'Failed to fetch KYC status');
      setExistingKyc(null);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKycStatus();
  }, [fetchKycStatus]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKycData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const file = files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`${name} file size should be less than 5MB`);
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError(`${name} should be JPG, PNG or PDF`);
        return;
      }

      setDocuments(prev => ({
        ...prev,
        [name]: file
      }));

      setDocumentNames(prev => ({
        ...prev,
        [name]: file.name
      }));

      setError('');
    }
  };

  // Validate form
  const validateForm = () => {
    // Validate Aadhar
    if (!kycData.aadharNumber || kycData.aadharNumber.length !== 12) {
      setError('Please enter a valid 12-digit Aadhar number');
      return false;
    }

    // Validate PAN
    if (!kycData.panNumber || kycData.panNumber.length !== 10) {
      setError('Please enter a valid 10-digit PAN number');
      return false;
    }

    // Validate bank details
    if (!kycData.accountHolderName.trim()) {
      setError('Please enter account holder name');
      return false;
    }

    if (!kycData.bankAccount.trim()) {
      setError('Please enter bank account number');
      return false;
    }

    if (!kycData.ifscCode.trim()) {
      setError('Please enter IFSC code');
      return false;
    }

    // Validate required documents
    const requiredDocs = ['aadharFront', 'aadharBack', 'panCard', 'addressProof', 'bankPassbook'];
    for (const doc of requiredDocs) {
      if (!documents[doc]) {
        setError(`Please upload ${doc.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();

      // Add text data
      Object.entries(kycData).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      // Add files
      Object.entries(documents).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const response = await vendorAPI.submitKyc(formData);

      if (response?.data?.success) {
        alert('KYC documents submitted successfully!');
        navigate('/vendor/dashboard');
      } else {
        throw new Error(response?.data?.message || 'KYC submission failed');
      }
    } catch (err) {
      console.error('KYC submission error:', err);
      setError(err.message || 'Failed to submit KYC. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (fetchLoading) {
    return (
      <div className="kyc-page">
        <div className="container">
          <div className="loading-state">
            <Icons.Spinner />
            <p>Loading KYC status...</p>
          </div>
        </div>
      </div>
    );
  }

  // Verified KYC state
  if (existingKyc?.status === 'verified') {
    return (
      <div className="kyc-page">
        <div className="container">
          <div className="kyc-verified">
            <Icons.CheckCircle />
            <h2>KYC Verified</h2>
            <p>Your KYC documents have been verified. You can now start adding equipment.</p>
            <button 
              onClick={() => navigate('/vendor/add-equipment')} 
              className="btn-primary"
            >
              Add Equipment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kyc-page">
      <div className="container">
        <h1 className="page-title">KYC Verification</h1>
        <p className="page-subtitle">Please submit your documents for verification to start renting equipment</p>

        {/* Pending KYC Status */}
        {existingKyc?.status === 'pending' && (
          <div className="kyc-status pending">
            <Icons.Clock />
            <span>Your KYC is under review. We'll notify you once verified.</span>
          </div>
        )}

        {/* Rejected KYC Status */}
        {existingKyc?.status === 'rejected' && (
          <div className="kyc-status rejected">
            <Icons.TimesCircle />
            <span>
              Your KYC was rejected. 
              {existingKyc.rejectionReason && ` Reason: ${existingKyc.rejectionReason}`}
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* KYC Form - Show only if not pending/verified */}
        {(!existingKyc || existingKyc.status === 'rejected') && (
          <form onSubmit={handleSubmit} className="kyc-form">
            {/* Personal Information */}
            <div className="form-section">
              <h2>Personal Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Aadhar Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadharNumber"
                    value={kycData.aadharNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength="12"
                    pattern="[0-9]{12}"
                    title="Please enter 12-digit Aadhar number"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    PAN Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={kycData.panNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter PAN number"
                    maxLength="10"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="form-section">
              <h2>Document Uploads</h2>
              <p className="section-note">Upload clear images or PDFs (Max 5MB each)</p>

              <div className="document-grid">
                <div className="document-item">
                  <label>
                    Aadhar Front <span className="required">*</span>
                  </label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="aadharFront"
                      name="aadharFront"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required={!documents.aadharFront}
                      className="file-input"
                    />
                    <label htmlFor="aadharFront" className="file-label">
                      <Icons.Upload />
                      <span>Choose file</span>
                    </label>
                  </div>
                  {documentNames.aadharFront && (
                    <span className="file-name">{documentNames.aadharFront}</span>
                  )}
                </div>

                <div className="document-item">
                  <label>
                    Aadhar Back <span className="required">*</span>
                  </label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="aadharBack"
                      name="aadharBack"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required={!documents.aadharBack}
                      className="file-input"
                    />
                    <label htmlFor="aadharBack" className="file-label">
                      <Icons.Upload />
                      <span>Choose file</span>
                    </label>
                  </div>
                  {documentNames.aadharBack && (
                    <span className="file-name">{documentNames.aadharBack}</span>
                  )}
                </div>

                <div className="document-item">
                  <label>
                    PAN Card <span className="required">*</span>
                  </label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="panCard"
                      name="panCard"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required={!documents.panCard}
                      className="file-input"
                    />
                    <label htmlFor="panCard" className="file-label">
                      <Icons.Upload />
                      <span>Choose file</span>
                    </label>
                  </div>
                  {documentNames.panCard && (
                    <span className="file-name">{documentNames.panCard}</span>
                  )}
                </div>

                <div className="document-item">
                  <label>Business License (Optional)</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="businessLicense"
                      name="businessLicense"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="file-input"
                    />
                    <label htmlFor="businessLicense" className="file-label">
                      <Icons.Upload />
                      <span>Choose file</span>
                    </label>
                  </div>
                  {documentNames.businessLicense && (
                    <span className="file-name">{documentNames.businessLicense}</span>
                  )}
                </div>

                <div className="document-item">
                  <label>
                    Address Proof <span className="required">*</span>
                  </label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="addressProof"
                      name="addressProof"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required={!documents.addressProof}
                      className="file-input"
                    />
                    <label htmlFor="addressProof" className="file-label">
                      <Icons.Upload />
                      <span>Choose file</span>
                    </label>
                  </div>
                  {documentNames.addressProof && (
                    <span className="file-name">{documentNames.addressProof}</span>
                  )}
                </div>

                <div className="document-item">
                  <label>
                    Bank Passbook/Statement <span className="required">*</span>
                  </label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="bankPassbook"
                      name="bankPassbook"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      required={!documents.bankPassbook}
                      className="file-input"
                    />
                    <label htmlFor="bankPassbook" className="file-label">
                      <Icons.Upload />
                      <span>Choose file</span>
                    </label>
                  </div>
                  {documentNames.bankPassbook && (
                    <span className="file-name">{documentNames.bankPassbook}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="form-section">
              <h2>Bank Account Details</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Account Holder Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={kycData.accountHolderName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter account holder name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Bank Account Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={kycData.bankAccount}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter bank account number"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    IFSC Code <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={kycData.ifscCode}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter IFSC code"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/vendor/dashboard')} 
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit KYC'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default KYC;