

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './BookingDetails.scss'; // Import CSS

const BookingDetails = ({ show, handleClose, bookingDetails, onCancelBooking }) => {
  if (!bookingDetails || bookingDetails.length === 0) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="booking-details-modal">
      <Modal.Header closeButton>
        <Modal.Title>Booking Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Dentist</th>
              <th>Date</th>
              <th>Slot Time</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookingDetails.map((details, index) => (
              <tr key={index}>
                <td>{details.customerName}</td>
                <td>{details.dentist}</td>
                <td>{details.date}</td>
                <td>{details.slotTime}</td>
                <td>{details.price.toLocaleString('vi-VN')} VNĐ</td>
                <td>
                  <Button variant="danger" className="cancel-booking-btn" onClick={() => onCancelBooking(details)}>
                    Cancel Booking
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
       
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingDetails;


