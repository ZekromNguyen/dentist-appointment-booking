// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Payment.scss'; // Import SCSS file
// import { Button, Form } from 'react-bootstrap'; // Import Bootstrap components
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// const Payment = () => {
//   const location = useLocation();
//   const navigate = useNavigate(); // Initialize navigate hook
//   const [selectedMethod, setSelectedMethod] = useState('account'); // Set default selected method to 'account'
//   const [accountInfo, setAccountInfo] = useState({
//     accountHolderName: '',
//     accountNumber: '',
//     amount: ''
//   });
//   const { bookingDetails } = location.state;

//   const handlePayment = async () => {
//     try {
//       const saveData = bookingDetails.map(detail => ({
//         customerId: detail.customerId,
//         status: detail.status,
//         typeBook: detail.typeBook,
//         price: parseFloat(detail.price),
//         date: detail.date,
//         scheduleId: detail.ScheduleId
//       }));

//       const response = await axios.post('http://localhost:3000/booking', {
//         bookings: saveData
//       });

//       if (response.status === 200) {
//         alert('Booking successfully saved to database!');
//         setTimeout(() => {
//           navigate('/bookinghistory');
//         }, 2000); // Navigate to booking history after 2 seconds
//       } else {
//         throw new Error('Failed to save booking to database');
//       }
//     } catch (error) {
//       console.error('Error saving booking:', error);
//       alert('Failed to save booking to database');
//     }
//   };

//   const handleCancelPayment = () => {
//       navigate('/booking'); // Navigate to booking page after 2 seconds
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setAccountInfo({ ...accountInfo, [name]: value });
//   };

