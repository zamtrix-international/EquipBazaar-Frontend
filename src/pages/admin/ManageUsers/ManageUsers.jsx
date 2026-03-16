// import { useState, useEffect } from 'react'
// import { adminAPI } from '../../../services/api'
// import './ManageUsers.css'

// const ManageUsers = () => {
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filter, setFilter] = useState('all')

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const params = { page: 1, limit: 50 }
//         if (filter !== 'all') params.role = filter
//         if (searchTerm) params.search = searchTerm

//         const response = await adminAPI.getUsers(params)
//         setUsers(response.data.users || [])
//       } catch (error) {
//         console.error('Error fetching users:', error)
//         // Fallback to mock data if API fails
//         setUsers([
//           {
//             id: 1,
//             name: 'Rajesh Kumar',
//             email: 'rajesh@example.com',
//             phone: '9876543210',
//             role: 'customer',
//             status: 'active',
//             joinedDate: '2024-01-15',
//             totalBookings: 12
//           },
//           {
//             id: 2,
//             name: 'Amit Singh',
//             email: 'amit@example.com',
//             phone: '9876543211',
//             role: 'customer',
//             status: 'active',
//             joinedDate: '2024-01-20',
//             totalBookings: 8
//           },
//           {
//             id: 3,
//             name: 'Vikas Sharma',
//             email: 'vikas@example.com',
//             phone: '9876543212',
//             role: 'vendor',
//             status: 'active',
//             joinedDate: '2024-02-01',
//             totalBookings: 0
//           },
//           {
//             id: 4,
//             name: 'Suresh Yadav',
//             email: 'suresh@example.com',
//             phone: '9876543213',
//             role: 'customer',
//             status: 'blocked',
//             joinedDate: '2024-02-10',
//             totalBookings: 3
//           },
//           {
//             id: 5,
//             name: 'Ramesh Gupta',
//             email: 'ramesh@example.com',
//             phone: '9876543214',
//             role: 'vendor',
//             status: 'pending',
//             joinedDate: '2024-03-01',
//             totalBookings: 0
//           }
//         ])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUsers()
//   }, [searchTerm, filter])

//   if (loading) {
//     return <div className="manage-users-page">Loading users...</div>
//   }

//   const filteredUsers = users.filter(user => {
//     // Search filter
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          user.phone.includes(searchTerm)
    
//     // Role filter
//     const matchesFilter = filter === 'all' || user.role === filter
    
//     return matchesSearch && matchesFilter
//   })

//   const toggleUserStatus = (userId) => {
//     setUsers(users.map(user => 
//       user.id === userId 
//         ? {...user, status: user.status === 'active' ? 'blocked' : 'active'}
//         : user
//     ))
//   }

//   return (
//     <div className="manage-users-page">
//       <div className="container">
//         <h1 className="page-title">Manage Users</h1>

//         {/* Filters */}
//         <div className="filters-bar">
//           <div className="search-box">
//             <i className="fas fa-search"></i>
//             <input
//               type="text"
//               placeholder="Search by name, email or phone..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="role-filters">
//             <button 
//               className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
//               onClick={() => setFilter('all')}
//             >
//               All Users
//             </button>
//             <button 
//               className={`filter-btn ${filter === 'customer' ? 'active' : ''}`}
//               onClick={() => setFilter('customer')}
//             >
//               Customers
//             </button>
//             <button 
//               className={`filter-btn ${filter === 'vendor' ? 'active' : ''}`}
//               onClick={() => setFilter('vendor')}
//             >
//               Vendors
//             </button>
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="users-table-container">
//           <table className="users-table">
//             <thead>
//               <tr>
//                 <th>User</th>
//                 <th>Contact</th>
//                 <th>Role</th>
//                 <th>Joined Date</th>
//                 <th>Bookings</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map(user => (
//                 <tr key={user.id}>
//                   <td>
//                     <div className="user-info">
//                       <div className="user-avatar">
//                         {user.name.charAt(0)}
//                       </div>
//                       <div>
//                         <div className="user-name">{user.name}</div>
//                         <div className="user-email">{user.email}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td>{user.phone}</td>
//                   <td>
//                     <span className={`role-badge ${user.role}`}>
//                       {user.role}
//                     </span>
//                   </td>
//                   <td>{user.joinedDate}</td>
//                   <td>{user.totalBookings}</td>
//                   <td>
//                     <span className={`status-badge ${user.status}`}>
//                       {user.status}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="action-buttons">
//                       <button 
//                         className={`btn-status ${user.status}`}
//                         onClick={() => toggleUserStatus(user.id)}
//                       >
//                         {user.status === 'active' ? 'Block' : 'Unblock'}
//                       </button>
//                       <button className="btn-view">
//                         <i className="fas fa-eye"></i>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredUsers.length === 0 && (
//             <div className="no-results">
//               <i className="fas fa-users"></i>
//               <h3>No users found</h3>
//               <p>Try adjusting your search or filters</p>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="pagination">
//           <button className="page-btn">Previous</button>
//           <button className="page-btn active">1</button>
//           <button className="page-btn">2</button>
//           <button className="page-btn">3</button>
//           <button className="page-btn">Next</button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ManageUsers

