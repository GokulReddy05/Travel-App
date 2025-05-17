import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('profile');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debug log
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        console.log('Making API call...'); // Debug log
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('API Response:', response.data); // Debug log
        
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Profile loading error:', err.response || err); // Enhanced error logging
        setError('Failed to load profile. Please try again.');
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="btn btn-link"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Please log in to view your profile.
          <button
            onClick={() => navigate('/login')}
            className="btn btn-link"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Left Sidebar - Profile Card */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body text-center p-4" style={{ background: 'linear-gradient(to bottom, #0d6efd, #0a58ca)' }}>
              <div className="mb-4">
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-white" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-person text-primary" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h5 className="card-title mb-1 text-white">{user.full_name}</h5>
                <p className="text-white-50 small mb-0">{user.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-light btn-sm w-100"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          </div>

          <div className="list-group shadow-sm rounded-3 overflow-hidden">
            <button
              onClick={() => setSelectedTab('profile')}
              className={`list-group-item list-group-item-action border-0 py-3 ${
                selectedTab === 'profile' ? 'active bg-primary text-white' : ''
              }`}
            >
              <i className={`bi bi-person-badge me-2 ${selectedTab === 'profile' ? 'text-white' : 'text-primary'}`}></i>
              Profile
            </button>
            <button
              onClick={() => setSelectedTab('bookings')}
              className={`list-group-item list-group-item-action border-0 py-3 ${
                selectedTab === 'bookings' ? 'active bg-primary text-white' : ''
              }`}
            >
              <i className={`bi bi-calendar-check me-2 ${selectedTab === 'bookings' ? 'text-white' : 'text-primary'}`}></i>
              My Bookings
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              {selectedTab === 'profile' && (
                <div>
                  <div className="d-flex align-items-center mb-4">
                    <h3 className="mb-0">Profile Information</h3>
                    <span className="badge bg-success ms-3">Verified</span>
                  </div>
                  <form>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control bg-light"
                            id="fullName"
                            value={user.full_name || ''}
                            readOnly
                          />
                          <label htmlFor="fullName">Full Name</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="email"
                            className="form-control bg-light"
                            id="email"
                            value={user.email || ''}
                            readOnly
                          />
                          <label htmlFor="email">Email</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="tel"
                            className="form-control bg-light"
                            id="phone"
                            value={user.phone || ''}
                            readOnly
                          />
                          <label htmlFor="phone">Phone</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control bg-light"
                            id="memberSince"
                            value={user.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                            readOnly
                          />
                          <label htmlFor="memberSince">Member Since</label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {selectedTab === 'bookings' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0">My Bookings</h3>
                    <button
                      onClick={() => navigate('/my-bookings')}
                      className="btn btn-primary d-flex align-items-center"
                    >
                      <i className="bi bi-calendar2-week me-2"></i>
                      View All Bookings
                    </button>
                  </div>
                  <div className="text-center py-5 text-muted">
                    
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;