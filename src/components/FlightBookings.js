import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FlightBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelBooking, setCancelBooking] = useState(null);  // Add this line
  const navigate = useNavigate();

  // Add this function after the handleViewDetails function
  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      console.log('Attempting to cancel booking:', { bookingId });
  
      const response = await axios.delete(`http://localhost:5000/api/flight-bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Cancel booking response:', response.data);
  
      if (response.status === 200) {
        // Remove the cancelled booking from state
        const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
        setBookings(updatedBookings);
        setCancelBooking(null);
        setSelectedBooking(null);
        alert('Booking cancelled successfully');
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error cancelling booking:', {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status,
        bookingId: bookingId
      });
  
      if (err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert(err.response?.data?.error || 'Failed to cancel booking. Please try again.');
      }
    }
  };

  // Move fetchBookings outside useEffect so it can be called from anywhere in the component
  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your bookings');
        setLoading(false);
        navigate('/login');
        return;
      }

      // Log the token for debugging
      console.log('Using token:', token);
  
      const response = await axios.get('http://localhost:5000/api/flight-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Response data:', response.data);
  
      if (Array.isArray(response.data)) {
        setBookings(response.data);
        setError(null);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to fetch bookings. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Your Flight Bookings</h2>
      
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-link"
            onClick={fetchBookings}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-airplane fs-1 text-muted"></i>
          </div>
          <h3 className="h4 mb-3">No Flight Bookings</h3>
          <p className="text-muted mb-4">You haven't made any flight bookings yet.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Search Flights
          </button>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="row g-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-primary text-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{booking.airline}</h5>
                    <span className="badge bg-light text-primary">
                      {booking.flight_number}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-4">
                    <div className="text-center">
                      <div className="fs-5 fw-bold">
                        {new Date(booking.departure_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-muted small">{booking.from_city}</div>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-airplane fs-4 text-primary"></i>
                    </div>
                    <div className="text-center">
                      <div className="fs-5 fw-bold">
                        {new Date(booking.arrival_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-muted small">{booking.to_city}</div>
                    </div>
                  </div>
                  
                  <div className="border-top pt-3">
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="text-muted small">Date</div>
                        <div>{new Date(booking.departure_date).toLocaleDateString()}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted small">Status</div>
                        <div>
                          <span className="badge bg-success">{booking.status}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted small">Class</div>
                        <div className="text-capitalize">{booking.class_type}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted small">Passengers</div>
                        <div>{booking.passengers}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-light border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="fs-5 fw-bold text-primary">
                      ${booking.price}
                    </div>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleViewDetails(booking)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedBooking.airline} - Flight Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedBooking(null)}></button>
              </div>
              <div className="modal-body">
                <div className="card border-0">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-4">
                      <div className="text-center">
                        <div className="fs-4 fw-bold">
                          {new Date(selectedBooking.departure_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-muted">{selectedBooking.from_city}</div>
                        <div className="text-muted small mt-2">
                          {new Date(selectedBooking.departure_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="align-self-center">
                        <i className="bi bi-airplane fs-3 text-primary"></i>
                      </div>
                      <div className="text-center">
                        <div className="fs-4 fw-bold">
                          {new Date(selectedBooking.arrival_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-muted">{selectedBooking.to_city}</div>
                        <div className="text-muted small mt-2">
                          {new Date(selectedBooking.arrival_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="row g-4">
                      <div className="col-md-6">
                        <h6 className="text-muted">Flight Information</h6>
                        <div className="mb-2">Flight Number: {selectedBooking.flight_number}</div>
                        <div className="mb-2">Departure: {new Date(selectedBooking.departure_date).toLocaleString()}</div>
                        <div className="mb-2">Arrival: {new Date(selectedBooking.arrival_date).toLocaleString()}</div>
                        <div className="mb-2">Status: <span className="badge bg-success">{selectedBooking.status}</span></div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-muted">Booking Details</h6>
                        <div className="mb-2">Class: {selectedBooking.class_type}</div>
                        <div className="mb-2">Passengers: {selectedBooking.passengers}</div>
                        <div className="mb-2">Price: <span className="text-primary fw-bold">${selectedBooking.price}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger me-2" onClick={() => setCancelBooking(selectedBooking)}>
                  Cancel Booking
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedBooking(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {cancelBooking && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cancel Booking</h5>
                <button type="button" className="btn-close" onClick={() => setCancelBooking(null)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to cancel your flight from {cancelBooking.from_city} to {cancelBooking.to_city}?</p>
                <p className="text-muted small">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setCancelBooking(null)}>
                  No, Keep Booking
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => handleCancelBooking(cancelBooking.id)}
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightBookings;