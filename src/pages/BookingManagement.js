import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const BookingManagement = () => {
  const [bookings, setBookings] = useState({ flights: [], destinations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Move the handleDeleteDestinationBooking function here
  const handleDeleteDestinationBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to delete your booking');
        return;
      }

      const response = await axios.delete(`${API_BASE_URL}/api/destination-bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setBookings(prev => ({
          ...prev,
          destinations: prev.destinations.filter(booking => booking.id !== bookingId)
        }));
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('Failed to delete booking');
    }
  };

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view your bookings');
          setLoading(false);
          return;
        }

        const [flightResponse, destinationResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/flight-bookings`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/api/destination-bookings`, { // Changed from /api/booking
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setBookings({
          flights: flightResponse.data,
          destinations: destinationResponse.data
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'flights':
        return { flights: bookings.flights, destinations: [] };
      case 'destinations':
        return { flights: [], destinations: bookings.destinations };
      default:
        return bookings;
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
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

  const filteredBookings = getFilteredBookings();

  return (
    <div className="container py-5">
      <h1 className="mb-4">My Bookings</h1>

      {/* Tabs */}
      <div className="mb-4">
        <div className="btn-group" role="group">
          <button
            className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('all')}
          >
            All Bookings
          </button>
          <button
            className={`btn ${activeTab === 'flights' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('flights')}
          >
            Flight Bookings
          </button>
          <button
            className={`btn ${activeTab === 'destinations' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('destinations')}
          >
            Destination Bookings
          </button>
        </div>
      </div>

      {/* Flight Bookings */}
      {(activeTab === 'all' || activeTab === 'flights') && filteredBookings.flights.length > 0 && (
        <div className="mb-5">
          <h2 className="h4 mb-4">Flight Bookings</h2>
          <div className="row g-4">
            {filteredBookings.flights.map((booking) => (
              <div key={booking.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{booking.from_city} → {booking.to_city}</h5>
                    <p className="card-text">
                      <small className="text-muted">{booking.airline}</small>
                    </p>
                    <div className="mb-3">
                      <div>Flight: {booking.flight_number}</div>
                      <div>Departure: {new Date(booking.departure_date).toLocaleString()}</div>
                      <div>Arrival: {new Date(booking.arrival_date).toLocaleString()}</div>
                      <div>Passengers: {booking.passengers}</div>
                      <div>Class: {booking.class_type}</div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 mb-0">${booking.price}</span>
                      <span className={`badge ${booking.status === 'confirmed' ? 'bg-success' : 'bg-warning'}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Destination Bookings */}
      {(activeTab === 'all' || activeTab === 'destinations') && filteredBookings.destinations.length > 0 && (
        <div>
          <h2 className="h4 mb-4">Destination Bookings</h2>
          <div className="row g-4">
            {filteredBookings.destinations.map((booking) => (
              <div key={booking.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{booking.destination_name}</h5>
                    <p className="card-text">
                      <small className="text-muted">{booking.location}</small>
                    </p>
                    <div className="mb-3">
                      <div>Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</div>
                      <div>Check-out: {new Date(booking.check_out_date).toLocaleDateString()}</div>
                      <div>Guests: {booking.guests}</div>
                      <div>Nights: {booking.nights}</div>
                    </div>
                    {/* Price Information */}
                    <div className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted">Price per night</span>
                        <span className="h6 mb-0">
                          ${typeof booking.price_per_night === 'number' ? booking.price_per_night.toFixed(2) : booking.price_per_night}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Total Price</span>
                        <span className="h5 mb-0 text-primary">
                          ${typeof booking.total_price === 'number' ? booking.total_price.toFixed(2) : booking.total_price}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-between align-items-center">
                      <span className={`badge ${booking.status === 'confirmed' ? 'bg-success' : 'bg-warning'}`}>
                        {booking.status}
                      </span>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this booking?')) {
                            handleDeleteDestinationBooking(booking.id);
                          }
                        }}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Bookings Message */}
      {((activeTab === 'all' && !filteredBookings.flights.length && !filteredBookings.destinations.length) ||
        (activeTab === 'flights' && !filteredBookings.flights.length) ||
        (activeTab === 'destinations' && !filteredBookings.destinations.length)) && (
        <div className="text-center py-5">
          <p className="text-muted">No bookings found.</p>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;