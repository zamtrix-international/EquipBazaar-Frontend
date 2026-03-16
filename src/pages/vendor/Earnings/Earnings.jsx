// import { useState, useEffect } from 'react'
// import { vendorAPI } from '../../../services/api'
// import './Earnings.css'

// const Earnings = () => {
//   const [earnings, setEarnings] = useState({
//     total: 0,
//     thisMonth: 0,
//     pending: 0,
//     withdrawn: 0
//   })

//   const [transactions, setTransactions] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchEarningsData = async () => {
//       try {
//         const [summaryRes, transactionsRes] = await Promise.all([
//           vendorAPI.getEarningsSummary(),
//           vendorAPI.getEarningsTransactions({ limit: 10, sort: 'desc' })
//         ])

//         setEarnings(summaryRes.data)
//         setTransactions(transactionsRes.data.transactions || [])
//       } catch (error) {
//         console.error('Error fetching earnings data:', error)
//         // Fallback to mock data if API fails
//         setEarnings({
//           total: 45000,
//           thisMonth: 12500,
//           pending: 8000,
//           withdrawn: 37000
//         })
//         setTransactions([
//           {
//             id: 1,
//             date: '2024-03-15',
//             equipment: 'JCB 3DX',
//             customer: 'Rajesh Kumar',
//             amount: 4800,
//             status: 'paid'
//           },
//           {
//             id: 2,
//             date: '2024-03-14',
//             equipment: 'Mahindra Tractor',
//             customer: 'Amit Singh',
//             amount: 6400,
//             status: 'paid'
//           },
//           {
//             id: 3,
//             date: '2024-03-13',
//             equipment: 'Hydra Crane',
//             customer: 'Vikas Sharma',
//             amount: 5000,
//             status: 'pending'
//           },
//           {
//             id: 4,
//             date: '2024-03-12',
//             equipment: 'Ashok Leyland Dumper',
//             customer: 'Suresh Kumar',
//             amount: 10000,
//             status: 'paid'
//           },
//           {
//             id: 5,
//         date: '2024-03-11',
//         equipment: 'JCB 3DX',
//         customer: 'Rahul Singh',
//         amount: 3600,
//         status: 'pending'
//       }
//         ])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchEarningsData()
//   }, [])

//   if (loading) {
//     return <div className="earnings-page">Loading earnings...</div>
//   }

//   return (
//     <div className="earnings-page">
//       <div className="container">
//         <h1 className="page-title">Earnings</h1>

//         {/* Stats Cards */}
//         <div className="earnings-stats">
//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-rupee-sign"></i>
//             </div>
//             <div className="stat-details">
//               <span className="stat-label">Total Earnings</span>
//               <span className="stat-value">₹{earnings.total}</span>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-calendar"></i>
//             </div>
//             <div className="stat-details">
//               <span className="stat-label">This Month</span>
//               <span className="stat-value">₹{earnings.thisMonth}</span>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-clock"></i>
//             </div>
//             <div className="stat-details">
//               <span className="stat-label">Pending</span>
//               <span className="stat-value">₹{earnings.pending}</span>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">
//               <i className="fas fa-check-circle"></i>
//             </div>
//             <div className="stat-details">
//               <span className="stat-label">Withdrawn</span>
//               <span className="stat-value">₹{earnings.withdrawn}</span>
//             </div>
//           </div>
//         </div>

//         {/* Withdraw Section */}
//         <div className="withdraw-section">
//           <h2>Withdraw Earnings</h2>
//           <div className="withdraw-card">
//             <div className="balance-info">
//               <span>Available Balance</span>
//               <strong>₹{earnings.total - earnings.withdrawn}</strong>
//             </div>
//             <button className="withdraw-btn">Withdraw Now</button>
//           </div>
//         </div>

//         {/* Transaction History */}
//         <div className="transactions-section">
//           <h2>Transaction History</h2>
          
//           <div className="transactions-table">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Equipment</th>
//                   <th>Customer</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.map(transaction => (
//                   <tr key={transaction.id}>
//                     <td>{transaction.date}</td>
//                     <td>{transaction.equipment}</td>
//                     <td>{transaction.customer}</td>
//                     <td>₹{transaction.amount}</td>
//                     <td>
//                       <span className={`status-badge ${transaction.status}`}>
//                         {transaction.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Earnings

import { useState, useEffect } from 'react'
import { vendorAPI } from '../../../services/api'
import './Earnings.css'

const Earnings = () => {
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0, pending: 0, withdrawn: 0 })
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const [summaryRes, transactionsRes] = await Promise.all([
          vendorAPI.getEarningsSummary(),
          vendorAPI.getEarningsTransactions({ limit: 10, sort: 'desc' })
        ])
        setEarnings(summaryRes.data)
        setTransactions(transactionsRes.data.transactions || [])
      } catch (error) {
        console.error('Error fetching earnings data:', error)
        setEarnings({ total: 45000, thisMonth: 12500, pending: 8000, withdrawn: 37000 })
        setTransactions([
          { id: 1, date: '2024-03-15', equipment: 'JCB 3DX', customer: 'Rajesh Kumar', amount: 4800, status: 'paid' },
          { id: 2, date: '2024-03-14', equipment: 'Mahindra Tractor', customer: 'Amit Singh', amount: 6400, status: 'paid' },
          { id: 3, date: '2024-03-13', equipment: 'Hydra Crane', customer: 'Vikas Sharma', amount: 5000, status: 'pending' },
          { id: 4, date: '2024-03-12', equipment: 'Ashok Leyland Dumper', customer: 'Suresh Kumar', amount: 10000, status: 'paid' },
          { id: 5, date: '2024-03-11', equipment: 'JCB 3DX', customer: 'Rahul Singh', amount: 3600, status: 'pending' }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchEarningsData()
  }, [])

  if (loading) return <div className="earnings-page">Loading earnings...</div>

  return (
    <div className="earnings-page">
      <div className="container">
        <h1 className="page-title">Earnings</h1>
        <div className="earnings-stats">
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-rupee-sign"></i></div><div className="stat-details"><span className="stat-label">Total Earnings</span><span className="stat-value">₹{earnings.total}</span></div></div>
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-calendar"></i></div><div className="stat-details"><span className="stat-label">This Month</span><span className="stat-value">₹{earnings.thisMonth}</span></div></div>
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-clock"></i></div><div className="stat-details"><span className="stat-label">Pending</span><span className="stat-value">₹{earnings.pending}</span></div></div>
          <div className="stat-card"><div className="stat-icon"><i className="fas fa-check-circle"></i></div><div className="stat-details"><span className="stat-label">Withdrawn</span><span className="stat-value">₹{earnings.withdrawn}</span></div></div>
        </div>

        <div className="withdraw-section">
          <h2>Withdraw Earnings</h2>
          <div className="withdraw-card">
            <div className="balance-info"><span>Available Balance</span><strong>₹{earnings.total - earnings.withdrawn}</strong></div>
            <button className="withdraw-btn">Withdraw Now</button>
          </div>
        </div>

        <div className="transactions-section">
          <h2>Transaction History</h2>
          <div className="transactions-table">
            <table>
              <thead><tr><th>Date</th><th>Equipment</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td><td>{t.equipment}</td><td>{t.customer}</td><td>₹{t.amount}</td>
                    <td><span className={`status-badge ${t.status}`}>{t.status}</span></td>
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

export default Earnings