// import { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { equipmentAPI } from '../../../services/api'
// import Reviews from '../../../components/Reviews/Reviews'
// import EquipmentCalendar from '../../../components/EquipmentCalendar/EquipmentCalendar'
// import './EquipmentDetail.css'

// const EquipmentDetail = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [equipment, setEquipment] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [selectedDuration, setSelectedDuration] = useState('hourly')
//   const [bookingDate, setBookingDate] = useState(null)
//   const [bookingHours, setBookingHours] = useState(1)

//   useEffect(() => {
//     const fetchEquipmentDetail = async () => {
//       try {
//         const response = await equipmentAPI.getById(id)
//         setEquipment(response.data)
//       } catch (error) {
//         console.error('Error fetching equipment detail:', error)
//         // Fallback to mock data if API fails
//         setEquipment({
//           id: 1,
//           name: 'JCB 3DX',
//           category: 'JCB',
//           hourlyRate: 1200,
//           dailyRate: 8000,
//           weeklyRate: 50000,
//           rating: 4.5,
//           reviews: 24,
//           description: 'Powerful JCB 3DX backhoe loader perfect for excavation, digging, and construction work. Well-maintained and operated by experienced drivers.',
//            images: [
//             'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
//              'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
//             'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
//            ],
//           specifications: {
//             brand: 'JCB',
//             model: '3DX',
//             year: 2023,
//             engine: '68 HP',
//             operatingWeight: '7500 kg',
//             fuelType: 'Diesel'
//           },
//           vendor: {
//             name: 'Ramesh Construction',
//             rating: 4.8,
//             totalEquipment: 5,
//             memberSince: '2022',
//             phone: '+91 98765 43210',
//             location: 'Meerut Cantt'
//           },
//           available: true
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (id) {
//       fetchEquipmentDetail()
//     }
//   }, [id])

//   const calculateTotal = () => {
//     if (!equipment) return 0
//     if (selectedDuration === 'hourly') return equipment.hourlyRate * bookingHours
//     if (selectedDuration === 'daily') return equipment.dailyRate
//     if (selectedDuration === 'weekly') return equipment.weeklyRate
//     return 0
//   }

//   const handleDateSelect = (date) => {
//     setBookingDate(date)
//   }

//   const handleBooking = () => {
//     if (!bookingDate) {
//       alert('Please select a booking date')
//       return
//     }

//     navigate(`/customer/payment/${id}`, {
//       state: {
//         equipment,
//         duration: selectedDuration,
//         date: bookingDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
//         hours: bookingHours,
//         total: calculateTotal()
//       }
//     })
//   }

//   if (loading) {
//     return <div className="loader">Loading...</div>
//   }

//   if (!equipment) {
//     return <div>Equipment not found</div>
//   }

//   return (
//     <div className="equipment-detail-page">
//       <div className="container">
//         <button className="back-btn" onClick={() => navigate(-1)}>
//           <i className="fas fa-arrow-left"></i> Back
//         </button>

//         <div className="detail-grid">
//           {/* Left Column - Images */}
//           <div className="detail-left">
//             <div className="main-image">
//               <img src={equipment.images[0]} alt={equipment.name} />
//               {!equipment.available && (
//                 <span className="badge unavailable">Not Available</span>
//               )}
//             </div>
//             <div className="image-gallery">
//               {equipment.images.map((img, index) => (
//                 <img key={index} src={img} alt={`${equipment.name} ${index + 1}`} />
//               ))}
//             </div>

//             <div className="info-section">
//               <h2>Description</h2>
//               <p>{equipment.description}</p>
//             </div>

//             <div className="info-section">
//               <h2>Specifications</h2>
//               <table className="specs-table">
//                 <tbody>
//                   {Object.entries(equipment.specifications).map(([key, value]) => (
//                     <tr key={key}>
//                       <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
//                       <td>{value}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Right Column - Booking */}
//           <div className="detail-right">
//             <div className="booking-card">
//               <h1>{equipment.name}</h1>
              
//               <div className="rating">
//                 {[...Array(5)].map((_, i) => (
//                   <span key={i} className={i < equipment.rating ? 'star filled' : 'star'}>★</span>
//                 ))}
//                 <span className="review-count">({equipment.reviews} reviews)</span>
//               </div>

//               <div className="pricing-tabs">
//                 <button 
//                   className={`tab ${selectedDuration === 'hourly' ? 'active' : ''}`}
//                   onClick={() => setSelectedDuration('hourly')}
//                 >
//                   Hourly
//                 </button>
//                 <button 
//                   className={`tab ${selectedDuration === 'daily' ? 'active' : ''}`}
//                   onClick={() => setSelectedDuration('daily')}
//                 >
//                   Daily
//                 </button>
//                 <button 
//                   className={`tab ${selectedDuration === 'weekly' ? 'active' : ''}`}
//                   onClick={() => setSelectedDuration('weekly')}
//                 >
//                   Weekly
//                 </button>
//               </div>

//               <div className="price-display">
//                 <span className="price">₹{calculateTotal()}</span>
//                 <span className="duration">/{selectedDuration}</span>
//               </div>

//               <div className="booking-form">
//                 <div className="form-group">
//                   <label>Select Date</label>
//                   <EquipmentCalendar
//                     equipmentId={id}
//                     onDateSelect={handleDateSelect}
//                   />
//                   {bookingDate && (
//                     <p className="selected-date">
//                       Selected: {bookingDate.toLocaleDateString('en-IN', {
//                         weekday: 'long',
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric'
//                       })}
//                     </p>
//                   )}
//                 </div>

//                 {selectedDuration === 'hourly' && (
//                   <div className="form-group">
//                     <label>Number of Hours</label>
//                     <input
//                       type="number"
//                       min="1"
//                       max="8"
//                       value={bookingHours}
//                       onChange={(e) => setBookingHours(parseInt(e.target.value))}
//                     />
//                   </div>
//                 )}

//                 <button 
//                   className="book-now-btn"
//                   onClick={handleBooking}
//                   disabled={!equipment.available || !bookingDate}
//                 >
//                   {!bookingDate ? 'Select Date to Book' : equipment.available ? 'Proceed to Book' : 'Not Available'}
//                 </button>
//               </div>

//               <div className="vendor-info">
//                 <h3>Vendor Information</h3>
//                 <div className="vendor-details">
//                   <p><i className="fas fa-user"></i> {equipment.vendor.name}</p>
//                   <p><i className="fas fa-star"></i> {equipment.vendor.rating} Rating</p>
//                   <p><i className="fas fa-map-marker-alt"></i> {equipment.vendor.location}</p>
//                   <p><i className="fas fa-calendar"></i> Member since {equipment.vendor.memberSince}</p>
//                   <p><i className="fas fa-phone"></i> {equipment.vendor.phone}</p>
//                 </div>
//                 <button className="contact-btn">Contact Vendor</button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Reviews Section */}
//         <Reviews equipmentId={id} />
//       </div>
//     </div>
//   )
// }

// export default EquipmentDetail

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { equipmentAPI } from '../../../services/api'
import './EquipmentDetail.css'

const EquipmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [equipment, setEquipment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDuration, setSelectedDuration] = useState('hourly')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingHours, setBookingHours] = useState(1)

  useEffect(() => {
    const fetchEquipmentDetail = async () => {
      try {
        const response = await equipmentAPI.getById(id)
        setEquipment(response.data)
      } catch (error) {
        console.error('Error fetching equipment detail:', error)
        setEquipment({
          id: 1,
          name: 'JCB 3DX',
          category: 'JCB',
          hourlyRate: 1200,
          dailyRate: 8000,
          weeklyRate: 50000,
          rating: 4.5,
          reviews: 24,
          description: 'Powerful JCB 3DX backhoe loader perfect for excavation, digging, and construction work.',
          images: [
            'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          ],
          specifications: { brand: 'JCB', model: '3DX', year: 2023, engine: '68 HP', operatingWeight: '7500 kg', fuelType: 'Diesel' },
          vendor: { name: 'Ramesh Construction', rating: 4.8, totalEquipment: 5, memberSince: '2022', phone: '+91 98765 43210', location: 'Meerut Cantt' },
          available: true
        })
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchEquipmentDetail()
  }, [id])

  const calculateTotal = () => {
    if (!equipment) return 0
    if (selectedDuration === 'hourly') return equipment.hourlyRate * bookingHours
    if (selectedDuration === 'daily') return equipment.dailyRate
    if (selectedDuration === 'weekly') return equipment.weeklyRate
    return 0
  }

  const handleBooking = () => {
    navigate(`/customer/payment/${id}`, {
      state: { equipment, duration: selectedDuration, date: bookingDate, hours: bookingHours, total: calculateTotal() }
    })
  }

  if (loading) return <div className="loader">Loading...</div>
  if (!equipment) return <div>Equipment not found</div>

  return (
    <div className="equipment-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div className="detail-grid">
          <div className="detail-left">
            <div className="main-image">
              <img src={equipment.images[0]} alt={equipment.name} />
              {!equipment.available && <span className="badge unavailable">Not Available</span>}
            </div>
            <div className="image-gallery">
              {equipment.images.map((img, index) => (
                <img key={index} src={img} alt={`${equipment.name} ${index + 1}`} />
              ))}
            </div>
            <div className="info-section">
              <h2>Description</h2>
              <p>{equipment.description}</p>
            </div>
            <div className="info-section">
              <h2>Specifications</h2>
              <table className="specs-table">
                <tbody>
                  {Object.entries(equipment.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="detail-right">
            <div className="booking-card">
              <h1>{equipment.name}</h1>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < equipment.rating ? 'star filled' : 'star'}>★</span>
                ))}
                <span className="review-count">({equipment.reviews} reviews)</span>
              </div>

              <div className="pricing-tabs">
                <button className={`tab ${selectedDuration === 'hourly' ? 'active' : ''}`} onClick={() => setSelectedDuration('hourly')}>Hourly</button>
                <button className={`tab ${selectedDuration === 'daily' ? 'active' : ''}`} onClick={() => setSelectedDuration('daily')}>Daily</button>
                <button className={`tab ${selectedDuration === 'weekly' ? 'active' : ''}`} onClick={() => setSelectedDuration('weekly')}>Weekly</button>
              </div>

              <div className="price-display">
                <span className="price">₹{calculateTotal()}</span>
                <span className="duration">/{selectedDuration}</span>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label>Select Date</label>
                  <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>
                {selectedDuration === 'hourly' && (
                  <div className="form-group">
                    <label>Number of Hours</label>
                    <input type="number" min="1" max="24" value={bookingHours} onChange={(e) => setBookingHours(parseInt(e.target.value))} />
                  </div>
                )}
                <button className="book-now-btn" onClick={handleBooking} disabled={!equipment.available}>
                  {equipment.available ? 'Proceed to Book' : 'Not Available'}
                </button>
              </div>

              <div className="vendor-info">
                <h3>Vendor Information</h3>
                <div className="vendor-details">
                  <p><i className="fas fa-user"></i> {equipment.vendor.name}</p>
                  <p><i className="fas fa-star"></i> {equipment.vendor.rating} Rating</p>
                  <p><i className="fas fa-map-marker-alt"></i> {equipment.vendor.location}</p>
                  <p><i className="fas fa-calendar"></i> Member since {equipment.vendor.memberSince}</p>
                  <p><i className="fas fa-phone"></i> {equipment.vendor.phone}</p>
                </div>
                <button className="contact-btn">Contact Vendor</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EquipmentDetail