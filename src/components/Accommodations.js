import React from 'react';
import { useNavigate } from 'react-router-dom';

const Accommodations = () => {
  const navigate = useNavigate();

  const handleViewOptions = (type) => {
    navigate('/accommodations', { state: { type } });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Find Perfect Accommodations</h2>
          <p className="text-gray-600">Choose from a variety of stays that suit your style and budget</p>
        </div>
        
        <div className="row g-4">
          {/* Luxury Hotels */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945" 
                className="card-img-top h-48 object-cover" 
                alt="Luxury Hotel"
              />
              <div className="card-body">
                <h5 className="card-title font-bold mb-2">Luxury Hotels</h5>
                <p className="card-text text-gray-600 mb-3">Experience world-class service and amenities in our carefully selected luxury hotels.</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-blue-600 font-semibold">From $299/night</span>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleViewOptions('luxury')}
                  >
                    View Options
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Boutique Hotels */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <img 
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4" 
                className="card-img-top h-48 object-cover" 
                alt="Boutique Hotel"
              />
              <div className="card-body">
                <h5 className="card-title font-bold mb-2">Boutique Hotels</h5>
                <p className="card-text text-gray-600 mb-3">Discover unique and charming boutique hotels with personalized service.</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-blue-600 font-semibold">From $199/night</span>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleViewOptions('boutique')}
                  >
                    View Options
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Apartments */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <img 
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688" 
                className="card-img-top h-48 object-cover" 
                alt="Apartment"
              />
              <div className="card-body">
                <h5 className="card-title font-bold mb-2">Apartments</h5>
                <p className="card-text text-gray-600 mb-3">Feel at home with spacious apartments perfect for families and longer stays.</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-blue-600 font-semibold">From $149/night</span>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleViewOptions('apartment')}
                  >
                    View Options
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <br></br>
          <button 
            className="btn btn-primary px-6 py-2"
            onClick={() => navigate('/accommodations')}
          >
            Browse All Accommodations
          </button>
        </div>
      </div>
    </section>
  );
};

export default Accommodations;