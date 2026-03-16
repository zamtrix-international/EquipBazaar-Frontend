import { useState, useEffect } from 'react'
import { supportAPI } from '../../../services/api'
import './Support.css'

const Support = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewTicketForm, setShowNewTicketForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'booking',
    priority: 'medium',
    message: ''
  })
  const [newMessage, setNewMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await supportAPI.getMyTickets()
      setTickets(response.data.tickets || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
      // Fallback to mock data
      setTickets([
        {
          id: 1,
          subject: 'Booking not confirmed',
          category: 'booking',
          priority: 'high',
          status: 'open',
          createdAt: '2024-03-15',
          lastUpdated: '2024-03-15',
          messages: [
            {
              id: 1,
              message: 'My booking for JCB is not showing as confirmed.',
              sender: 'customer',
              timestamp: '2024-03-15T10:00:00Z'
            },
            {
              id: 2,
              message: 'We are looking into this. Please provide your booking ID.',
              sender: 'support',
              timestamp: '2024-03-15T11:00:00Z'
            }
          ]
        },
        {
          id: 2,
          subject: 'Payment refund request',
          category: 'payment',
          priority: 'medium',
          status: 'closed',
          createdAt: '2024-03-10',
          lastUpdated: '2024-03-12',
          messages: [
            {
              id: 3,
              message: 'I need to cancel my booking and get refund.',
              sender: 'customer',
              timestamp: '2024-03-10T09:00:00Z'
            }
          ]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await supportAPI.createTicket(newTicket)
      setTickets([response.data.ticket, ...tickets])
      setNewTicket({
        subject: '',
        category: 'booking',
        priority: 'medium',
        message: ''
      })
      setShowNewTicketForm(false)
      alert('Support ticket created successfully!')
    } catch (error) {
      console.error('Error creating ticket:', error)
      alert('Failed to create ticket. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSendMessage = async (ticketId) => {
    if (!newMessage.trim()) return

    try {
      await supportAPI.sendMessage(ticketId, { message: newMessage })
      setNewMessage('')
      // Refresh tickets to get updated messages
      fetchTickets()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#28a745'
      case 'pending': return '#ffc107'
      case 'closed': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return '#28a745'
      case 'medium': return '#ffc107'
      case 'high': return '#dc3545'
      case 'urgent': return '#dc3545'
      default: return '#6c757d'
    }
  }

  if (loading) {
    return <div className="support-page">Loading support tickets...</div>
  }

  return (
    <div className="support-page">
      <div className="container">
        <div className="support-header">
          <h1 className="page-title">Support Center</h1>
          <button
            className="new-ticket-btn"
            onClick={() => setShowNewTicketForm(!showNewTicketForm)}
          >
            {showNewTicketForm ? 'Cancel' : 'New Support Ticket'}
          </button>
        </div>

        {/* New Ticket Form */}
        {showNewTicketForm && (
          <form className="new-ticket-form" onSubmit={handleCreateTicket}>
            <h3>Create New Support Ticket</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  required
                >
                  <option value="booking">Booking Issue</option>
                  <option value="payment">Payment Issue</option>
                  <option value="equipment">Equipment Problem</option>
                  <option value="vendor">Vendor Issue</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority *</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows="5"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={submitting} className="submit-btn">
                {submitting ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </form>
        )}

        {/* Tickets List */}
        <div className="tickets-section">
          <h3>Your Support Tickets</h3>

          {tickets.length === 0 ? (
            <div className="no-tickets">
              <p>You haven't created any support tickets yet.</p>
              <button
                className="new-ticket-btn"
                onClick={() => setShowNewTicketForm(true)}
              >
                Create Your First Ticket
              </button>
            </div>
          ) : (
            <div className="tickets-list">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`ticket-card ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                >
                  <div className="ticket-header">
                    <div className="ticket-info">
                      <h4>{ticket.subject}</h4>
                      <div className="ticket-meta">
                        <span className="ticket-id">#{ticket.id}</span>
                        <span className="ticket-category">{ticket.category}</span>
                        <span
                          className="ticket-priority"
                          style={{ color: getPriorityColor(ticket.priority) }}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>

                    <div className="ticket-status">
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(ticket.status) }}
                      >
                        {ticket.status}
                      </span>
                      <span className="ticket-date">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {selectedTicket?.id === ticket.id && (
                    <div className="ticket-details">
                      <div className="messages">
                        {ticket.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`message ${message.sender === 'customer' ? 'customer' : 'support'}`}
                          >
                            <div className="message-content">
                              <p>{message.message}</p>
                              <span className="message-time">
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {ticket.status !== 'closed' && (
                        <div className="reply-form">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your reply..."
                            rows="3"
                          />
                          <button
                            onClick={() => handleSendMessage(ticket.id)}
                            disabled={!newMessage.trim()}
                            className="reply-btn"
                          >
                            Send Reply
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Support