import React, { useState } from 'react';
import DestinationBooking from './DestinationBooking';

const Destinations = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  
  // ... existing code ...

  return (
    <div className="container py-5">
      {/* ... existing code ... */}
      
      {destinations.map((destination) => (
        <div key={destination.id} className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100">
            <img src={destination.image_url} className="card-img-top" alt={destination.name} />
            <div className="card-body">
              <h5 className="card-title">{destination.name}</h5>
              <p className="card-text">{destination.description}</p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fs-5">${destination.price}</span>
                <button 
                  className="btn btn-primary"
                  onClick={() => setSelectedDestination(destination)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {selectedDestination && (
        <DestinationBooking 
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
        />
      )}
    </div>
  );
};

export default Destinations;