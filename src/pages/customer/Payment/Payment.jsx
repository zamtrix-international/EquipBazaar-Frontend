// import { useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { bookingAPI } from '../../../services/api'
// import './Payment.css'

// const Payment = () => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const { equipment, duration, date, hours, total } = location.state || {}
//   const [paymentMethod, setPaymentMethod] = useState('online')
//   const [processing, setProcessing] = useState(false)

//   const handlePayment = async () => {
//     if (paymentMethod === 'cash') {
//       // Handle cash on delivery
//       setProcessing(true)
//       try {
//         const bookingData = {
//           equipmentId: equipment.id,
//           startDate: date,
//           duration: duration,
//           hours: hours,
//           totalAmount: total,
//           paymentMethod: paymentMethod
//         }

//         const response = await bookingAPI.create(bookingData)
//         alert('Booking confirmed! Pay when equipment arrives.')
//         navigate('/customer/bookings')
//       } catch (error) {
//         console.error('Booking failed:', error)
//         alert('Booking failed. Please try again.')
//       } finally {
//         setProcessing(false)
//       }
//     } else {
//       // Handle online payment with Razorpay
//       setProcessing(true)
//       try {
//         // Create order on backend
//         const orderResponse = await bookingAPI.createOrder({
//           equipmentId: equipment.id,
//           amount: total,
//           currency: 'INR'
//         })

//         const options = {
//           key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual key
//           amount: orderResponse.data.amount,
//           currency: orderResponse.data.currency,
//           name: 'EquipNest',
//           description: `Booking for ${equipment.name}`,
//           order_id: orderResponse.data.id,
//           handler: async function (response) {
//             // Verify payment on backend
//             try {
//               const verifyResponse = await bookingAPI.verifyPayment({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 equipmentId: equipment.id,
//                 startDate: date,
//                 duration: duration,
//                 hours: hours,
//                 totalAmount: total
//               })

//               alert('Payment successful! Booking confirmed.')
//               navigate('/customer/bookings')
//             } catch (error) {
//               console.error('Payment verification failed:', error)
//               alert('Payment verification failed. Please contact support.')
//             }
//           },
//           prefill: {
//             name: 'Customer Name',
//             email: 'customer@example.com',
//             contact: '9999999999'
//           },
//           theme: {
//             color: '#007bff'
//           }
//         }

//         const rzp = new window.Razorpay(options)
//         rzp.open()
//       } catch (error) {
//         console.error('Payment initialization failed:', error)
//         alert('Payment initialization failed. Please try again.')
//       } finally {
//         setProcessing(false)
//       }
//     }
//   }

//   if (!equipment) {
//     return <div>No booking data found</div>
//   }

//   return (
//     <div className="payment-page">
//       <div className="container">
//         <h1 className="page-title">Complete Your Booking</h1>

//         <div className="payment-grid">
//           {/* Booking Summary */}
//           <div className="summary-card">
//             <h2>Booking Summary</h2>
            
//             <div className="summary-item">
//               <span className="label">Equipment</span>
//               <span className="value">{equipment.name}</span>
//             </div>

//             <div className="summary-item">
//               <span className="label">Duration</span>
//               <span className="value">
//                 {duration === 'hourly' ? `${hours} hours` : 
//                  duration === 'daily' ? '1 day' : '1 week'}
//               </span>
//             </div>

//             <div className="summary-item">
//               <span className="label">Date</span>
//               <span className="value">{date || '2024-03-25'}</span>
//             </div>

//             <div className="summary-item">
//               <span className="label">Vendor</span>
//               <span className="value">{equipment.vendor.name}</span>
//             </div>

//             <div className="summary-total">
//               <span className="label">Total Amount</span>
//               <span className="total-price">₹{total}</span>
//             </div>
//           </div>

//           {/* Payment Methods */}
//           <div className="payment-card">
//             <h2>Select Payment Method</h2>

//             <div className="payment-methods">
//               <label className="payment-method">
//                 <input
//                   type="radio"
//                   name="payment"
//                   value="online"
//                   checked={paymentMethod === 'online'}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                 />
//                 <div className="method-details">
//                   <i className="fas fa-credit-card"></i>
//                   <div>
//                     <h3>Online Payment</h3>
//                     <p>Pay via UPI, Card, or NetBanking</p>
//                   </div>
//                 </div>
//               </label>

//               <label className="payment-method">
//                 <input
//                   type="radio"
//                   name="payment"
//                   value="cash"
//                   checked={paymentMethod === 'cash'}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                 />
//                 <div className="method-details">
//                   <i className="fas fa-money-bill"></i>
//                   <div>
//                     <h3>Cash on Delivery</h3>
//                     <p>Pay when equipment arrives</p>
//                   </div>
//                 </div>
//               </label>
//             </div>

//             {paymentMethod === 'online' && (
//               <div className="online-payment-form">
//                 <h3>Card Details</h3>
                
//                 <div className="form-group">
//                   <label>Card Number</label>
//                   <input 
//                     type="text" 
//                     placeholder="1234 5678 9012 3456"
//                     maxLength="19"
//                   />
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Expiry Date</label>
//                     <input type="text" placeholder="MM/YY" />
//                   </div>
//                   <div className="form-group">
//                     <label>CVV</label>
//                     <input type="password" placeholder="***" maxLength="3" />
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label>Name on Card</label>
//                   <input type="text" placeholder="John Doe" />
//                 </div>
//               </div>
//             )}

//             <button 
//               className="pay-now-btn"
//               onClick={handlePayment}
//               disabled={processing}
//             >
//               {processing ? 'Processing...' : `Pay ₹${total}`}
//             </button>

//             <p className="secure-text">
//               <i className="fas fa-lock"></i>
//               Your payment information is secure and encrypted
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Payment

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { bookingAPI } from '../../../services/api'
import './Payment.css'

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { equipment, duration, date, hours, total } = location.state || {}
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [processing, setProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvv: '', nameOnCard: '' })

  const handleCardChange = (e) => setCardDetails({ ...cardDetails, [e.target.name]: e.target.value })

  const handlePayment = async () => {
    if (paymentMethod === 'online') {
      if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.nameOnCard) {
        alert('Please fill in all card details.')
        return
      }
    }
    setProcessing(true)
    try {
      await bookingAPI.create({ equipmentId: equipment.id, startDate: date, duration, hours, totalAmount: total, paymentMethod })
      alert('Booking confirmed!')
      navigate('/customer/bookings')
    } catch (error) {
      console.error('Payment failed:', error)
      alert(error.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (!equipment) return <div>No booking data found. Please go back and select equipment.</div>

  return (
    <div className="payment-page">
      <div className="container">
        <h1 className="page-title">Complete Your Booking</h1>
        <div className="payment-grid">
          <div className="summary-card">
            <h2>Booking Summary</h2>
            <div className="summary-item"><span className="label">Equipment</span><span className="value">{equipment.name}</span></div>
            <div className="summary-item"><span className="label">Duration</span><span className="value">{duration === 'hourly' ? `${hours} hours` : duration === 'daily' ? '1 day' : '1 week'}</span></div>
            <div className="summary-item"><span className="label">Date</span><span className="value">{date}</span></div>
            <div className="summary-item"><span className="label">Vendor</span><span className="value">{equipment.vendor.name}</span></div>
            <div className="summary-total"><span className="label">Total Amount</span><span className="total-price">₹{total}</span></div>
          </div>

          <div className="payment-card">
            <h2>Select Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-method">
                <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="method-details"><i className="fas fa-credit-card"></i><div><h3>Online Payment</h3><p>Pay via UPI, Card, or NetBanking</p></div></div>
              </label>
              <label className="payment-method">
                <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="method-details"><i className="fas fa-money-bill"></i><div><h3>Cash on Delivery</h3><p>Pay when equipment arrives</p></div></div>
              </label>
            </div>

            {paymentMethod === 'online' && (
              <div className="online-payment-form">
                <h3>Card Details</h3>
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" maxLength="19" value={cardDetails.cardNumber} onChange={handleCardChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" name="expiry" placeholder="MM/YY" maxLength="5" value={cardDetails.expiry} onChange={handleCardChange} />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="password" name="cvv" placeholder="***" maxLength="3" value={cardDetails.cvv} onChange={handleCardChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input type="text" name="nameOnCard" placeholder="John Doe" value={cardDetails.nameOnCard} onChange={handleCardChange} />
                </div>
              </div>
            )}

            <button className="pay-now-btn" onClick={handlePayment} disabled={processing}>
              {processing ? 'Processing...' : `Pay ₹${total}`}
            </button>
            <p className="secure-text"><i className="fas fa-lock"></i> Your payment information is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment