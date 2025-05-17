import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AccommodationsPage = () => {
  const location = useLocation();
  const initialType = location.state?.type || 'all';
  const [selectedType, setSelectedType] = useState(initialType);
  const [priceRange, setPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const accommodations = [
    {
      id: 1,
      name: 'The Ritz-Carlton Suite',
      type: 'luxury',
      price: 899,
      rating: 4.9,
      location: 'Downtown',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      amenities: ['Spa', 'Pool', 'Restaurant', 'Gym', '24/7 Service']
    },
    {
      id: 2,
      name: 'Boutique Garden Hotel',
      type: 'boutique',
      price: 299,
      rating: 4.6,
      location: 'Historic District',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      amenities: ['Garden', 'Restaurant', 'Bar', 'Free Breakfast']
    },
    {
      id: 3,
      name: 'Urban Apartment Suite',
      type: 'apartment',
      price: 199,
      rating: 4.4,
      location: 'City Center',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      amenities: ['Kitchen', 'Washer', 'Workspace', 'Parking']
    },
    {
      id: 4,
      name: 'Budget Comfort Inn',
      type: 'budget',
      price: 89,
      rating: 4.0,
      location: 'Suburb Area',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      amenities: ['WiFi', 'Parking', 'Air Conditioning']
    },
    {
      id: 5,
      name: 'Luxury Beachfront Villa',
      type: 'luxury',
      price: 1299,
      rating: 5.0,
      location: 'Beachfront',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      amenities: ['Private Beach', 'Pool', 'Butler', 'Helipad']
    },
    {
      id: 6,
      name: 'Cozy Hostel',
      type: 'budget',
      price: 45,
      rating: 4.2,
      location: 'City Center',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
      amenities: ['Shared Kitchen', 'Lounge', 'WiFi']
    },
    {
      id: 7,
      name: 'Artistic Boutique Loft',
      type: 'boutique',
      price: 275,
      rating: 4.7,
      location: 'Arts District',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      amenities: ['Art Gallery', 'Rooftop Bar', 'Design Studio', 'Breakfast']
    },
    {
      id: 8,
      name: 'Heritage Boutique Inn',
      type: 'boutique',
      price: 325,
      rating: 4.8,
      location: 'Old Town',
      image: 'https://images.unsplash.com/photo-1521783593447-5702b9bfd267',
      amenities: ['Antique Furniture', 'Tea Room', 'Library', 'Garden Tours']
    },
    {
      id: 9,
      name: 'Modern City Apartment',
      type: 'apartment',
      price: 245,
      rating: 4.5,
      location: 'Financial District',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      amenities: ['Smart Home', 'Gym Access', 'Business Center', 'Parking']
    },
    {
      id: 10,
      name: 'Riverside Apartment',
      type: 'apartment',
      price: 189,
      rating: 4.3,
      location: 'Riverside',
      image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80',
      amenities: ['River View', 'Balcony', 'BBQ Area', 'Bike Storage']
    },
    {
      id: 11,
      name: 'Palace Suite Resort',
      type: 'luxury',
      price: 1599,
      rating: 4.9,
      location: 'Private Island',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      amenities: ['Private Beach', 'Yacht Service', 'Personal Chef', 'Spa']
    }
  ];

  const filteredAccommodations = accommodations.filter(acc => {
    const matchesType = selectedType === 'all' || acc.type === selectedType;
    const matchesPrice = priceRange === 'all' ||
      (priceRange === 'budget' && acc.price < 100) ||
      (priceRange === 'mid' && acc.price >= 100 && acc.price < 300) ||
      (priceRange === 'luxury' && acc.price >= 300);
    const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesPrice && matchesSearch;
  });

  return (
    <div className="container-fluid bg-light py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="display-4 fw-bold text-primary mb-3">
              {selectedType === 'all' ? 'All Accommodations' : 
               `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Accommodations`}
            </h1>
            <p className="lead text-muted">Find your perfect stay from our carefully curated selection</p>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="row g-3">
                  {/* Search */}
                  <div className="col-md-4">
                    <input
                      type="text"
                      placeholder="Search accommodations..."
                      className="form-control"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Type Filter */}
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="luxury">Luxury</option>
                      <option value="boutique">Boutique</option>
                      <option value="apartment">Apartment</option>
                      <option value="budget">Budget</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                    >
                      <option value="all">All Prices</option>
                      <option value="budget">Budget (Under $100)</option>
                      <option value="mid">Mid-Range ($100-$300)</option>
                      <option value="luxury">Luxury ($300+)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accommodations Grid */}
        <div className="row g-4">
          {filteredAccommodations.map(accommodation => (
            <div key={accommodation.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm hover-shadow">
                <div className="position-relative">
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <span className="position-absolute top-0 end-0 badge bg-primary m-3">
                    ${accommodation.price}/night
                  </span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-2">{accommodation.name}</h5>
                  <p className="card-text text-muted mb-2">
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    {accommodation.location}
                  </p>
                  
                  {/* Rating */}
                  <div className="mb-3">
                    <span className="text-warning me-1">★</span>
                    <span className="text-muted">{accommodation.rating}</span>
                  </div>

                  {/* Amenities */}
                  <div className="mb-3">
                    {accommodation.amenities.map(amenity => (
                      <span 
                        key={amenity}
                        className="badge bg-light text-dark me-1 mb-1"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <button className="btn btn-primary w-100">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredAccommodations.length === 0 && (
          <div className="text-center py-5">
            <h3 className="text-muted">No accommodations found matching your criteria</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccommodationsPage;