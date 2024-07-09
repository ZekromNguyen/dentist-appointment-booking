
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingPage.scss';
import homeIcon from '/Homee.png';
import bookingIcon from '/BookNoww.png';
import paymentIcon from '/History.png';
import historyIcon from '/History.png';
import logoutIcon from '/logout.png';
import bookingpageIcon from '/img-logo-home.jpg';
import goback from '/GoBack.png';
import Booking from '../Booking/Booking'; // Import the BookingComponent
import Payment from '../PaymentPage/Payment';
import { checkSession,logout } from '../../Service/userService';
import BookingHistory from '../BookingHistory/BookingHistory';

function BookingPage() {
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false); // State to control Booking component display
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState(''); // State to hold customer name
  const [showBookingHistory, setShowBookingHistory] = useState(false); // State to control BookingHistory component display

  useEffect(() => {
    // Check session when component mounts
    const fetchSession = async () => {
      const customerId = await checkSession();
      if (customerId === null) {
        setCustomerId(null);
        navigate('/login');
      }
      if (customerId) {
        setCustomerId(customerId);
        const storedData = JSON.parse(localStorage.getItem('account'));
        if (storedData && storedData.user) {
          setCustomerName(storedData.user);
        }
      }
    };
    fetchSession();
  }, []);

  const handleGoBack = () => {
    navigate('/'); // Navigate to the homepage
  };

  const handleLogout = () => {
    localStorage.removeItem('account');
    logout();
    navigate('/login'); // Navigate to the login page
  };

  const handleHomeClick = () => {
    window.location.reload(); // Reload the page
  };

  const handleBookingClick = () => {
    setShowBooking(true); // Show Booking component when Booking button is clicked
    setShowBookingHistory(false); // Hide BookingHistory component
  };

  const handleBookingHistoryClick = () => {
    setShowBookingHistory(true); // Show BookingHistory component when BookingHistory button is clicked
    setShowBooking(false); // Hide Booking component
  };

  return (
    <div className="container-fluid homepage">
      <div className="row custom-row">
        {/* Sidebar */}
        <div className="col-md-3 sidebar bg-light">
          <div className="nav flex-column nav-pills">
            <a className="nav-link active" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
              <img src={homeIcon} alt="Home" className="icon" /> Home
            </a>
            <a className="nav-link" onClick={handleBookingClick} style={{ cursor: 'pointer' }}>
              <img src={bookingIcon} alt="Booking" className="icon" /> Booking Now
            </a>
            <a className="nav-link" href="#">
              <img src={paymentIcon} alt="Payment" className="icon" /> Payment History
            </a>
            <a className="nav-link" onClick={handleBookingHistoryClick} style={{ cursor: 'pointer' }}>
              <img src={historyIcon} alt="Booking History" className="icon" /> Booking History
            </a>
            <a className="nav-link" onClick={handleGoBack} style={{ cursor: 'pointer' }}>
              <img src={goback} alt="Go Back" className="icon" /> Go Back
            </a>
            <a className="nav-link logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <img src={logoutIcon} alt="Logout" className="icon" /> Logout
            </a>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9 content">
          <div className="header-section">
            <h1>Welcome ,{customerName}</h1>
          </div>
          <div className="body-section">
            {showBooking && <Booking />}
            {showBookingHistory && <BookingHistory />}

            {!showBooking && !showBookingHistory && (
              <img src={bookingpageIcon} alt="Booking Image" className="booking-image" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;


