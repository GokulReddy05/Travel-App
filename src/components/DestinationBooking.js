import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DestinationBooking = ({ destination, onClose }) => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    check_in_date: '',
    check_out_date: '',
    guests: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
    setError(null); // Clear error when user makes changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to make a booking');
        navigate('/login');
        return;
      }

      // Validate dates
      const checkIn = new Date(bookingData.check_in_date);
      const checkOut = new Date(bookingData.check_out_date);
      
      if (checkIn >= checkOut) {
        setError('Check-out date must be after check-in date');
        return;
      }

      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const totalPrice = destination.price * bookingData.guests * nights;

      const response = await axios.post(
        'http://localhost:5000/api/destination-bookings',
        {
          destination_id: destination.id,
          location: destination.location,
          check_in_date: bookingData.check_in_date,
          check_out_date: bookingData.check_out_date,
          guests: parseInt(bookingData.guests),
          nights: nights,
          price_per_night: destination.price,
          total_price: totalPrice
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.id) {
        navigate('/my-bookings');
      } else {
        throw new Error('Booking failed - no confirmation received');
      }
    } catch (err) {
      console.error('Booking error:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Please log in to make a booking');
        navigate('/login');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid booking details');
      } else if (err.response?.status === 409) {
        setError('This destination is not available for the selected dates');
      } else {
        setError('Failed to make booking. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Book {destination.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Check-in Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="check_in_date"
                  value={bookingData.check_in_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Check-out Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="check_out_date"
                  value={bookingData.check_out_date}
                  onChange={handleInputChange}
                  min={bookingData.check_in_date || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Number of Guests</label>
                <input
                  type="number"
                  className="form-control"
                  name="guests"
                  value={bookingData.guests}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fs-5">
                  Total Price: ${
                    bookingData.check_in_date && bookingData.check_out_date
                      ? (destination.price * bookingData.guests * Math.ceil((new Date(bookingData.check_out_date) - new Date(bookingData.check_in_date)) / (1000 * 60 * 60 * 24))).toFixed(2)
                      : (destination.price * bookingData.guests).toFixed(2)
                  }
                </span>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Booking...
                    </>
                  ) : (
                    'Book Now'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationBooking;