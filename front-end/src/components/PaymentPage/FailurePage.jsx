import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, json } from 'react-router-dom';
import './fail.scss'; // Import SCSS file
import BASE_URL from "../../ServiceSystem/axios";

const FailurePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //const bookingId = new URLSearchParams(location.search).get('bookingId');
  const bookingId = JSON.parse(localStorage.getItem('bookingID'));
  console.log(bookingId);
  useEffect(() => {
    const updateBookingStatus = async () => {
      if (bookingId) {
        try {
          const response = await axios.post(`${BASE_URL}/update-status-cancelled`, { bookingId });
          console.log("Update response:", response.data);
        } catch (error) {
          console.error("Error updating booking status:", error);
        }
      }
    };

    updateBookingStatus();
  }, [bookingId]);
  return (
    <div className="failure-container">
      <div className="failure-header">
        <h2>Payment Failed!</h2>
      </div>
      <div className="failure-message">
        <p>Sorry, your payment did not go through.</p>
      </div>
      <button onClick={() => navigate('/home')} className="go-home-button">
        Go to Home
      </button>
    </div>
  );
};

export default FailurePage;
