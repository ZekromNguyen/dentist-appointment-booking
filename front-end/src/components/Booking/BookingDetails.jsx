import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BookingDetails.scss"; // Import CSS
import axios from "axios";
import BASE_URL from "../../ServiceSystem/axios";

const BookingDetails = ({
  show,
  handleClose,
  bookingDetails,
  onCancelBooking,
}) => {
  const navigate = useNavigate(); // Initialize navigate hook
  const totalPrice = bookingDetails.reduce(
    (total, booking) => total + booking.price,
    0
  );
  const bankCode = "ncb";
  localStorage.setItem("totalPrice", totalPrice);
  if (!bookingDetails || bookingDetails.length === 0) return null;

  const handlePayment = async () => {
    try {
      const bookings = JSON.parse(localStorage.getItem("bookings"));
      if (bookings && bookings.length > 0) {
        const saveData = bookings.map((detail) => ({
          customerId: detail.customerId,
          status: detail.status,
          typeBook: detail.typeBook,
          price: parseFloat(detail.price),
          priceBooking: parseFloat(detail.priceBooking),
          date: detail.date,
          scheduleId: detail.ScheduleId,
          recurringType: detail.RecurringType,
          recurringEndDate: detail.RecurringEndDate
        }));
        const totalPrice = localStorage.getItem("totalPrice");
        const booking = {
          customerId: saveData[0].customerId,
          status: saveData[0].status,
          totalPrice: totalPrice,
        };
        // Thực hiện gọi API để lưu booking
        const response1 = await axios.post(`${BASE_URL}/booking`, {
          bookings: saveData,
          booking: booking,
        });
        if (response1.status === 200) {
          const BookingID = response1.data.booking.BookingID;
          localStorage.setItem("bookingID", BookingID);
          localStorage.removeItem("bookings");
        }
      }
      const BookingID = localStorage.getItem("bookingID");
      const response = await axios.post(
        `${BASE_URL}/order/create_payment_url`,
        {
          amount: totalPrice,
          bankCode,
          BookingID,
        },
        { withCredentials: true }
      );

      // Hiển thị thông báo thành công
      toast.success("Booking appointment successful!", {
        position: "top-right",
        autoClose: 2000, // Thời gian hiển thị 2 giây
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect to the payment URL
      window.location.href = response.data; // Giả sử backend gửi lại một URL để chuyển hướng đến
    } catch (error) {
      console.error("Error during payment:", error);
      // Xử lý lỗi ở đây (ví dụ: hiển thị thông báo lỗi)
      toast.error("Payment failed. Please try again later.", {
        position: "top-right",
        autoClose: 5000, // Hiển thị thông báo lỗi trong 5 giây
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleCancelBooking = (details) => {
    onCancelBooking(details);
    // Hiển thị thông báo hủy đặt lịch
    toast.info("Booking cancelled!", {
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
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleModalClose}
        size="lg"
        className="booking-details-modal"
      >
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
                <th>Type</th>
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
                  <td>
                    {details.RecurringType === "None" && "Slot"}
                    {details.RecurringType === "Weekly" && "Weekly"}
                    {details.RecurringType === "Monthly" && "Monthly"}
                  </td>
                  <td>{details.price.toLocaleString("vi-VN")} VNĐ</td>
                  <td>
                    <Button
                      variant="danger"
                      className="cancel-booking-btn"
                      onClick={() => handleCancelBooking(details)}
                    >
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
            Total Price:{" "}
            {bookingDetails
              .reduce((total, booking) => total + booking.price, 0)
              .toLocaleString("vi-VN")}{" "}
            VNĐ
          </div>
          <div>
            <Button
              variant="primary"
              onClick={handlePayment}
              className="small-button"
            >
              Payment
            </Button>
            <Button
              variant="secondary"
              onClick={handleModalClose}
              className="small-button"
            >
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
