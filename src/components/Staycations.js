import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Staycations = () => {
  const [staycations] = useState([
    {
      id: 1,
      name: 'Luxury Villa Retreat',
      location: 'Bali, Indonesia',
      price: 299,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      description: 'Experience luxury living in a private villa with pool'
    },
    {
      id: 2,
      name: 'Beachfront Resort',
      location: 'Maldives',
      price: 399,
      image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
      description: 'Enjoy paradise with direct beach access'
    },
    {
      id: 3,
      name: 'Mountain Lodge',
      location: 'Swiss Alps',
      price: 249,
      image: 'https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee',
      description: 'Cozy mountain retreat with stunning views'
    }
  ]);

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4 display-4 fw-bold">Popular Staycations</h2>
        <div className="row g-4">
          {staycations.length > 0 ? (
            staycations.map((stay) => (
              <div key={stay.id} className="col-md-4">
                <div className="card h-100 shadow-sm hover-lift">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{stay.name}</h5>
                    <p className="card-text text-muted small">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {stay.location}
                    </p>
                    <p className="card-text">{stay.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 mb-0 text-primary">${stay.price}/night</span>
                      <Link 
                        to={`/destinations/${stay.id}`} 
                        state={{ city: stay }}
                        className="btn btn-primary rounded-pill px-4 hover-scale"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5 my-5">
                <div className="mb-4">
                  <i className="bi bi-search display-1 text-muted"></i>
                </div>
                <h3 className="display-6 fw-bold text-muted mb-3">
                  No Destinations Found
                </h3>
                <p className="lead text-muted mb-4">
                  We couldn't find any staycation destinations matching your criteria.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="btn btn-outline-primary rounded-pill px-4"
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh Page
                  </button>
                  <Link 
                    to="/" 
                    className="btn btn-primary rounded-pill px-4"
                  >
                    <i className="bi bi-house-door me-2"></i>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add custom CSS for hover effects */}
      <style>
        {`
          .hover-lift {
            transition: transform 0.2s ease;
          }
          .hover-lift:hover {
            transform: translateY(-5px);
          }
          .hover-scale {
            transition: transform 0.2s ease;
          }
          .hover-scale:hover {
            transform: scale(1.05);
          }
        `}
      </style>
    </section>
  );
};

export default Staycations;