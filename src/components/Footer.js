import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="mb-4">About Us</h5>
            <p className="text-muted">We are dedicated to providing unforgettable travel experiences and helping you discover the world's most amazing destinations.</p>
          </div>
          <div className="col-lg-4 col-md-6">
            <h5 className="mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none hover-light">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/destinations" className="text-muted text-decoration-none hover-light">Destinations</Link>
              </li>
              <li className="mb-2">
                <Link to="/booking" className="text-muted text-decoration-none hover-light">Book Now</Link>
              </li>
              <li className="mb-2">
                <Link to="/profile" className="text-muted text-decoration-none hover-light">My Account</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h5 className="mb-4">Contact Us</h5>
            <div className="text-muted">
              <p className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                123 Travel Street, City, Country
              </p>
              <p className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                info@travelwebsite.com
              </p>
              <p className="mb-4">
                <i className="bi bi-telephone me-2"></i>
                +1 234 567 890
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted me-3"><i className="bi bi-facebook"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted me-3"><i className="bi bi-twitter"></i></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted me-3"><i className="bi bi-instagram"></i></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4 bg-secondary" />
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-muted">© 2024 Travel Website. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link to="/privacy" className="text-muted text-decoration-none me-3">Privacy Policy</Link>
            <Link to="/terms" className="text-muted text-decoration-none">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;