import React from 'react';
import './fail.scss'; // Import SCSS file

const FailurePage = () => {
  return (
    <div className="failure-container">
      <div className="failure-header">
        <h2>Payment Failed!</h2>
      </div>
      <div className="failure-message">
        <p>Sorry, your payment did not go through.</p>
      </div>
      <a href="/" className="retry-button">
        Try Again
      </a>
    </div>
  );
};

export default FailurePage;
