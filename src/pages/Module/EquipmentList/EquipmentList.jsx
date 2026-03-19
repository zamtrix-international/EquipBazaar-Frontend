// pages/Module/EquipmentList/EquipmentList.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import EquipmentCard from '../../../components/EquipmentCard/EquipmentCard';
import { equipmentAPI } from '../../../services/api';
import './EquipmentList.css';

const EquipmentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    location: searchParams.get('location') || 'Meerut'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Fetch equipment from API
  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Prepare query parameters
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.location && { location: filters.location })
      };

      // API call
      const response = await equipmentAPI.getAll(queryParams);
      
      if (response?.data?.success) {
        const { data, pagination: paginationData } = response.data;
        setEquipment(data || []);
        setPagination(prev => ({
          ...prev,
          total: paginationData?.total || 0,
          pages: paginationData?.pages || 0
        }));
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch equipment');
      }
    } catch (err) {
      console.error('Equipment fetch error:', err);
      setError(err.message || 'Failed to fetch equipment. Please try again.');
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Initial fetch and when dependencies change
  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // Update URL params when filters or page change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    if (pagination.page > 1) params.set('page', pagination.page);
    
    setSearchParams(params);
  }, [filters, pagination.page, setSearchParams]);

  // Handle filter changes
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      location: 'Meerut'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Toggle mobile filters
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
    // Prevent body scroll when filters are open on mobile
    if (!showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showFilters]);

  // Close mobile filters
  const closeFilters = useCallback(() => {
    setShowFilters(false);
    document.body.style.overflow = 'unset';
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Get unique categories from API response
  const categories = [...new Set(equipment.map(item => item.category))].sort();

  // Loading state
  if (loading && equipment.length === 0) {
    return (
      <div className="equipment-list-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading equipment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="equipment-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">
            Available Equipment {filters.location && `in ${filters.location}`}
          </h1>
          <p className="results-count">
            {pagination.total} {pagination.total === 1 ? 'item' : 'items'} found
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-state" role="alert">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button 
              onClick={fetchEquipment} 
              className="btn btn-secondary btn-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Mobile Filter Toggle */}
        <button 
          className="mobile-filter-toggle"
          onClick={toggleFilters}
          aria-expanded={showFilters}
          aria-label="Toggle filters"
        >
          <svg className="filter-icon" viewBox="0 0 24 24" width="20" height="20">
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Main Content */}
        <div className="content-layout">
          {/* Filters Sidebar */}
          <aside 
            className={`filters-sidebar ${showFilters ? 'show' : ''}`}
            aria-label="Filter equipment"
          >
            <div className="filters-header">
              <h2>Filters</h2>
              <button 
                onClick={clearFilters} 
                className="clear-filters-btn"
                aria-label="Clear all filters"
              >
                Clear All
              </button>
              <button 
                className="close-filters-btn"
                onClick={closeFilters}
                aria-label="Close filters"
              >
                ×
              </button>
            </div>

            <div className="filters-content">
              {/* Category Filter */}
              <div className="filter-section">
                <label htmlFor="category-filter" className="filter-label">
                  Category
                </label>
                <select
                  id="category-filter"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="filter-select"
                  aria-label="Select category"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="filter-section">
                <label className="filter-label">Price Range (per hour)</label>
                <div className="price-range">
                  <div className="price-input">
                    <span className="currency">₹</span>
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      min="0"
                      step="100"
                      aria-label="Minimum price"
                    />
                  </div>
                  <span className="price-separator">to</span>
                  <div className="price-input">
                    <span className="currency">₹</span>
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      min="0"
                      step="100"
                      aria-label="Maximum price"
                    />
                  </div>
                </div>
              </div>

              {/* Location Filter */}
              <div className="filter-section">
                <label htmlFor="location-filter" className="filter-label">
                  Location
                </label>
                <input
                  type="text"
                  id="location-filter"
                  name="location"
                  placeholder="Enter city/area"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="filter-input"
                  aria-label="Enter location"
                />
              </div>

              {/* Apply Filters Button (Mobile) */}
              <button 
                className="apply-filters-btn"
                onClick={closeFilters}
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Equipment Grid */}
          <main className="equipment-grid-container">
            <div className="equipment-grid">
              {equipment.map(item => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
              
              {!loading && equipment.length === 0 && !error && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No equipment found</h3>
                  <p>Try adjusting your filters to find what you're looking for</p>
                  <button 
                    onClick={clearFilters} 
                    className="btn btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="pagination-btn"
                  aria-label="Previous page"
                >
                  ← Prev
                </button>
                
                <span className="pagination-info">
                  Page {pagination.page} of {pagination.pages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="pagination-btn"
                  aria-label="Next page"
                >
                  Next →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EquipmentList;