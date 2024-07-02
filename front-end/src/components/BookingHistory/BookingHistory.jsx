
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Table, Button, Modal } from 'react-bootstrap';
import './BookingHistory.scss'; // Import SCSS file
import axios from 'axios';

const BookingHistory = () => {
  const [bookingData, setBookingData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState({
    date: new Date().toLocaleDateString('en-US'),
    time: new Date().toLocaleTimeString('en-US')
  });
  const account = localStorage.getItem('account');
  const customerId = account ? JSON.parse(account).customerId : null;
  const customerName = account ? JSON.parse(account).user : null;

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        // Call API to get booking data
        const response = await axios.get('http://localhost:3000/bookings');
        // Filter booking data by customerId
        const filteredData = response.data.filter((booking) => booking.CustomerID === customerId);
        setBookingData(filteredData); // Save filtered data to state
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

  const handleViewDetails = async (bookingId) => {
    try {
      // Fetch booking details for the selected booking
      const response = await axios.get(`http://localhost:3000/bookingdetails/${bookingId}`);
      setBookingDetails(response.data);
      setSelectedBooking(bookingId); // Set the selected booking ID
      setShowDetails(true); // Show the modal with booking details
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  const handleCloseDetails = () => setShowDetails(false);

  const formatPrice = (price) => {
    const parsedPrice = parseFloat(price);
    return `${parsedPrice.toLocaleString('vi-VN')} VNĐ`;
  };

  // Function to format ISO date string into separate date and time with labels and line breaks
  const formatDateAndTime = (isoString) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString('en-US'); // Format date as MM/DD/YYYY
    const formattedTime = date.toLocaleTimeString('en-US'); // Format time as HH:MM:SS
    return { formattedDate, formattedTime };
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

      {/* Bottom Row */}
      <Row>
        <Col>
          <div className="table-scroll">
            <Table bordered hover>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Customer Name</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Price</th>
                  <th style={{ textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {bookingData.map((booking, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{customerName}</td>
                    <td style={{ textAlign: 'center' }}>{booking.Status}</td>
                    <td style={{ textAlign: 'center' }}>{formatPrice(booking.TotalPrice)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <Button variant="info" onClick={() => handleViewDetails(booking.BookingID)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* Booking Details Modal */}
      <Modal show={showDetails} onHide={handleCloseDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details for {customerName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingDetails.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>DateBook</th>
                  <th>TypeBook</th>
                  <th>Status</th>
                  <th>PriceBooking</th>
                  <th>MedicalDay</th>
                </tr>
              </thead>
              <tbody>
                {bookingDetails.map((detail, index) => (
                  <tr key={index}>
                    <td>{detail.DateBook}</td>
                    <td>{detail.TypeBook}</td>
                    <td>{detail.Status}</td>
                    <td>{formatPrice(detail.PriceBooking)}</td>
                    <td>{detail.MedicalDay}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No details available for this booking.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookingHistory;



