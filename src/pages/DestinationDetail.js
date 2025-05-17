import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const DestinationDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { city } = location.state || {};

  const getDestinationInfo = (cityName) => {
    const info = {
      'Bali': {
        highlights: ['Beautiful Beaches', 'Hindu Temples', 'Rice Terraces', 'Tropical Weather'],
        activities: [
          { name: 'Temple Tours', description: 'Visit ancient Hindu temples' },
          { name: 'Surfing Lessons', description: 'Learn to surf in pristine waters' },
          { name: 'Rice Field Walks', description: 'Explore scenic rice terraces' },
          { name: 'Spa Treatments', description: 'Experience traditional Balinese massage' }
        ]
      },
      // ... rest of the destinations info ...
    };
    return info[cityName] || {
      highlights: ['Cultural Experience', 'Local Cuisine', 'Historic Sites', 'Natural Beauty'],
      activities: [
        { name: 'City Tours', description: `Experience the best of ${cityName}` },
        { name: 'Local Markets', description: 'Explore local culture and goods' },
        { name: 'Museums', description: 'Learn about local history' },
        { name: 'Outdoor Adventures', description: 'Explore natural attractions' }
      ]
    };
  };

  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1
  });

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBooking = async () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to make a booking');
        navigate('/login');
        return;
      }

      // Get user details from token
      let userId, fullName;
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        userId = tokenData.userId || tokenData.user_id || tokenData.id;
        fullName = tokenData.fullName || tokenData.full_name || tokenData.name;
        if (!userId) {
          throw new Error('User ID not found in token');
        }
      } catch (tokenError) {
        console.error('Token parsing error:', tokenError);
        alert('Authentication error. Please log in again.');
        navigate('/login');
        return;
      }

      // Validate dates
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        alert('Check-in date cannot be in the past');
        return;
      }

      if (checkOut <= checkIn) {
        alert('Check-out date must be after check-in date');
        return;
      }

      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      if (nights < 1) {
        alert('Minimum stay is 1 night');
        return;
      }

      // Validate city data
      if (!city || !city.id || !city.name || !city.location || !city.price) {
        console.error('Invalid city data:', city);
        alert('Invalid destination data. Please try again.');
        return;
      }

      const requestData = {
        user_id: userId,
        full_name: fullName,
        destination_id: parseInt(city.id),
        destination_name: city.name,
        location: city.location,
        check_in_date: checkIn.toISOString().split('T')[0],
        check_out_date: checkOut.toISOString().split('T')[0],
        guests: parseInt(bookingData.guests) || 1,
        nights: nights,
        price_per_night: parseFloat(city.price),
        total_price: parseFloat(city.price) * (parseInt(bookingData.guests) || 1) * nights,
        status: 'confirmed',
        booking_time: new Date().toISOString()
      };

      // Validate request data
      if (!requestData.user_id || !requestData.destination_id) { // Fixed validation
        console.error('Invalid request data:', requestData);
        alert('Invalid booking data. Please try again.');
        return;
      }

      console.log('Sending booking request:', requestData);

      try {
        const response = await axios.post('http://localhost:5000/api/destination-bookings', requestData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          validateStatus: function (status) {
            return status >= 200 && status < 300;
          }
        });

        if (!response.data || !response.data.id) {
          throw new Error('Invalid response: Booking ID not received');
        }

        console.log('Booking response:', response.data);
        alert('Booking successful! You can view your booking in My Bookings page.');
        navigate('/my-bookings');
      } catch (error) {
        const errorDetails = error.response?.data || {};
        console.error('Booking error details:', {
          message: error.message,
          status: error.response?.status,
          data: errorDetails,
          stack: error.stack
        });
        alert(`Failed to book: ${errorDetails.message || error.message}. Please try again.`);
      }

    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to process booking. Please try again.');
    }
  };

  if (!city) {
    return (
      <div className="container py-5 text-center">
        <h2>Destination not found</h2>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/destinations')}
        >
          Back to Destinations
        </button>
      </div>
    );
  }

  const destinationInfo = getDestinationInfo(city.name);

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <div 
        className="position-relative" 
        style={{
          height: '35vh', // Changed from 60vh to 50vh for slightly smaller hero
          backgroundImage: `url(${city.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div 
          className="position-absolute w-100 h-100" 
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        ></div>
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12 text-white text-center position-relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-2 fw-bold mb-2" style={{ letterSpacing: '1px' }}>{city.name}</h1>
                <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                  <i className="bi bi-geo-alt-fill"></i>
                  <p className="lead mb-0" style={{ fontSize: '1.5rem' }}>{city.location}</p>
                </div>
                <div 
                  className="mx-auto" 
                  style={{ 
                    width: '60px', 
                    height: '4px', 
                    background: 'white',
                    borderRadius: '2px'
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3 shadow-sm p-4"
            >
              <h2 className="h3 mb-4">About {city.name}</h2>
              <p className="lead mb-4">{city.description}</p>
              
              <h3 className="h4 mb-3">Highlights</h3>
              <div className="row g-3 mb-4">
                {destinationInfo.highlights.map((highlight, index) => (
                  <div key={index} className="col-md-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span>{highlight}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="h4 mb-4">Activities</h3> {/* Changed mb-3 to mb-4 for more space */}
              <div className="row g-4"> {/* Changed g-3 to g-4 for more gap between activity cards */}
                {destinationInfo.activities.map((activity, index) => (
                  <div key={index} className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{activity.name}</h5>
                        <p className="card-text text-muted">{activity.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="col-lg-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card shadow-sm sticky-top"
              style={{ top: '2rem' }}
            >
              <div className="card-body">
                <h3 className="card-title h4 mb-4">Book Your Trip</h3>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Price per person</span>
                    <span className="h3 mb-0 text-primary">${city.price}</span>
                  </div>
                </div>

                <form className="mb-4">
                  <div className="mb-3">
                    <label className="form-label">Check-in Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      name="checkInDate"
                      value={bookingData.checkInDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Check-out Date</label>
                    <input 
                      type="date" 
                      className="form-control"
                      name="checkOutDate"
                      value={bookingData.checkOutDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Number of Guests</label>
                    <select 
                      className="form-select"
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleInputChange}
                    >
                      {[1,2,3,4].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary w-100 btn-lg"
                    onClick={handleBooking}
                  >
                    Book Now
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;