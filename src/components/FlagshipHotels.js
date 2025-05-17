import React from 'react';
import { Link } from 'react-router-dom';

const FlagshipHotels = () => {
  const hotels = [
    {
      id: 1,
      name: 'Sofitel Legend Metropole',
      location: 'Hanoi, Vietnam',
      price: 599,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      rating: 5,
      description: 'Historic luxury hotel in the heart of Hanoi'
    },
    {
      id: 2,
      name: 'Four Seasons',
      location: 'Paris, France',
      price: 799,
      image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
      rating: 5,
      description: 'Iconic hotel with views of the Eiffel Tower'
    },
    {
      id: 3,
      name: 'The Plaza',
      location: 'New York, USA',
      price: 699,
      image: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e',
      rating: 5,
      description: 'Iconic luxury hotel overlooking Central Park'
    },
    {
      id: 4,
      name: 'Marina Bay Sands',
      location: 'Singapore',
      price: 899,
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd',
      rating: 5,
      description: 'Iconic hotel with infinity pool and city views'
    },
    {
      id: 5,
      name: 'Burj Al Arab',
      location: 'Dubai, UAE',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1578681041175-9717c638d482',
      rating: 5,
      description: 'Iconic sail-shaped hotel with ultimate luxury'
    },
    {
      id: 6,
      name: 'Four Seasons Bosphorus',
      location: 'Istanbul, Turkey',
      price: 899,
      image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6',
      rating: 5,
      description: 'Historic palace hotel on the Bosphorus strait'
    },
    {
      id: 6,
      name: 'Aman Tokyo',
      location: 'Tokyo, Japan',
      price: 899,
      image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e',
      rating: 5,
      description: 'Urban sanctuary with Japanese aesthetics'
    }
  ];

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Flagship Hotels</h2>
        <div className="position-relative">
          <div 
            className="d-flex overflow-auto pb-3"
            style={{
              scrollSnapType: 'x mandatory',
              scrollPadding: '0 24px',
              gap: '1rem'
            }}
          >
            {hotels.map((hotel) => (
              <div 
                key={hotel.id} 
                className="flex-shrink-0"
                style={{ width: '300px', scrollSnapAlign: 'start' }}
              >
                <div className="card h-100 shadow-sm">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0">{hotel.name}</h5>
                      <div className="text-warning">
                        {'★'.repeat(hotel.rating)}
                      </div>
                    </div>
                    <p className="card-text text-muted small">{hotel.location}</p>
                    <p className="card-text">{hotel.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 mb-0">${hotel.price}/night</span>
                      <Link 
                        to={`/destinations/${hotel.id}`}
                        state={{ city: hotel }} 
                        className="btn btn-outline-primary"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          /* Custom scrollbar styles */
          .overflow-auto::-webkit-scrollbar {
            height: 8px;
          }
          .overflow-auto::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .overflow-auto::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .overflow-auto::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}
      </style>
    </section>
  );
};

export default FlagshipHotels;