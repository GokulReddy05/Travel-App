import React from 'react';
import { Link } from 'react-router-dom';

const DestinationCard = ({ destination }) => {
  return (
    <div className="card border-0 bg-white">
      <img
        src={destination.image}
        alt={destination.name}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body px-0 pt-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small">{destination.location}</span>
          <Link to={`/destinations/${destination.id}`} className="btn btn-sm btn-outline-dark">View Details →</Link>
        </div>
        <h3 className="h5 mb-1">{destination.name}</h3>
        <p className="text-muted small mb-2">{destination.tagline}</p>
        <div className="fw-bold">${destination.price}</div>
      </div>
    </div>
  );
};

export default DestinationCard;