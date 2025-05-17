import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PopularCities from '../components/PopularCities';

const Destinations = () => {
  const navigate = useNavigate();

  const handleViewDetails = (city) => {
    navigate(`/destinations/${city.id}`, { state: { city } });
  };

  // eslint-disable-next-line no-unused-vars
  const handleBooking = async (city) => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Replace with actual user ID from authentication
          travel_id: city.id,
          booking_type: 'familytrip',
          provider_name: city.name,
          booking_reference: `BK${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          cost: city.price,
          booking_date: new Date().toISOString().split('T')[0],
          status: 'confirmed'
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Booking successful!');
        navigate('/booking-management');
      } else {
        throw new Error(data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking:', error);
      alert('Failed to book. Please try again.');
    }
  };

  const beautifulCities = [
    {
      id: 1,
      name: 'Bali',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      description: 'Experience tropical paradise',
      price: 899.99,
      location: 'Indonesia'
    },
    {
      id: 2,
      name: 'Singapore',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd',
      description: 'Discover modern Asia',
      price: 999.99,
      location: 'Singapore'
    },
    {
      id: 3,
      name: 'Vietnam',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592',
      description: 'Experience authentic culture',
      price: 799.99,
      location: 'Vietnam'
    },
    {
      id: 4,
      name: 'Maldives',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
      description: 'Paradise on Earth',
      price: 1599.99,
      location: 'Maldives'
    },
    {
      id: 5,
      name: 'London',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
      description: 'Explore British heritage',
      price: 1299.99,
      location: 'United Kingdom'
    },
    {
      id: 6,
      name: 'Switzerland',
      image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95',
      description: 'Alpine wonderland',
      price: 1399.99,
      location: 'Europe'
    }
  ];

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <div className="position-relative" style={{
        height: '40vh',
        background: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="display-3 fw-bold mb-4">Explore Amazing Destinations</h1>
            <p className="lead">Find your perfect getaway</p>
          </motion.div>
        </div>
      </div>

      <div className="py-5">
        {/* Beautiful Cities Section */}
        <div className="mb-5">
          <h2 className="display-6 fw-bold text-center mb-4">Beautiful Cities</h2>
          <div className="container">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {beautifulCities.map((city, index) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="col"
                >
                  <div className="card shadow-sm h-100">
                    <div className="position-relative">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="card-img-top"
                        style={{ height: '250px', objectFit: 'cover' }}
                        loading="lazy"
                        width="400"
                        height="250"
                      />
                      <div className="position-absolute top-0 end-0 m-3 badge bg-light text-primary p-2 rounded-pill fs-5">
                        ${city.price}
                      </div>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title h4 fw-bold">{city.name}</h3>
                      <p className="card-text text-muted">{city.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">{city.location}</span>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleViewDetails(city)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Cities Section */}
        <PopularCities />
      </div>
    </div>
  );
};

export default Destinations;