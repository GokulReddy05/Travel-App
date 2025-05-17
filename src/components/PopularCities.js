import React from 'react';
import { Link } from 'react-router-dom';

const PopularCities = () => {
  const cities = [
    {
      id: 1,
      name: 'Paris',
      tagline: 'The City of Love',
      description: 'Experience the romance and charm of the French capital.',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a'
    },
    {
      id: 2,
      name: 'New York',
      tagline: 'The City That Never Sleeps',
      description: 'Discover the energy and excitement of the Big Apple.',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9'
    },
    {
      id: 3,
      name: 'Dubai',
      tagline: 'City of the Future',
      description: 'Experience luxury and innovation in the heart of the desert.',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'
    },
    {
      id: 4,
      name: 'Tokyo',
      tagline: 'Where Tradition Meets Innovation',
      description: 'Immerse yourself in Japanese culture and modern technology.',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf'
    }
  ];

  return (
    <section className="py-20 bg-light">
      <div className="container">
        <div id="cityCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
          <div className="carousel-inner shadow-lg rounded-lg overflow-hidden">
            {cities.map((city, index) => (
              <div key={city.name} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <div className="row g-0">
                  <div className="col-md-6 d-flex align-items-center bg-white p-5">
                    <div>
                      <h2 className="display-4 fw-bold mb-3">{city.name}</h2>
                      <p className="lead text-primary mb-3">{city.tagline}</p>
                      <p className="mb-4 text-muted">{city.description}</p>
                      <Link 
                        to={`/destinations/${city.id}`}
                        className="btn btn-primary btn-lg rounded-pill px-4 py-2"
                      >
                        Discover {city.name}
                      </Link>
                    </div>
                  </div>
                  <div className="col-md-6 position-relative">
                    <img 
                      src={city.image}
                      alt={city.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', minHeight: '500px' }}
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-dark" 
                         style={{ background: 'linear-gradient(45deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)' }}>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="carousel-control-prev ms-3" type="button" data-bs-target="#cityCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon bg-primary rounded-circle p-3" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next me-3" type="button" data-bs-target="#cityCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon bg-primary rounded-circle p-3" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
          
          <div className="carousel-indicators mb-0">
            {cities.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#cityCarousel"
                data-bs-slide-to={index}
                className={`${index === 0 ? 'active' : ''} bg-primary rounded-circle`}
                style={{ width: '12px', height: '12px', margin: '0 6px' }}
                aria-current={index === 0 ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularCities;