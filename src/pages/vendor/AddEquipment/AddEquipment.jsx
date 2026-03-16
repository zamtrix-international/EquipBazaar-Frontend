// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import './AddEquipment.css'

// const AddEquipment = () => {
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     name: '',
//     category: 'JCB',
//     hourlyRate: '',
//     dailyRate: '',
//     weeklyRate: '',
//     description: '',
//     location: '',
//     brand: '',
//     model: '',
//     year: '',
//     engine: '',
//     fuelType: 'Diesel'
//   })

//   const [photos, setPhotos] = useState([])
//   const [submitting, setSubmitting] = useState(false)

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handlePhotoUpload = (e) => {
//     const files = Array.from(e.target.files)
//     setPhotos([...photos, ...files])
//   }

//   const removePhoto = (index) => {
//     setPhotos(photos.filter((_, i) => i !== index))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     setSubmitting(true)
    
//     // Simulate API call
//     setTimeout(() => {
//       setSubmitting(false)
//       alert('Equipment added successfully!')
//       navigate('/vendor/my-equipment')
//     }, 2000)
//   }

//   return (
//     <div className="add-equipment-page">
//       <div className="container">
//         <h1 className="page-title">Add New Equipment</h1>

//         <form onSubmit={handleSubmit} className="add-equipment-form">
//           {/* Basic Information */}
//           <div className="form-section">
//             <h2>Basic Information</h2>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Equipment Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   placeholder="e.g., JCB 3DX"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Category *</label>
//                 <select name="category" value={formData.category} onChange={handleChange} required>
//                   <option value="JCB">JCB</option>
//                   <option value="Tractor">Tractor</option>
//                   <option value="Crane">Crane</option>
//                   <option value="Dumper">Dumper</option>
//                 </select>
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Hourly Rate (₹) *</label>
//                 <input
//                   type="number"
//                   name="hourlyRate"
//                   value={formData.hourlyRate}
//                   onChange={handleChange}
//                   required
//                   placeholder="e.g., 1200"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Daily Rate (₹) *</label>
//                 <input
//                   type="number"
//                   name="dailyRate"
//                   value={formData.dailyRate}
//                   onChange={handleChange}
//                   required
//                   placeholder="e.g., 8000"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Weekly Rate (₹)</label>
//                 <input
//                   type="number"
//                   name="weeklyRate"
//                   value={formData.weeklyRate}
//                   onChange={handleChange}
//                   placeholder="e.g., 50000"
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label>Description *</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//                 rows="4"
//                 placeholder="Describe your equipment, its condition, features, etc."
//               ></textarea>
//             </div>

//             <div className="form-group">
//               <label>Location in Meerut *</label>
//               <input
//                 type="text"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g., Meerut Cantt, Modipuram, etc."
//               />
//             </div>
//           </div>

//           {/* Specifications */}
//           <div className="form-section">
//             <h2>Specifications</h2>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Brand</label>
//                 <input
//                   type="text"
//                   name="brand"
//                   value={formData.brand}
//                   onChange={handleChange}
//                   placeholder="e.g., JCB, Mahindra"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Model</label>
//                 <input
//                   type="text"
//                   name="model"
//                   value={formData.model}
//                   onChange={handleChange}
//                   placeholder="e.g., 3DX, 475"
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Year</label>
//                 <input
//                   type="number"
//                   name="year"
//                   value={formData.year}
//                   onChange={handleChange}
//                   placeholder="e.g., 2023"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Engine Power</label>
//                 <input
//                   type="text"
//                   name="engine"
//                   value={formData.engine}
//                   onChange={handleChange}
//                   placeholder="e.g., 68 HP"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Fuel Type</label>
//                 <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
//                   <option value="Diesel">Diesel</option>
//                   <option value="Petrol">Petrol</option>
//                   <option value="Electric">Electric</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Photos */}
//           <div className="form-section">
//             <h2>Equipment Photos</h2>
//             <p className="section-note">Upload up to 5 photos of your equipment</p>

//             <div className="photo-upload-area">
//               <input
//                 type="file"
//                 id="photo-upload"
//                 accept="image/*"
//                 multiple
//                 onChange={handlePhotoUpload}
//                 style={{ display: 'none' }}
//               />
//               <button
//                 type="button"
//                 className="upload-btn"
//                 onClick={() => document.getElementById('photo-upload').click()}
//               >
//                 <i className="fas fa-cloud-upload-alt"></i>
//                 Click to Upload Photos
//               </button>
//             </div>

//             {photos.length > 0 && (
//               <div className="photo-preview-grid">
//                 {photos.map((photo, index) => (
//                   <div key={index} className="photo-preview">
//                     <img src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`} />
//                     <button
//                       type="button"
//                       className="remove-photo"
//                       onClick={() => removePhoto(index)}
//                     >
//                       <i className="fas fa-times"></i>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Submit Buttons */}
//           <div className="form-actions">
//             <button
//               type="button"
//               className="btn-cancel"
//               onClick={() => navigate('/vendor/dashboard')}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn-submit"
//               disabled={submitting}
//             >
//               {submitting ? 'Adding...' : 'Add Equipment'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default AddEquipment

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { equipmentAPI } from '../../../services/api'
import './AddEquipment.css'

const AddEquipment = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', category: 'JCB', hourlyRate: '', dailyRate: '', weeklyRate: '', description: '', location: '', brand: '', model: '', year: '', engine: '', fuelType: 'Diesel' })
  const [photos, setPhotos] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handlePhotoUpload = (e) => setPhotos([...photos, ...Array.from(e.target.files)])
  const removePhoto = (index) => setPhotos(photos.filter((_, i) => i !== index))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => { if (value !== '') data.append(key, value) })
      photos.forEach((photo) => data.append('images', photo))
      await equipmentAPI.create(data)
      alert('Equipment added successfully!')
      navigate('/vendor/my-equipment')
    } catch (error) {
      console.error('Error adding equipment:', error)
      alert(error.response?.data?.message || 'Failed to add equipment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="add-equipment-page">
      <div className="container">
        <h1 className="page-title">Add New Equipment</h1>
        <form onSubmit={handleSubmit} className="add-equipment-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Equipment Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., JCB 3DX" />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="JCB">JCB</option>
                  <option value="Tractor">Tractor</option>
                  <option value="Crane">Crane</option>
                  <option value="Dumper">Dumper</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Hourly Rate (₹) *</label>
                <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} required placeholder="e.g., 1200" />
              </div>
              <div className="form-group">
                <label>Daily Rate (₹) *</label>
                <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleChange} required placeholder="e.g., 8000" />
              </div>
              <div className="form-group">
                <label>Weekly Rate (₹)</label>
                <input type="number" name="weeklyRate" value={formData.weeklyRate} onChange={handleChange} placeholder="e.g., 50000" />
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" placeholder="Describe your equipment, its condition, features, etc."></textarea>
            </div>
            <div className="form-group">
              <label>Location in Meerut *</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g., Meerut Cantt, Modipuram, etc." />
            </div>
          </div>

          <div className="form-section">
            <h2>Specifications</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g., JCB, Mahindra" />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="e.g., 3DX, 475" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Year</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="e.g., 2023" />
              </div>
              <div className="form-group">
                <label>Engine Power</label>
                <input type="text" name="engine" value={formData.engine} onChange={handleChange} placeholder="e.g., 68 HP" />
              </div>
              <div className="form-group">
                <label>Fuel Type</label>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Equipment Photos</h2>
            <p className="section-note">Upload up to 5 photos of your equipment</p>
            <div className="photo-upload-area">
              <input type="file" id="photo-upload" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} />
              <button type="button" className="upload-btn" onClick={() => document.getElementById('photo-upload').click()}>
                <i className="fas fa-cloud-upload-alt"></i> Click to Upload Photos
              </button>
            </div>
            {photos.length > 0 && (
              <div className="photo-preview-grid">
                {photos.map((photo, index) => (
                  <div key={index} className="photo-preview">
                    <img src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`} />
                    <button type="button" className="remove-photo" onClick={() => removePhoto(index)}><i className="fas fa-times"></i></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/vendor/dashboard')}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Equipment'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEquipment