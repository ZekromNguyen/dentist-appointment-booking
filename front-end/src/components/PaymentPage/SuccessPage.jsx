import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../ServiceSystem/axios";
import { toast } from "react-toastify";
import './success.scss'; // Import SCSS file

const SuccessPage = () => {
  const [bill, setBill] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const UpdateStatusBooking = async () => {
      try {
        const BookingID = localStorage.getItem("bookingID");
        const updateStatus = {
          BookingID: BookingID,
          Status: "Confirmed",
        };

        const response = await axios.put(
          `${BASE_URL}/booking/updateStatus`,
          updateStatus
        );

        if (response.status === 200) {
          const Booking = response.data.updateBooking;
          setBill(Booking);
          toast.success("Booking status updated successfully.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          throw new Error("Failed to update booking status.");
        }
      } catch (error) {
        console.error("Error update booking status:", error);
        toast.error("Failed to update booking status.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    if (!hasFetched) {
      UpdateStatusBooking();
      setHasFetched(true);
    }
  }, [hasFetched]);

  return (
    <div className="success-container">
      <div className="invoice-header">
        <h2>Payment Successful!</h2>
      </div>

      {bill && (
        <div className="invoice-details">
          <h3>Booking Details</h3>
          <p>Booking ID: {bill.BookingID}</p>
          <p>Customer ID: {bill.CustomerID}</p>
          <p>Status: {bill.Status}</p>
          <p>Total Money: {bill.TotalPrice}</p>
        </div>
      )}
      <p>Thank you for your payment.</p>

      <Link to="/" className="btn btn-primary">
        Go to Home
      </Link>
    </div>
  );
};

export default SuccessPage;
