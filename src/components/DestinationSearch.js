import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DestinationSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const destinations = [
    {
      id: 1,
      name: 'Bali',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      alt: 'Bali Beach',
      description: 'Experience tropical paradise',
      price: 899.99
    },
    {
      id: 2,
      name: 'Singapore',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      alt: 'Singapore Skyline',
      description: 'Discover modern Asia',
      price: 999.99
    },
    {
      id: 3,
      name: 'London',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      alt: 'London City',
      description: 'Explore British heritage',
      price: 1299.99
    },
    {
      id: 4,
      name: 'Vietnam',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
      alt: 'Ha Long Bay',
      description: 'Experience authentic culture',
      price: 799.99
    },
    {
      id: 5,
      name: 'Maldives',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      alt: 'Maldives Beach Resort',
      description: 'Paradise on Earth',
      price: 1599.99
    },
    {
      id: 6,
      name: 'Switzerland',
      image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
      alt: 'Swiss Alps',
      description: 'Alpine wonderland',
      price: 1399.99
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/destinations/search', {
        params: searchParams
      });
      onSearch && onSearch(response.data);
    } catch (error) {
      console.error('Error searching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Search Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-6">
          <form onSubmit={handleSubmit} className="d-flex gap-2">
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="form-control"
              value={searchParams.location}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-4"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Featured Destinations */}
      <h2 className="h4 mb-4">Featured Destinations</h2>
      <div className="row g-4">
        {destinations.map((destination) => (
          <div key={destination.id} className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="position-relative">
                <img
                  src={destination.image}
                  alt={destination.alt}
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 end-0 m-3">
                  <span className="badge bg-light text-primary fs-5 shadow">
                    ${destination.price}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <h3 className="h4 mb-2">{destination.name}</h3>
                <p className="text-muted mb-3">{destination.description}</p>
                <Link
                  to={`/destinations/${destination.id}`}
                  className="btn btn-outline-primary w-100 py-2 fw-semibold hover-shadow transition-all d-flex align-items-center justify-content-center gap-2"
                >
                  View Details
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationSearch;