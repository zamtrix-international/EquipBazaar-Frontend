// pages/vendor/AddEquipment/AddEquipment.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipmentAPI } from '../../../services/api';
import './AddEquipment.css';

// Icon Components
const Icons = {
  CloudUpload: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 16.5a5 5 0 0 0-4.8-6.2 8 8 0 1 0-12 6.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12v9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 16l-4-4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Spinner: () => (
    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M6.9 17.1l-2.82 2.82M17.1 6.9l2.82-2.82M4.93 19.07l2.83-2.83"></path>
    </svg>
  ),
  Equipment: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  )
};

const AddEquipment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'JCB',
    hourlyRate: '',
    dailyRate: '',
    weeklyRate: '',
    description: '',
    location: '',
    brand: '',
    model: '',
    year: '',
    engine: '',
    fuelType: 'Diesel'
  });
  
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    // Validate each file
    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} (not an image)`);
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (too large, max 5MB)`);
        return;
      }

      validFiles.push(file);
    });

    // Check total photos limit (max 5)
    if (photos.length + validFiles.length > 5) {
      setPhotoError('You can upload maximum 5 photos');
      return;
    }

    if (invalidFiles.length > 0) {
      setPhotoError(`Invalid files: ${invalidFiles.join(', ')}`);
    } else {
      setPhotoError('');
    }

    setPhotos(prev => [...prev, ...validFiles]);
  };

  // Remove photo
  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoError('');
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Equipment name is required');
      return false;
    }
    if (!formData.hourlyRate || formData.hourlyRate < 0) {
      setError('Valid hourly rate is required');
      return false;
    }
    if (!formData.dailyRate || formData.dailyRate < 0) {
      setError('Valid daily rate is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (photos.length === 0) {
      setError('Please upload at least one photo');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '') {
          formDataToSend.append(key, value);
        }
      });

      // Append photos
      photos.forEach((photo) => {
        formDataToSend.append('images', photo);
      });

      const response = await equipmentAPI.create(formDataToSend);
      
      if (response?.data?.success) {
        alert('Equipment added successfully!');
        navigate('/vendor/my-equipment');
      } else {
        throw new Error(response?.data?.message || 'Failed to add equipment');
      }
    } catch (err) {
      console.error('Error adding equipment:', err);
      setError(err.message || 'Failed to add equipment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-equipment-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Add New Equipment</h1>
          <p className="page-subtitle">List your equipment for rent</p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-equipment-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <div className="section-header">
              <Icons.Equipment />
              <h2>Basic Information</h2>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  Equipment Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., JCB 3DX"
                  className="form-input"
                  maxLength="100"
                />
              </div>

              <div className="form-group">
                <label>
                  Category <span className="required">*</span>
                </label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required
                  className="form-select"
                >
                  <option value="JCB">JCB</option>
                  <option value="Tractor">Tractor</option>
                  <option value="Crane">Crane</option>
                  <option value="Dumper">Dumper</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Hourly Rate (₹) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  required
                  min="0"
                  step="100"
                  placeholder="e.g., 1200"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>
                  Daily Rate (₹) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="dailyRate"
                  value={formData.dailyRate}
                  onChange={handleChange}
                  required
                  min="0"
                  step="100"
                  placeholder="e.g., 8000"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Weekly Rate (₹)</label>
                <input
                  type="number"
                  name="weeklyRate"
                  value={formData.weeklyRate}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  placeholder="e.g., 50000"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Describe your equipment, its condition, features, etc."
                className="form-textarea"
                maxLength="1000"
              ></textarea>
              <span className="char-count">{formData.description.length}/1000</span>
            </div>

            <div className="form-group">
              <label>
                Location in Meerut <span className="required">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Meerut Cantt, Modipuram, etc."
                className="form-input"
              />
            </div>
          </div>

          {/* Specifications Section */}
          <div className="form-section">
            <div className="section-header">
              <h2>Specifications (Optional)</h2>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g., JCB, Mahindra"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., 3DX, 475"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  placeholder="e.g., 2023"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Engine Power</label>
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleChange}
                  placeholder="e.g., 68 HP"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Fuel Type</label>
                <select 
                  name="fuelType" 
                  value={formData.fuelType} 
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
            </div>
          </div>

          {/* Photos Section */}
          <div className="form-section">
            <div className="section-header">
              <h2>Equipment Photos</h2>
            </div>
            <p className="section-note">
              Upload up to 5 photos (Max 5MB each, JPG/PNG only)
            </p>

            {photoError && (
              <div className="photo-error">
                <span>⚠️</span>
                <p>{photoError}</p>
              </div>
            )}

            <div className="photo-upload-area">
              <input
                type="file"
                id="photo-upload"
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="upload-btn"
                onClick={() => document.getElementById('photo-upload').click()}
                disabled={photos.length >= 5}
              >
                <Icons.CloudUpload />
                <span>Click to Upload Photos</span>
                <span className="upload-count">{photos.length}/5 photos</span>
              </button>
            </div>

            {photos.length > 0 && (
              <div className="photo-preview-grid">
                {photos.map((photo, index) => (
                  <div key={index} className="photo-preview">
                    <img 
                      src={URL.createObjectURL(photo)} 
                      alt={`Preview ${index + 1}`} 
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className="remove-photo"
                      onClick={() => removePhoto(index)}
                      title="Remove photo"
                    >
                      <Icons.Close />
                    </button>
                    <span className="photo-size">
                      {(photo.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/vendor/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Icons.Spinner />
                  Adding Equipment...
                </>
              ) : (
                'Add Equipment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipment;