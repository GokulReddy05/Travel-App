import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PopularCities from '../components/PopularCities';
import Accommodations from '../components/Accommodations'; 
import FlightSearch from '../components/FlightSearch';
import FlightBookings from '../components/FlightBookings';
import Staycations from '../components/Staycations';
import FlagshipHotels from '../components/FlagshipHotels';

const Home = () => {
  // Remove featuredDestinations since it's not being used
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedDestinations = async () => {
      try {
        await axios.get('http://localhost:5000/api/destinations/featured');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured destinations:', err);
        setLoading(false);
      }
    };

    fetchFeaturedDestinations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="position-relative d-flex align-items-center justify-content-center overflow-hidden" 
        style={{ 
          height: '45vh',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          position: 'relative'
        }}
      >
        {/* Decorative Elements */}
        <div 
          className="position-absolute w-100 h-100" 
          style={{
            background: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
        <div 
          className="position-absolute" 
          style={{
            width: '40%',
            height: '40%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            top: '10%',
            right: '5%',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />

        <div className="container position-relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <h1 className="display-4 fw-bold text-white mb-3">
              Discover Your Next
              <span className="d-block mt-1">Adventure</span>
            </h1>
            
            <p className="lead text-white-50 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
              Explore breathtaking destinations and create unforgettable memories
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link 
                to="/destinations" 
                className="btn btn-light px-4 py-2 fw-semibold rounded-pill shadow-sm hover-lift"
              >
                <i className="bi bi-compass me-2"></i>
                Explore Destinations
              </Link>
              <Link 
                to="/my-bookings" 
                className="btn btn-outline-light px-4 py-2 fw-semibold rounded-pill shadow-sm hover-lift"
              >
                <i className="bi bi-calendar-check me-2"></i>
                Plan Your Trip
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-xl text-gray-600">Discover our most sought-after travel experiences</p>
          </motion.div>

          
           {/* Add the PopularCities component */}
          <PopularCities />
          <br></br>
          
          {/* Add Staycations and FlagshipHotels components */}
           <Accommodations />
          <Staycations />
          <FlagshipHotels />
          
          {/* Your other sections */}
          
          <FlightSearch />
          <FlightBookings />
                

          <div className="text-center mt-12">
          
          </div>
        </div>
      </section>

      {/* Features Section with Extra Small Icons */}
      <section className="py-4 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            
          </div>
        </div>
      </section>

      
     

      
    </div>
  );
};

export default Home;