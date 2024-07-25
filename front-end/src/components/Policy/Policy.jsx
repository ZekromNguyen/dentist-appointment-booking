import React from 'react';
import './Policy.scss'; // Make sure you have the styles.scss file to apply the styles
import Header from '../Header/Header';

function Policy() {
  return (
    <div className="policy-container">
      <div><Header /> </div>
      <header className="policy-header1">
        <h1>Policy</h1>
      </header>
      
      <main className="policy-main-content">
        <section className="policy-section">
          <h2 className="policy-heading">A. Payment Rules and Methods</h2>
          <p className="policy-text">When using services at the clinic, customers will pay directly to the cashier.</p>
          <p className="policy-text">If customers book an appointment online through the website, payment will be made through the VNPay wallet.</p>
          <p className="policy-text">Note: If a customer has booked an appointment on the website but cannot come to the clinic at the scheduled time for personal reasons, the deposit will not be refunded.</p>
        </section>
        
        <section className="policy-section">
          <h2 className="policy-heading">B. Service Use Policy</h2>
          <p className="policy-text">Customers must come directly to the clinic to use the services.</p>
        </section>
        
        <section className="policy-section">
          <h2 className="policy-heading">C. Refund Policy</h2>
          <p className="policy-text">If a doctor has been scheduled but cannot see the customer for any reason, the clinic will contact the customer to propose a solution based on the registered information:</p>
          <ol className="policy-list">
            <li className="policy-list-item">The clinic will request customer information to process a full refund.</li>
          </ol>
        </section>
        
        <section className="policy-section">
          <h2 className="policy-heading">D. Privacy Policy</h2>
          <h3 className="policy-subheading">1. Purpose and Scope of Information Collection</h3>
          <p className="policy-text">We are very committed to our privacy policy and promise not to sell, share, or exchange customers' personal information with third parties. The personal information collected will only be used internally. The personal information we collect includes:</p>
          <ul className="policy-list">
            <li className="policy-list-item">Full Name</li>
            <li className="policy-list-item">Email Address</li>
            <li className="policy-list-item">Phone Number</li>
            <li className="policy-list-item">Contact Subject</li>
            <li className="policy-list-item">Contact Content</li>
          </ul>
          <p className="policy-text">This information may be used for the following purposes:</p>
          <ul className="policy-list">
            <li className="policy-list-item">Providing and consulting information related to our services.</li>
            <li className="policy-list-item">Guiding customers on how to register for services online via phone.</li>
          </ul>
          
          <h3 className="policy-subheading">2. Scope of Information Use</h3>
          <p className="policy-text">Customers' personal information is only used within our organization.</p>
          
          <h3 className="policy-subheading">3. Information Retention Period</h3>
          <p className="policy-text">We will store customers' personal information on our internal systems for the duration of providing services or until the customer requests to delete the information provided.</p>
        </section>
      </main>
    </div>
  );
}

export default Policy;
