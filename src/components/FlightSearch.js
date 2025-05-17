import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FlightSearch = () => {
  const [flights, setFlights] = useState([]);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: new Date().toISOString().split('T')[0],
    classType: 'economy',
    passengers: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const searchFlights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate all required fields
      if (!searchParams.origin) {
        setError('Please enter origin city');
        setLoading(false);
        return;
      }
      if (!searchParams.destination) {
        setError('Please enter destination city');
        setLoading(false);
        return;
      }
      if (!searchParams.date) {
        setError('Please select a date');
        setLoading(false);
        return;
      }
      if (!searchParams.classType) {
        setError('Please select a travel class');
        setLoading(false);
        return;
      }
      if (!searchParams.passengers || searchParams.passengers < 1) {
        setError('Please enter number of passengers');
        setLoading(false);
        return;
      }

      // Format the date to match MySQL date format (YYYY-MM-DD)
      const formattedDate = new Date(searchParams.date).toISOString().split('T')[0];

      console.log('Searching with params:', {
        from_city: searchParams.origin,
        to_city: searchParams.destination,
        departure_date: formattedDate,
        class_type: searchParams.classType.toLowerCase(),
        passengers: searchParams.passengers
      });

      const response = await axios.get('http://localhost:5000/api/flights/search', {
        params: {
          from_city: searchParams.origin,
          to_city: searchParams.destination,
          departure_date: formattedDate,
          class_type: searchParams.classType.toLowerCase(),
          passengers: searchParams.passengers
        }
      });
      
      setFlights(response.data);
      if (response.data.length === 0) {
        setError(`No flights found for ${searchParams.date}`);
      }
    } catch (error) {
      console.error('Search error:', error.response?.data || error);
      setError(error.response?.data?.message || 'Error fetching flights. Please try again.');
      setFlights([]);
    }
    setLoading(false);
  };

  const handleBookFlight = async (flight) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book flights');
        navigate('/login');
        return;
      }

      // Create departure and arrival dates
      const departureDate = new Date(searchParams.date);
      const arrivalDate = new Date(searchParams.date);
      // Add one day for arrival
      arrivalDate.setDate(arrivalDate.getDate() + 1);

      const bookingData = {
        flight_id: flight.id,
        from_city: flight.from_city,
        to_city: flight.to_city,
        departure_date: departureDate.toISOString().split('T')[0],
        arrival_date: arrivalDate.toISOString().split('T')[0],
        airline: flight.airline,
        flight_number: flight.flight_number,
        price: flight.price,
        class_type: flight.class_type,
        passengers: searchParams.passengers
      };

      console.log('Sending booking data:', bookingData);

      const response = await axios.post('http://localhost:5000/api/flight-bookings', bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        alert('Flight booked successfully!');
        navigate('/my-bookings');
      }
    } catch (error) {
      console.error('Booking error:', error.response?.data || error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Please login to book flights');
        navigate('/login');
      } else {
        alert(error.response?.data?.message || 'Error booking flight. Please try again.');
      }
    }
};

  return (
    <div className="container-fluid py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <i className="bi bi-airplane-engines text-primary" style={{ fontSize: '3rem' }}></i>
          <h2 className="text-primary fw-bold mt-3">Find Your Perfect Flight</h2>
          <p className="text-muted">Search and compare flights to your favorite destinations</p>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <div className="card-body p-4 p-md-5">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control border-0 bg-light"
                        id="originInput"
                        placeholder="Origin City"
                        value={searchParams.origin}
                        onChange={(e) => setSearchParams({
                          ...searchParams,
                          origin: e.target.value
                        })}
                      />
                      <label htmlFor="originInput"><i className="bi bi-geo-alt me-2"></i>Origin City</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control border-0 bg-light"
                        id="destinationInput"
                        placeholder="Destination City"
                        value={searchParams.destination}
                        onChange={(e) => setSearchParams({
                          ...searchParams,
                          destination: e.target.value
                        })}
                      />
                      <label htmlFor="destinationInput"><i className="bi bi-geo me-2"></i>Destination City</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="date"
                        className="form-control border-0 bg-light"
                        id="dateInput"
                        value={searchParams.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSearchParams({
                          ...searchParams,
                          date: e.target.value
                        })}
                        required
                      />
                      <label htmlFor="dateInput"><i className="bi bi-calendar3 me-2"></i>Departure Date</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating">
                      <select
                        className="form-select border-0 bg-light"
                        id="classSelect"
                        value={searchParams.classType}
                        onChange={(e) => setSearchParams({
                          ...searchParams,
                          classType: e.target.value
                        })}
                      >
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First Class</option>
                      </select>
                      <label htmlFor="classSelect"><i className="bi bi-star me-2"></i>Travel Class</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="number"
                        className="form-control border-0 bg-light"
                        id="passengersInput"
                        placeholder="Passengers"
                        min="1"
                        value={searchParams.passengers}
                        onChange={(e) => setSearchParams({
                          ...searchParams,
                          passengers: Math.max(1, parseInt(e.target.value) || 1)
                        })}
                      />
                      <label htmlFor="passengersInput"><i className="bi bi-people me-2"></i>Passengers</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center"
                      onClick={searchFlights}
                      disabled={loading}
                      style={{ background: 'linear-gradient(45deg, #007bff, #0056b3)' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>
                          Search Flights
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger mt-4 rounded-3 d-flex align-items-center" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            {flights.length > 0 && (
              <div className="mt-5">
                <h4 className="mb-4 text-primary d-flex align-items-center">
                  <i className="bi bi-calendar2-check me-2"></i>
                  Available Flights for {new Date(searchParams.date).toLocaleDateString()}
                </h4>
                <div className="row g-4">
                  {flights.map((flight) => (
                    <div key={flight.id} className="col-12">
                      <div className="card shadow-lg border-0 rounded-4 hover-lift" 
                           style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                           onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                           onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div className="card-body p-4">
                          <div className="row align-items-center">
                            <div className="col-md-4">
                              <div className="d-flex align-items-center">
                                <i className="bi bi-airplane text-primary me-3" style={{ fontSize: '2rem' }}></i>
                                <div>
                                  <h5 className="card-title text-primary mb-1">{flight.airline}</h5>
                                  <p className="card-text text-muted mb-0">
                                    <i className="bi bi-ticket-perforated me-2"></i>
                                    Flight: {flight.flight_number}
                                  </p>
                                  <p className="card-text mb-0">
                                    <span className="badge bg-info rounded-pill">
                                      <i className="bi bi-stars me-1"></i>
                                      {flight.class_type}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 text-center">
                              <div className="flight-path position-relative">
                                <h5 className="mb-3">
                                  {flight.departure_time} - {flight.arrival_time}
                                </h5>
                                <div className="d-flex align-items-center justify-content-center">
                                  <span className="fw-bold">{flight.from_city}</span>
                                  <div className="flight-line mx-3 position-relative">
                                    <i className="bi bi-airplane-fill text-primary" style={{ fontSize: '1.2rem' }}></i>
                                  </div>
                                  <span className="fw-bold">{flight.to_city}</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 text-end">
                              <h4 className="text-primary mb-2">
                                <i className="bi bi-tag me-2"></i>
                                ${flight.price}
                              </h4>
                              <p className="text-muted mb-3">
                                <i className="bi bi-person-fill me-1"></i>
                                {flight.available_seats} seats available
                              </p>
                              <button
                                className="btn btn-outline-primary w-100 rounded-3 py-2"
                                onClick={() => handleBookFlight(flight)}
                              >
                                <i className="bi bi-bookmark-check me-2"></i>
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;