import { useState, useEffect } from 'react'
import { adminAPI } from '../../../services/api'
import './ManageUsers.css'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = { page: 1, limit: 50 }
        if (filter !== 'all') params.role = filter
        if (searchTerm) params.search = searchTerm
        const response = await adminAPI.getUsers(params)
        setUsers(response.data.users || [])
      } catch (error) {
        console.error('Error fetching users:', error)
        setUsers([
          { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', role: 'customer', status: 'active', joinedDate: '2024-01-15', totalBookings: 12 },
          { id: 2, name: 'Amit Singh', email: 'amit@example.com', phone: '9876543211', role: 'customer', status: 'active', joinedDate: '2024-01-20', totalBookings: 8 },
          { id: 3, name: 'Vikas Sharma', email: 'vikas@example.com', phone: '9876543212', role: 'vendor', status: 'active', joinedDate: '2024-02-01', totalBookings: 0 },
          { id: 4, name: 'Suresh Yadav', email: 'suresh@example.com', phone: '9876543213', role: 'customer', status: 'blocked', joinedDate: '2024-02-10', totalBookings: 3 },
          { id: 5, name: 'Ramesh Gupta', email: 'ramesh@example.com', phone: '9876543214', role: 'vendor', status: 'pending', joinedDate: '2024-03-01', totalBookings: 0 }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [searchTerm, filter])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.phone.includes(searchTerm)
    const matchesFilter = filter === 'all' || user.role === filter
    return matchesSearch && matchesFilter
  })

  const toggleUserStatus = async (userId) => {
    const user = users.find(u => u.id === userId)
    const newStatus = user?.status === 'active' ? 'blocked' : 'active'
    try {
      await adminAPI.updateUserStatus(userId, newStatus)
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u))
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Failed to update user status. Please try again.')
    }
  }

  if (loading) return <div className="manage-users-page">Loading users...</div>

  return (
    <div className="manage-users-page">
      <div className="container">
        <h1 className="page-title">Manage Users</h1>
        <div className="filters-bar">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search by name, email or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="role-filters">
            {[['all', 'All Users'], ['customer', 'Customers'], ['vendor', 'Vendors']].map(([val, label]) => (
              <button key={val} className={`filter-btn ${filter === val ? 'active' : ''}`} onClick={() => setFilter(val)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead><tr><th>User</th><th>Contact</th><th>Role</th><th>Joined Date</th><th>Bookings</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">{user.name.charAt(0)}</div>
                      <div><div className="user-name">{user.name}</div><div className="user-email">{user.email}</div></div>
                    </div>
                  </td>
                  <td>{user.phone}</td>
                  <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                  <td>{user.joinedDate}</td>
                  <td>{user.totalBookings}</td>
                  <td><span className={`status-badge ${user.status}`}>{user.status}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className={`btn-status ${user.status}`} onClick={() => toggleUserStatus(user.id)}>{user.status === 'active' ? 'Block' : 'Unblock'}</button>
                      <button className="btn-view"><i className="fas fa-eye"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && <div className="no-results"><i className="fas fa-users"></i><h3>No users found</h3><p>Try adjusting your search or filters</p></div>}
        </div>

        <div className="pagination">
          <button className="page-btn">Previous</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">Next</button>
        </div>
      </div>
    </div>
  )
}

export default ManageUsers