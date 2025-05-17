import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import BookingManagement from './pages/BookingManagement';
import UserProfile from './pages/UserProfile';
import DestinationDetail from './pages/DestinationDetail';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AccommodationsPage from './pages/AccommodationsPage';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/my-bookings" element={<BookingManagement />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/accommodations" element={<AccommodationsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
<Route path="/my-bookings" element={<BookingManagement />} />
