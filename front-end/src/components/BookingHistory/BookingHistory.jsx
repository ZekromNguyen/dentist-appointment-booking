
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import './BookingHistory.scss'; // Import SCSS file

const BookingHistory = () => {
  const [bookingData, setBookingData] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState({
    date: new Date().toLocaleDateString('en-US'),
    time: new Date().toLocaleTimeString('en-US')
  });
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null); // State for selected booking details
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

  const account = localStorage.getItem('account');
  const customerId = account ? JSON.parse(account).customerId : null;
  const customerName = account ? JSON.parse(account).user : null;

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        if (customerId) {
          const response = await axios.get('http://localhost:3000/getAllBookingByCustomerId', {
            params: { customerId }
          });
          if (response.data.message === 'Success') {
            // Sort booking data by DateBook in descending order
            const sortedBookings = response.data.bookings.sort((a, b) => 
              new Date(b.BookingDetails[0]?.DateBook) - new Date(a.BookingDetails[0]?.DateBook)
            );
            setBookingData(sortedBookings); // Save sorted booking data to state
          } else {
            setBookingData([]); // Clear booking data if not found
          }
        }
      } catch (error) {
        console.error('Error fetching booking history:', error);
      }
    };

    fetchBookingData();
  }, [customerId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDateTime({
        date: now.toLocaleDateString('en-US'),
        time: now.toLocaleTimeString('en-US')
      });
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const formatPrice = (price) => {
    const parsedPrice = parseFloat(price);
    return `${parsedPrice.toLocaleString('vi-VN')} VNĐ`;
  };

  const formatDateAndTime = (dateString) => {
    const date = new Date(dateString);
    return {
      formattedDate: date.toLocaleDateString('en-US', { timeZone: 'UTC' }),
      formattedTime: date.toLocaleTimeString('en-US', { timeZone: 'UTC' })
    };
  };

  const handleShowModal = (booking) => {
    setSelectedBookingDetails(booking.BookingDetails || []);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBookingDetails(null);
  };

  return (
    <Container className="booking-history-container mt-4">
      {/* Top Row */}
      <Row className="header-row mb-3">
        <Col>
          <h2>Booking History</h2>
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <Form.Control type="text" placeholder="Search..." style={{ width: '200px' }} />
        </Col>
      </Row>

      {/* Display Current Date and Time */}
      <Row className="mb-3">
        <Col>
          <div>
            <strong>Current Date:</strong> {currentDateTime.date}
          </div>
          <div>
            <strong>Current Time:</strong> {currentDateTime.time}
          </div>
        </Col>
      </Row>

      {/* Booking History Table */}
      <Row>
        <Col>
          <div className="table-scroll">
            <Table bordered hover>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Customer Name</th>
                  <th style={{ textAlign: 'center' }}>DateBook</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Price</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookingData.map((booking) => {
                  const { formattedDate, formattedTime } = formatDateAndTime(booking.BookingDetails[0]?.DateBook || '');
                  return (
                    <tr key={booking.BookingID}>
                      <td style={{ textAlign: 'center' }}>{customerName}</td>
                      <td style={{ textAlign: 'center' }}>
                        {formattedDate} <br /> {formattedTime}
                      </td>
                      <td style={{ textAlign: 'center' }}>{booking.Status}</td>
                      <td style={{ textAlign: 'center' }}>{formatPrice(booking.TotalPrice)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Button 
                          variant="info" 
                          onClick={() => handleShowModal(booking)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* Booking Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered striped>
            <thead>
              <tr>
                <th>Dentist Name</th>
                <th>Available Slot Time</th>
                <th>Medical Day</th>
                <th>Day of Week</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedBookingDetails && selectedBookingDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.DentistSchedule?.Dentist?.DentistName}</td>
                  <td>{detail.DentistSchedule?.AvailableSlot?.Time}</td>
                  <td>{new Date(detail.MedicalDay).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                  <td>{detail.DentistSchedule?.DayOfWeek}</td>
                  <td>{detail.TypeBook}</td>
                  <td>{detail.Status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookingHistory;

