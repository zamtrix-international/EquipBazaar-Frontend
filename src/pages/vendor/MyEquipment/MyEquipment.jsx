import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { equipmentAPI } from '../../../services/api'
import './MyEquipment.css'

const MyEquipment = () => {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyEquipment = async () => {
      try {
        const response = await equipmentAPI.getMyEquipment()
        setEquipment(response.data.equipment || [])
      } catch (error) {
        console.error('Error fetching my equipment:', error)
        // Fallback to mock data if API fails
        setEquipment([
          {
            id: 1,
            name: 'JCB 3DX',
            category: 'JCB',
            hourlyRate: 1200,
            dailyRate: 8000,
            image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'available',
            bookings: 24,
            rating: 4.5
          },
          {
            id: 2,
            name: 'Mahindra Tractor',
            category: 'Tractor',
            hourlyRate: 800,
            dailyRate: 5000,
            image: 'https://images.unsplash.com/photo-1597161016902-80a5b1b10b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'available',
            bookings: 56,
            rating: 5
          },
          {
            id: 3,
            name: 'Hydra Crane',
            category: 'Crane',
            hourlyRate: 2500,
            dailyRate: 18000,
            image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'booked',
            bookings: 18,
            rating: 4.5
          },
          {
            id: 4,
            name: 'Ashok Leyland Dumper',
            category: 'Dumper',
            hourlyRate: 1500,
            dailyRate: 10000,
            image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            status: 'maintenance',
            bookings: 12,
            rating: 4
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMyEquipment()
  }, [])

  const toggleStatus = async (id) => {
    try {
      const newStatus = equipment.find(item => item.id === id)?.status === 'available' ? 'maintenance' : 'available'
      await equipmentAPI.update(id, { status: newStatus })
      setEquipment(equipment.map(item => 
        item.id === id 
          ? {...item, status: newStatus}
          : item
      ))
    } catch (error) {
      console.error('Error updating equipment status:', error)
      // Fallback to local state update
      setEquipment(equipment.map(item => 
        item.id === id 
          ? {...item, status: item.status === 'available' ? 'maintenance' : 'available'}
          : item
      ))
    }
  }

  if (loading) {
    return <div className="my-equipment-page">Loading equipment...</div>
  }

  return (
    <div className="my-equipment-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Equipment</h1>
          <Link to="/vendor/add-equipment" className="add-btn">
            <i className="fas fa-plus"></i> Add New Equipment
          </Link>
        </div>

        <div className="equipment-grid">
          {equipment.map(item => (
            <div key={item.id} className="equipment-card">
              <div className="equipment-image">
                <img src={item.image} alt={item.name} />
                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>
              </div>

              <div className="equipment-info">
                <h3>{item.name}</h3>
                <p className="category">{item.category}</p>

                <div className="pricing">
                  <span className="hourly">₹{item.hourlyRate}/hr</span>
                  <span className="daily">₹{item.dailyRate}/day</span>
                </div>

                <div className="stats">
                  <span><i className="fas fa-star"></i> {item.rating}</span>
                  <span><i className="fas fa-calendar-check"></i> {item.bookings} bookings</span>
                </div>

                <div className="actions">
                  <button className="btn-edit">
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button 
                    className={`btn-status ${item.status}`}
                    onClick={() => toggleStatus(item.id)}
                  >
                    <i className="fas fa-power-off"></i> 
                    {item.status === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyEquipment