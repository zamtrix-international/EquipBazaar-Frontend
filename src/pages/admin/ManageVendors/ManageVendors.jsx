// import { useState, useEffect } from 'react'
// import { adminAPI } from '../../../services/api'
// import './ManageVendors.css'

// const ManageVendors = () => {
//   const [vendors, setVendors] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filter, setFilter] = useState('all')

//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const params = { page: 1, limit: 50 }
//         if (filter !== 'all') params.status = filter
//         if (searchTerm) params.search = searchTerm

//         const response = await adminAPI.getVendors(params)
//         setVendors(response.data.vendors || [])
//       } catch (error) {
//         console.error('Error fetching vendors:', error)
//         // Fallback to mock data if API fails
//         setVendors([
//           {
//             id: 1,
//             name: 'Ramesh Construction',
//             email: 'ramesh@example.com',
//             phone: '9876543210',
//             businessName: 'Ramesh Construction Co.',
//             equipment: ['JCB', 'Tractor'],
//             totalEquipment: 5,
//             status: 'approved',
//             joinedDate: '2024-01-15',
//             kycStatus: 'verified',
//             totalBookings: 45,
//             rating: 4.5
//           },
//           {
//             id: 2,
//             name: 'Singh Agro Services',
//             email: 'singh@example.com',
//             phone: '9876543211',
//             businessName: 'Singh Agro Services',
//             equipment: ['Tractor', 'Dumper'],
//             totalEquipment: 3,
//             status: 'approved',
//             joinedDate: '2024-01-20',
//             kycStatus: 'verified',
//             totalBookings: 32,
//             rating: 4.8
//           },
//           {
//             id: 3,
//             name: 'Meerut Crane Services',
//             email: 'crane@example.com',
//             phone: '9876543212',
//             businessName: 'Meerut Crane Services',
//             equipment: ['Crane'],
//             totalEquipment: 2,
//             status: 'pending',
//             joinedDate: '2024-02-01',
//             kycStatus: 'pending',
//             totalBookings: 0,
//             rating: 0
//           },
//           {
//             id: 4,
//             name: 'Verma Transport',
//             email: 'verma@example.com',
//             phone: '9876543213',
//             businessName: 'Verma Transport Co.',
//             equipment: ['Dumper', 'Tractor'],
//             totalEquipment: 4,
//             status: 'suspended',
//             joinedDate: '2024-02-10',
//             kycStatus: 'verified',
//             totalBookings: 18,
//             rating: 3.5
//           },
//           {
//             id: 5,
//             name: 'Goyal Construction',
//         email: 'goyal@example.com',
//         phone: '9876543214',
//         businessName: 'Goyal Construction',
//         equipment: ['JCB', 'Crane'],
//         totalEquipment: 3,
//         status: 'pending',
//         joinedDate: '2024-03-01',
//         kycStatus: 'pending',
//         totalBookings: 0,
//         rating: 0
//       }
//         ])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchVendors()
//   }, [searchTerm, filter])

//   if (loading) {
//     return <div className="manage-vendors-page">Loading vendors...</div>
//   }

//   const filteredVendors = vendors.filter(vendor => {
//     const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    
//     const matchesFilter = filter === 'all' || vendor.status === filter
    
//     return matchesSearch && matchesFilter
//   })

//   const updateVendorStatus = (vendorId, newStatus) => {
//     setVendors(vendors.map(vendor => 
//       vendor.id === vendorId 
//         ? {...vendor, status: newStatus}
//         : vendor
//     ))
//   }

//   return (
//     <div className="manage-vendors-page">
//       <div className="container">
//         <h1 className="page-title">Manage Vendors</h1>

//         {/* Filters */}
//         <div className="filters-bar">
//           <div className="search-box">
//             <i className="fas fa-search"></i>
//             <input
//               type="text"
//               placeholder="Search by name, email or business..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="status-filters">
//             <button 
//               className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
//               onClick={() => setFilter('all')}
//             >
//               All
//             </button>
//             <button 
//               className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
//               onClick={() => setFilter('pending')}
//             >
//               Pending
//             </button>
//             <button 
//               className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
//               onClick={() => setFilter('approved')}
//             >
//               Approved
//             </button>
//             <button 
//               className={`filter-btn ${filter === 'suspended' ? 'active' : ''}`}
//               onClick={() => setFilter('suspended')}
//             >
//               Suspended
//             </button>
//           </div>
//         </div>

//         {/* Vendors Table */}
//         <div className="vendors-table-container">
//           <table className="vendors-table">
//             <thead>
//               <tr>
//                 <th>Vendor Details</th>
//                 <th>Business</th>
//                 <th>Equipment</th>
//                 <th>KYC Status</th>
//                 <th>Bookings</th>
//                 <th>Rating</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredVendors.map(vendor => (
//                 <tr key={vendor.id}>
//                   <td>
//                     <div className="vendor-info">
//                       <div className="vendor-avatar">
//                         {vendor.name.charAt(0)}
//                       </div>
//                       <div>
//                         <div className="vendor-name">{vendor.name}</div>
//                         <div className="vendor-email">{vendor.email}</div>
//                         <div className="vendor-phone">{vendor.phone}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="business-info">
//                       <div className="business-name">{vendor.businessName}</div>
//                       <div className="equipment-count">{vendor.totalEquipment} equipment</div>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="equipment-tags">
//                       {vendor.equipment.map((item, index) => (
//                         <span key={index} className="equipment-tag">{item}</span>
//                       ))}
//                     </div>
//                   </td>
//                   <td>
//                     <span className={`kyc-badge ${vendor.kycStatus}`}>
//                       {vendor.kycStatus}
//                     </span>
//                   </td>
//                   <td>{vendor.totalBookings}</td>
//                   <td>
//                     {vendor.rating > 0 ? (
//                       <div className="rating">
//                         <span className="stars">{'★'.repeat(Math.floor(vendor.rating))}</span>
//                         <span className="rating-value">{vendor.rating}</span>
//                       </div>
//                     ) : (
//                       <span className="no-rating">No ratings</span>
//                     )}
//                   </td>
//                   <td>
//                     <span className={`status-badge ${vendor.status}`}>
//                       {vendor.status}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="action-buttons">
//                       {vendor.status === 'pending' && (
//                         <>
//                           <button 
//                             className="btn-approve"
//                             onClick={() => updateVendorStatus(vendor.id, 'approved')}
//                           >
//                             Approve
//                           </button>
//                           <button 
//                             className="btn-reject"
//                             onClick={() => updateVendorStatus(vendor.id, 'suspended')}
//                           >
//                             Reject
//                           </button>
//                         </>
//                       )}
//                       {vendor.status === 'approved' && (
//                         <button 
//                           className="btn-suspend"
//                           onClick={() => updateVendorStatus(vendor.id, 'suspended')}
//                         >
//                           Suspend
//                         </button>
//                       )}
//                       {vendor.status === 'suspended' && (
//                         <button 
//                           className="btn-activate"
//                           onClick={() => updateVendorStatus(vendor.id, 'approved')}
//                         >
//                           Activate
//                         </button>
//                       )}
//                       <button className="btn-view">
//                         <i className="fas fa-eye"></i>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredVendors.length === 0 && (
//             <div className="no-results">
//               <i className="fas fa-truck"></i>
//               <h3>No vendors found</h3>
//               <p>Try adjusting your search or filters</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManageVendors

import { useState, useEffect } from 'react'
import { adminAPI } from '../../../services/api'
import './ManageVendors.css'

const ManageVendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const params = { page: 1, limit: 50 }
        if (filter !== 'all') params.status = filter
        if (searchTerm) params.search = searchTerm
        const response = await adminAPI.getVendors(params)
        setVendors(response.data.vendors || [])
      } catch (error) {
        console.error('Error fetching vendors:', error)
        setVendors([
          { id: 1, name: 'Ramesh Construction', email: 'ramesh@example.com', phone: '9876543210', businessName: 'Ramesh Construction Co.', equipment: ['JCB', 'Tractor'], totalEquipment: 5, status: 'approved', joinedDate: '2024-01-15', kycStatus: 'verified', totalBookings: 45, rating: 4.5 },
          { id: 2, name: 'Singh Agro Services', email: 'singh@example.com', phone: '9876543211', businessName: 'Singh Agro Services', equipment: ['Tractor', 'Dumper'], totalEquipment: 3, status: 'approved', joinedDate: '2024-01-20', kycStatus: 'verified', totalBookings: 32, rating: 4.8 },
          { id: 3, name: 'Meerut Crane Services', email: 'crane@example.com', phone: '9876543212', businessName: 'Meerut Crane Services', equipment: ['Crane'], totalEquipment: 2, status: 'pending', joinedDate: '2024-02-01', kycStatus: 'pending', totalBookings: 0, rating: 0 },
          { id: 4, name: 'Verma Transport', email: 'verma@example.com', phone: '9876543213', businessName: 'Verma Transport Co.', equipment: ['Dumper', 'Tractor'], totalEquipment: 4, status: 'suspended', joinedDate: '2024-02-10', kycStatus: 'verified', totalBookings: 18, rating: 3.5 },
          { id: 5, name: 'Goyal Construction', email: 'goyal@example.com', phone: '9876543214', businessName: 'Goyal Construction', equipment: ['JCB', 'Crane'], totalEquipment: 3, status: 'pending', joinedDate: '2024-03-01', kycStatus: 'pending', totalBookings: 0, rating: 0 }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchVendors()
  }, [searchTerm, filter])

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) || vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || vendor.status === filter
    return matchesSearch && matchesFilter
  })

  const updateVendorStatus = async (vendorId, newStatus) => {
    try {
      await adminAPI.updateVendorStatus(vendorId, newStatus)
      setVendors(vendors.map(vendor => vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor))
    } catch (error) {
      console.error('Error updating vendor status:', error)
      alert('Failed to update vendor status. Please try again.')
    }
  }

  if (loading) return <div className="manage-vendors-page">Loading vendors...</div>

  return (
    <div className="manage-vendors-page">
      <div className="container">
        <h1 className="page-title">Manage Vendors</h1>
        <div className="filters-bar">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search by name, email or business..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="status-filters">
            {['all', 'pending', 'approved', 'suspended'].map(f => (
              <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="vendors-table-container">
          <table className="vendors-table">
            <thead><tr><th>Vendor Details</th><th>Business</th><th>Equipment</th><th>KYC Status</th><th>Bookings</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredVendors.map(vendor => (
                <tr key={vendor.id}>
                  <td>
                    <div className="vendor-info">
                      <div className="vendor-avatar">{vendor.name.charAt(0)}</div>
                      <div><div className="vendor-name">{vendor.name}</div><div className="vendor-email">{vendor.email}</div><div className="vendor-phone">{vendor.phone}</div></div>
                    </div>
                  </td>
                  <td><div className="business-info"><div className="business-name">{vendor.businessName}</div><div className="equipment-count">{vendor.totalEquipment} equipment</div></div></td>
                  <td><div className="equipment-tags">{vendor.equipment.map((item, i) => <span key={i} className="equipment-tag">{item}</span>)}</div></td>
                  <td><span className={`kyc-badge ${vendor.kycStatus}`}>{vendor.kycStatus}</span></td>
                  <td>{vendor.totalBookings}</td>
                  <td>{vendor.rating > 0 ? <div className="rating"><span className="stars">{'★'.repeat(Math.floor(vendor.rating))}</span><span className="rating-value">{vendor.rating}</span></div> : <span className="no-rating">No ratings</span>}</td>
                  <td><span className={`status-badge ${vendor.status}`}>{vendor.status}</span></td>
                  <td>
                    <div className="action-buttons">
                      {vendor.status === 'pending' && (<><button className="btn-approve" onClick={() => updateVendorStatus(vendor.id, 'approved')}>Approve</button><button className="btn-reject" onClick={() => updateVendorStatus(vendor.id, 'suspended')}>Reject</button></>)}
                      {vendor.status === 'approved' && <button className="btn-suspend" onClick={() => updateVendorStatus(vendor.id, 'suspended')}>Suspend</button>}
                      {vendor.status === 'suspended' && <button className="btn-activate" onClick={() => updateVendorStatus(vendor.id, 'approved')}>Activate</button>}
                      <button className="btn-view"><i className="fas fa-eye"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVendors.length === 0 && <div className="no-results"><i className="fas fa-truck"></i><h3>No vendors found</h3><p>Try adjusting your search or filters</p></div>}
        </div>
      </div>
    </div>
  )
}

export default ManageVendors