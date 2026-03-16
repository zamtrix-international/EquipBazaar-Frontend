import { useState, useEffect } from 'react'
import { equipmentAPI } from '../../services/api'
import './Reviews.css'

const Reviews = ({ equipmentId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await equipmentAPI.getReviews(equipmentId)
        setReviews(response.data.reviews || [])
      } catch (error) {
        console.error('Error fetching reviews:', error)
        // Fallback to mock data
        setReviews([
          {
            id: 1,
            user: 'Rajesh Kumar',
            rating: 5,
            comment: 'Excellent equipment! Well maintained and delivered on time.',
            date: '2024-03-15',
            helpful: 12
          },
          {
            id: 2,
            user: 'Amit Singh',
            rating: 4,
            comment: 'Good experience overall. Driver was professional.',
            date: '2024-03-10',
            helpful: 8
          },
          {
            id: 3,
            user: 'Vikas Sharma',
            rating: 5,
            comment: 'Highly recommend! Saved time and money for our project.',
            date: '2024-03-05',
            helpful: 15
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    if (equipmentId) {
      fetchReviews()
    }
  }, [equipmentId])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await equipmentAPI.addReview(equipmentId, newReview)
      setReviews([response.data.review, ...reviews])
      setNewReview({ rating: 5, comment: '' })
      setShowReviewForm(false)
      alert('Review submitted successfully!')
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={interactive ? () => onChange && onChange(star) : undefined}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <button
          className="write-review-btn"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {showReviewForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Rating Summary */}
      <div className="rating-summary">
        <div className="average-rating">
          <div className="rating-number">{averageRating.toFixed(1)}</div>
          {renderStars(Math.round(averageRating))}
          <div className="total-reviews">({reviews.length} reviews)</div>
        </div>

        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter(r => r.rating === star).length
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
            return (
              <div key={star} className="rating-bar">
                <span className="star-label">{star} ★</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="count">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h4>Write Your Review</h4>

          <div className="form-group">
            <label>Rating</label>
            {renderStars(newReview.rating, true, (rating) =>
              setNewReview({ ...newReview, rating })
            )}
          </div>

          <div className="form-group">
            <label>Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience with this equipment..."
              required
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={submitting} className="submit-btn">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this equipment!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-name">{review.user}</div>
                  <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                </div>
                {renderStars(review.rating)}
              </div>

              <div className="review-content">
                <p>{review.comment}</p>
              </div>

              <div className="review-footer">
                <button className="helpful-btn">
                  <i className="fas fa-thumbs-up"></i>
                  Helpful ({review.helpful || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Reviews