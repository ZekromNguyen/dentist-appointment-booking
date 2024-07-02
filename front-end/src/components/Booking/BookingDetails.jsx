
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BookingDetails.scss'; // Import CSS

const BookingDetails = ({ show, handleClose, bookingDetails, onCancelBooking }) => {
  const navigate = useNavigate(); // Initialize navigate hook

  if (!bookingDetails || bookingDetails.length === 0) return null;

  

  const handlePayment = () => {
    // Hiển thị thông báo thành công
    toast.success('Booking appointment successful!', {
      position: "top-right",
      autoClose: 2000, // Thời gian hiển thị 2 giây
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Redirect to payment page using navigate
    setTimeout(() => {
      navigate('/payment', { state: { bookingDetails } });
    }, 2000); // Đợi 2 giây trước khi chuyển trang
  };

  const handleCancelBooking = (details) => {
    onCancelBooking(details);
    // Hiển thị thông báo hủy đặt lịch
    toast.info('Booking cancelled!', {
      position: "top-right",
      autoClose: 2000, // Thời gian hiển thị 2 giây
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleModalClose = () => {
    handleClose(); // Đóng modal
    window.location.reload(); // Tải lại trang sau khi đóng modal
  };

  return (
    <>
      <Modal show={show} onHide={handleModalClose} size="lg" className="booking-details-modal">
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
                    <Button variant="danger" className="cancel-booking-btn" onClick={() => handleCancelBooking(details)}>
                      Cancel Booking
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div>
            Total Price: {bookingDetails.reduce((total, booking) => total + booking.price, 0).toLocaleString('vi-VN')} VNĐ
          </div>
          <div>
            <Button variant="primary" onClick={handlePayment} className="small-button">
              Payment
            </Button>
            <Button variant="secondary" onClick={handleModalClose} className="small-button">
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default BookingDetails;



