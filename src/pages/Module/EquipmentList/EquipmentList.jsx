import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import EquipmentCard from '../../../components/EquipmentCard/EquipmentCard'
import { equipmentAPI } from '../../../services/api'
import './EquipmentList.css'

const EquipmentList = () => {
  const location = useLocation()
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: 'Meerut'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true)
      setError('')
      try {
        // API call try karo
        const response = await equipmentAPI.getAll({ page: 1, limit: 100 })
        if (response.data && response.data.data) {
          setEquipment(response.data.data.rows || [])
        }
      } catch (err) {
        setError('Failed to fetch equipment. Please try again.')
        console.error('Equipment fetch error:', err)
        // Fixed: Properly structured mock data with commas
        setEquipment([
          {
            id: 1,
            name: 'JCB 3DX',
            category: 'JCB',
            hourlyRate: 1200,
            dailyRate: 8000,
            rating: 4.5,
            reviews: 128,
            image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            vendor: 'Ramesh Construction',
            location: 'Meerut City',
            available: true
          },
          {
            id: 2,
            name: 'Mahindra Tractor',
            category: 'Tractor',
            hourlyRate: 800,
            dailyRate: 5000,
            rating: 4.3,
            reviews: 95,
            image: 'https://images.unsplash.com/photo-1597161016902-80a5b1b10b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            vendor: 'Singh Agro Services',
            location: 'Modipuram',
            available: true
          },
          {
            id: 3,
            name: 'Hydra Crane',
            category: 'Crane',
            hourlyRate: 2500,
            dailyRate: 18000,
            rating: 4.7,
            reviews: 67,
            image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            vendor: 'Meerut Crane Services',
            location: 'Lisari Road',
            available: true
          },
          {
            id: 4,
            name: 'Ashok Leyland Dumper',
            category: 'Dumper',
            hourlyRate: 1800,
            dailyRate: 12000,
            rating: 4.2,
            reviews: 43,
            image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            vendor: 'Verma Transport',
            location: 'Delhi Road',
            available: true
          },
          {
            id: 5,
            name: 'Sonalika Tractor',
            category: 'Tractor',
            hourlyRate: 750,
            dailyRate: 4800,
            rating: 4.4,
            reviews: 82,
            image: 'https://images.unsplash.com/photo-1597161016902-80a5b1b10b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            vendor: 'Kisan Agro',
            location: 'Sardhana',
            available: true
          },
          {
            id: 6,
            name: 'Swaraj Tractor',
            category: 'Tractor',
            hourlyRate: 700,
            dailyRate: 4500,
            rating: 4.3,
            reviews: 41,
            image: 'https://images.unsplash.com/photo-1597161016902-80a5b1b10b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            vendor: 'Kisan Agro',
            location: 'Sardhana',
            available: true
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEquipment()
  }, []) // Only one useEffect

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      location: ''
    })
  }

  const filteredEquipment = equipment.filter(item => {
    // Category filter
    if (filters.category && item.category !== filters.category) return false
    
    // Price range filter (using hourly rate)
    if (filters.minPrice && item.hourlyRate < parseInt(filters.minPrice)) return false
    if (filters.maxPrice && item.hourlyRate > parseInt(filters.maxPrice)) return false
    
    // Location filter (case-insensitive partial match)
    if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    
    return true
  })

  // Get unique categories for filter dropdown
  const categories = [...new Set(equipment.map(item => item.category))]

  if (loading && equipment.length === 0) {
    return (
      <div className="equipment-list-page">
        <div className="container">
          <div className="loader-container">
            <div className="loader">Loading equipment...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="equipment-list-page">
      <div className="container">
        <div className="page-header">
          <h1>Available Equipment {filters.location ? `in ${filters.location}` : 'Near You'}</h1>
          <p className="results-count">{filteredEquipment.length} equipment found</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-retry">
              Retry
            </button>
          </div>
        )}

        <button 
          className="mobile-filter-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <i className="fas fa-filter"></i> 
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="content-wrapper">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button onClick={clearFilters} className="clear-filters">
                Clear All
              </button>
            </div>

            <div className="filter-group">
              <label htmlFor="category">Category</label>
              <select 
                id="category"
                name="category" 
                value={filters.category} 
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range (per hour)</label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min ₹"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
                <span>to</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max ₹"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter city/area (e.g., Meerut, Delhi)"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>

            <button className="apply-filters-mobile" onClick={() => setShowFilters(false)}>
              Apply Filters
            </button>
          </div>

          {/* Equipment Grid */}
          <div className="equipment-grid">
            {filteredEquipment.map(item => (
              <EquipmentCard key={item.id} equipment={item} />
            ))}
            
            {!loading && filteredEquipment.length === 0 && (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <h3>No equipment found</h3>
                <p>Try adjusting your filters to find what you're looking for</p>
                <button onClick={clearFilters} className="btn-clear-filters">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EquipmentList