//   // Calculate total price
//   const totalPrice = bookingDetails.reduce((total, booking) => total + booking.price, 0);

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-12 mb-4 d-flex justify-content-between align-items-center">
//           <img
//             src="/public/clinic.png"
//             alt="Booking Summary Image"
//             className="img-fluid"
//             style={{ maxWidth: '60%' }}
//           />
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-md-8">
//           <div className="border1"> {/* Blue border for Booking Summary */}
//             <div className="booking-summary">
//               <h3>Booking Summary</h3>
//               <table className="table table-bordered">
//                 <thead>
//                   <tr>
//                     <th>Customer Name</th>
//                     <th>Dentist</th>
//                     <th>Date</th>
//                     <th>Slot Time</th>
//                     <th>Price</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookingDetails.map((details, index) => (
//                     <tr key={index}>
//                       <td>{details.customerName}</td>
//                       <td>{details.dentist}</td>
//                       <td>{details.date}</td>
//                       <td>{details.slotTime}</td>
//                       <td>{details.price.toLocaleString('vi-VN')} VNĐ</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div className="total-price-wrapper mt-0"> {/* Blue border for Total Price */}
//             <strong>Total Price:</strong> {totalPrice.toLocaleString('vi-VN')} VNĐ
//           </div>
//         </div>
//         <div className="col-md-4 p-0"> {/* Parent column */}
//           <div className="payment-method border2 p-0"> {/* Div with custom border for Payment Method */}
//             <div className="payment-header">
//               <img
//                 src="/Logo-VNPAY-QR.png"  // Thay đổi đường dẫn ảnh tại đây
//                 alt="Payment Method Image"
//                 className="img-fluid"
//               />
//             </div>
//             <div className="row mb-4">
//               <div className="col-6">
//                 <Button
//                   className={`btn btn-outline-primary w-100 ${selectedMethod === 'account' ? 'active' : ''}`}
//                   onClick={() => setSelectedMethod('account')}
//                 >
//                   Account
//                 </Button>
//               </div>
//               <div className="col-6">
//                 <Button
//                   className={`btn btn-outline-primary w-100 ${selectedMethod === 'qr' ? 'active' : ''}`}
//                   onClick={() => setSelectedMethod('qr')}
//                 >
//                   QR Code
//                 </Button>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-12">
//                 {selectedMethod === 'account' && (
//                   <Form>
//                     <Form.Group controlId="accountHolderName">
//                       <Form.Label>Account Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="accountHolderName"
//                         value={accountInfo.accountHolderName}
//                         onChange={handleChange}
//                         placeholder="Enter account name"
//                       />
//                     </Form.Group>
//                     <Form.Group controlId="accountNumber">
//                       <Form.Label>Account Number</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="accountNumber"
//                         value={accountInfo.accountNumber}
//                         onChange={handleChange}
//                         placeholder="Enter account number"
//                       />
//                     </Form.Group>
//                     <Form.Group controlId="amount">
//                       <Form.Label>Amount</Form.Label>
//                       <Form.Control
//                         type="number"
//                         name="amount"
//                         value={accountInfo.amount}
//                         onChange={handleChange}
//                         placeholder="Enter amount"
//                       />
//                     </Form.Group>
//                   </Form>
//                 )}
//                 {selectedMethod === 'qr' && (
//                   <div>
//                     <img src="/QR.jpg" alt="QR Code" className="img-fluid" />
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="row mt-4">
//               <div className="col-6">
//                 <Button className="btn btn-primary w-100" onClick={handlePayment}>
//                   Payment
//                 </Button>
//               </div>
//               <div className="col-6">
//                 <Button className="btn btn-secondary w-100" onClick={handleCancelPayment}>
//                   Cancel Payment
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payment;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.scss'; // Import SCSS file
import { Button, Form } from 'react-bootstrap'; // Import Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { ToastContainer, toast } from 'react-toastify'; // Import Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate hook
  const [selectedMethod, setSelectedMethod] = useState('account'); // Set default selected method to 'account'
  const [accountInfo, setAccountInfo] = useState({
    accountHolderName: '',
    accountNumber: '',
    amount: ''
  });
  const { bookingDetails } = location.state;

  const handleConfirmPayment = async () => {
    try {
      const saveData = bookingDetails.map(detail => ({
        customerId: detail.customerId,
        status: detail.status,
        typeBook: detail.typeBook,
        price: parseFloat(detail.price),
        date: detail.date,
        scheduleId: detail.ScheduleId
      }));

      const response = await axios.post('http://localhost:3000/booking', {
        bookings: saveData
      });

      if (response.status === 200) {
        toast.success('Confirm Booking successfully!', {
          position: "top-right",
          autoClose: 2000, // Thời gian hiển thị 2 giây
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate('/bookinghistory');
        }, 2000); // Navigate to booking history after 2 seconds
      } else {
        throw new Error('Failed to save booking to database');
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error('Failed to save booking to database', {
        position: "top-right",
        autoClose: 2000, // Thời gian hiển thị 2 giây
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleCancelPayment = () => {

    toast.success('Cancel Payment!', {
      position: "top-right",
      autoClose: 2000, // Thời gian hiển thị 2 giây
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      navigate('/booking');
    }, 2000); // Đợi 2 giây trước khi chuyển trang
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAccountInfo({ ...accountInfo, [name]: value });
  };

  // Calculate total price
  const totalPrice = bookingDetails.reduce((total, booking) => total + booking.price, 0);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12 mb-4 d-flex justify-content-between align-items-center">
          <img
            src="/public/clinic.png"
            alt="Booking Summary Image"
            className="img-fluid"
            style={{ maxWidth: '60%' }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <div className="border1"> {/* Blue border for Booking Summary */}
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Dentist</th>
                    <th>Date</th>
                    <th>Slot Time</th>
                    <th>Price</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="total-price-wrapper mt-0"> {/* Blue border for Total Price */}
            <strong>Total Price:</strong> {totalPrice.toLocaleString('vi-VN')} VNĐ
          </div>
        </div>
        <div className="col-md-4 p-0"> {/* Parent column */}
          <div className="payment-method border2 p-0"> {/* Div with custom border for Payment Method */}
            <div className="payment-header">
              <img
                src="/Logo-VNPAY-QR.png"  // Thay đổi đường dẫn ảnh tại đây
                alt="Payment Method Image"
                className="img-fluid"
              />
            </div>
            <div className="row mb-4">
              <div className="col-6">
                <Button
                  className={`btn btn-outline-primary w-100 ${selectedMethod === 'account' ? 'active' : ''}`}
                  onClick={() => setSelectedMethod('account')}
                >
                  Account
                </Button>
              </div>
              <div className="col-6">
                <Button
                  className={`btn btn-outline-primary w-100 ${selectedMethod === 'qr' ? 'active' : ''}`}
                  onClick={() => setSelectedMethod('qr')}
                >
                  QR Code
                </Button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {selectedMethod === 'account' && (
                  <Form>
                    <Form.Group controlId="accountHolderName">
                      <Form.Label>Account Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="accountHolderName"
                        value={accountInfo.accountHolderName}
                        onChange={handleChange}
                        placeholder="Enter account name"
                      />
                    </Form.Group>
                    <Form.Group controlId="accountNumber">
                      <Form.Label>Account Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="accountNumber"
                        value={accountInfo.accountNumber}
                        onChange={handleChange}
                        placeholder="Enter account number"
                      />
                    </Form.Group>
                    <Form.Group controlId="amount">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        name="amount"
                        value={accountInfo.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                      />
                    </Form.Group>
                  </Form>
                )}
                {selectedMethod === 'qr' && (
                  <div>
                    <img src="/QR.jpg" alt="QR Code" className="img-fluid" />
                  </div>
                )}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-6">
                <Button className="btn btn-primary w-100" onClick={handleConfirmPayment}>
                  Confirm Payment
                </Button>
              </div>
              <div className="col-6">
                <Button className="btn btn-secondary w-100" onClick={handleCancelPayment}>
                  Cancel Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer */}
    </div>
  );
};

export default Payment;

