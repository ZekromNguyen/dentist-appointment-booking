// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Booking.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// const Booking = () => {
//   const [dentists, setDentists] = useState([]);
//   const [selectedDentist, setSelectedDentist] = useState('');
//   const [selectedDate, setSelectedDate] = useState('currentDate');
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [selectedTime, setSelectedTime] = useState('');
//   const [customerid, setCustomerId] = useState('');
//   const [BookingMessage, setBookingMessage] = useState('');
//   const [appointments, setAppointments] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [error, setError] = useState('');
//   const [bookingDetails, setBookingDetails] = useState(null); // State to manage booking details
//   const currentDate = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại (định dạng ISO)


//   //Get API All Dentist
//   useEffect(() => {
//     const fetchDentists = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/getAllDentists');
//         setDentists(Array.isArray(response.data.dentists) ? response.data.dentists : []);

//       } catch (error) {
//         console.error('Error fetching dentists:', error);
//       }
//     };

//     fetchDentists();
//   }, []);

//   //API Get Slot By Date And DentistName
//   useEffect(() => {
//     const fetchAvailableSlots = async () => {
//       if (selectedDentist && selectedDate) {
//         try {
//           const formattedDate = selectedDate;
//           const response = await axios.get(`http://localhost:3000/slotsByDate`,
//             {
//               params: {
//                 dentistID: selectedDentist,
//                 date: formattedDate
//               }
//             }
//           );

//           if (!response.status === 200) {
//             throw new Error('Failed to fetch slots');
//           }

//           setAvailableSlots(response.data);
//           setError('');
//         } catch (error) {
//           console.error('Error fetching slots:', error);
//           setError('Error fetching slots');
//         }
//       }
//     };
//     fetchAvailableSlots();
//   }, [selectedDentist, selectedDate]);

//   //Get API getCustomerId
//   useEffect(() => {
//     const fetchCustomerID = async () => {
//       try {
//         const account = JSON.parse(localStorage.getItem('account'));
//         if (account && account.id) {
//           const response = await axios.get('http://localhost:3000/getCustomerId', {
//             params: { AccountID: account.id }
//           });
//           setCustomerId(response.data);

//         } else {
//           setCustomerId(''); // Nếu không có dữ liệu, set customerId thành rỗng
//         }
//       }

//       catch (error) {
//         console.error('Error fetching customer ID:', error);
//         setCustomerId('');
//       }
//     };
//     fetchCustomerID();
//   }, []);


//   // Get API ScheduleID list
//   useEffect(() => {
//     const fetchSchedules = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/scheduleDentist');
//         console.log('Schedule', response.data);
//         setSchedules(Array.isArray(response.data) ? response.data : []);
//       } catch (error) {
//         console.error('Error fetching schedules:', error);
//       }
//     };

//     fetchSchedules();
//   }, []);




//   const handleTimeClick = (slotId, scheduleId) => {
//     setSelectedTime(scheduleId);
//   };

//   const handleDateChange = (e) => {
//     const selected = e.target.value;
//     // Kiểm tra nếu ngày được chọn lớn hơn ngày hiện tại
//     if (selected >= currentDate) {
//       setSelectedDate(selected);
//     } else {
//       alert('Vui lòng chọn một ngày sau ngày hiện tại.');

//     }
//   };

//   const handleBooking = async () => {
//     try {
//       const currentDateTime = new Date();
//       const currentDateTimeGMT7 = new Date(currentDateTime.getTime() + 7 * 60 * 60 * 1000);


//       const response = await axios.post('http://localhost:3000/booking', {
//         customerId: customerid.customerId,
//         status: "Pending",
//         typeBook: "InDay",
//         price: parseFloat(100000),
//         dentist: selectedDentist,
//         date: selectedDate,
//         slotId: selectedTime
//       });

//       if (response.status === 200) {
//         setBookingMessage('Booking successfully created!');
//         // Reset form or clear input fields
//         setSelectedDentist('');
//         setSelectedDate('');
//         setSelectedTime('');
//       } else {
//         setBookingMessage('Failed to create booking');
//       }
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       setBookingMessage('Error creating booking');
//     }
//   };

//   return (
//     <div className="container booking-schedule-container">
//       <div className="header">
//         <h1>Booking Schedule</h1>
//         <Link to="/" className="go-back-btn">Go Back</Link> {/* Link for Go Back button */}
//       </div>
//       <div className="booking-form">


//         <label>Select Date:</label>
//         <input
//           id="dateSelect"
//           type="date"
//           className="form-control"
//           value={selectedDate}
//           onChange={handleDateChange}
//         />

//         <label>Select Dentist:</label>
//         <select
//           id="dentistSelect"
//           className="form-control"
//           value={selectedDentist}
//           onChange={(e) => {
//             setSelectedDentist(e.target.value);
//             console.log('Selected Dentist ID:', e.target.value);
//           }}
//         >
//           <option value="">Chọn bác sĩ</option>
//           {dentists.map((dentist) => (
//             <option key={dentist.DentistID} value={dentist.DentistID}>
//               {dentist.DentistName}
//             </option>
//           ))}
//         </select>



//         {/* <label>Select Time:</label>
//         <div className="time-slots">
//           {availableSlots.map((availableslot) => (
//             <div
//               key={availableslot.SlotID}
//               className={`hour-slot ${selectedTime === availableslot.SlotID ? 'selected' : ''}`}
//               onClick={() => handleTimeClick(availableslot.SlotID)}
//             >
//               {availableslot.AvailableSlot.Time}
//             </div>
//           ))}
//         </div> */}
//         <label>Select Time:</label>
//         <div className="time-slots">
//           {availableSlots.map((availableslot) => (
//             <div
//               key={availableslot.SlotID}
//               className={`hour-slot ${selectedTime === availableslot.ScheduleID ? 'selected' : ''}`}
//               onClick={() => handleTimeClick(availableslot.SlotID, availableslot.ScheduleID)}
//             >
//               {availableslot.AvailableSlot.Time}
//             </div>
//           ))}
//         </div>
//         <label>Price Booking</label>


//         <button className="btn" onClick={handleBooking}>
//           Book Appointment
//         </button>
//       </div>

//       {/* Conditional rendering of booking details */}
//       {bookingDetails && (
//         <div className="booking-details">
//           <h2>Booking Details</h2>
//           <p>
//             <strong>Dentist:</strong> {bookingDetails.dentistName}
//             <br />
//             <strong>Date:</strong> {bookingDetails.date}
//             <br />
//             <strong>Time:</strong> {bookingDetails.time}
//           </p>
//         </div>
//       )}

//       <div className="appointments">
//         <h2>Your Appointments</h2>
//         <ul>
//           {appointments.map((appointment, index) => (
//             <li key={index}>
//               <strong>Dentist:</strong> {appointment.dentistName}, <strong>Date:</strong> {appointment.date},{' '}
//               <strong>Time:</strong> {appointment.time}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <footer>
//         <p>Contact information, terms, and privacy policy</p>
//       </footer>
//     </div>
//   );
// };

// export default Booking;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Booking.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Booking = () => {
  const [dentists, setDentists] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [customerid, setCustomerId] = useState('');
  const [BookingMessage, setBookingMessage] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const currentDate = new Date().toISOString().split('T')[0];

  const priceBooking = 50000; // Define the booking price here

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getAllDentists');
        setDentists(Array.isArray(response.data.dentists) ? response.data.dentists : []);
      } catch (error) {
        console.error('Error fetching dentists:', error);
      }
    };
    fetchDentists();
  }, []);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedDentist && selectedDate) {
        try {
          const formattedDate = selectedDate;
          const response = await axios.get(`http://localhost:3000/slotsByDate`, {
            params: {
              dentistID: selectedDentist,
              date: formattedDate
            }
          });
          if (!response.status === 200) {
            throw new Error('Failed to fetch slots');
          }
          setAvailableSlots(response.data);
          setError('');
        } catch (error) {
          console.error('Error fetching slots:', error);
          setError('Error fetching slots');
        }
      }
    };
    fetchAvailableSlots();
  }, [selectedDentist, selectedDate]);

  useEffect(() => {
    const fetchCustomerID = async () => {
      try {
        const account = JSON.parse(localStorage.getItem('account'));
        if (account && account.id) {
          const response = await axios.get('http://localhost:3000/getCustomerId', {
            params: { AccountID: account.id }
          });
          setCustomerId(response.data);
        } else {
          setCustomerId('');
        }
      } catch (error) {
        console.error('Error fetching customer ID:', error);
        setCustomerId('');
      }
    };
    fetchCustomerID();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:3000/scheduleDentist');
        console.log('Schedule', response.data);
        setSchedules(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };
    fetchSchedules();
  }, []);

  const handleTimeClick = (slotId, scheduleId) => {
    setSelectedTime(scheduleId);
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    if (selected >= currentDate) {
      setSelectedDate(selected);
    } else {
      alert('Vui lòng chọn một ngày sau ngày hiện tại.');
    }
  };

  const handleBooking = async () => {
    try {
      const response = await axios.post('http://localhost:3000/booking', {
        customerId: customerid.customerId,
        status: "Pending",
        typeBook: "InDay",
        price: parseFloat(priceBooking),
        dentist: selectedDentist,
        date: selectedDate,
        slotId: selectedTime
      });
      if (response.status === 200) {
        setBookingMessage('Booking successfully created!');
        setSelectedDentist('');
        setSelectedDate('');
        setSelectedTime('');
      } else {
        setBookingMessage('Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingMessage('Error creating booking');
    }
  };

  return (
    <div className="container booking-schedule-container">
      <div className="header">
        <h1>Booking Schedule</h1>
        <Link to="/" className="go-back-btn">Go Back</Link>
      </div>
      <div className="booking-form">
        <label>Select Date:</label>
        <input
          id="dateSelect"
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={handleDateChange}
        />

        <label>Select Dentist:</label>
        <select
          id="dentistSelect"
          className="form-control"
          value={selectedDentist}
          onChange={(e) => {
            setSelectedDentist(e.target.value);
            console.log('Selected Dentist ID:', e.target.value);
          }}
        >
          <option value="">Chọn bác sĩ</option>
          {dentists.map((dentist) => (
            <option key={dentist.DentistID} value={dentist.DentistID}>
              {dentist.DentistName}
            </option>
          ))}
        </select>

        <label>Select Time:</label>
        <div className="time-slots">
          {availableSlots.map((availableslot) => (
            <div
              key={availableslot.SlotID}
              className={`hour-slot ${selectedTime === availableslot.ScheduleID ? 'selected' : ''}`}
              onClick={() => handleTimeClick(availableslot.SlotID, availableslot.ScheduleID)}
            >
              {availableslot.AvailableSlot.Time}
            </div>
          ))}
        </div>

        {selectedTime && (
          <div className="price-booking">
            <label>Price Booking: {priceBooking.toLocaleString('vi-VN')} VNĐ</label>
          </div>
        )}

        <button className="btn" onClick={handleBooking}>
          Book Appointment
        </button>
      </div>

      {bookingDetails && (
        <div className="booking-details">
          <h2>Booking Details</h2>
          <p>
            <strong>Dentist:</strong> {bookingDetails.dentistName}
            <br />
            <strong>Date:</strong> {bookingDetails.date}
            <br />
            <strong>Time:</strong> {bookingDetails.time}
          </p>
        </div>
      )}

      <div className="appointments">
        <h2>Your Appointments</h2>
        <ul>
          {appointments.map((appointment, index) => (
            <li key={index}>
              <strong>Dentist:</strong> {appointment.dentistName}, <strong>Date:</strong> {appointment.date},{' '}
              <strong>Time:</strong> {appointment.time}
            </li>
          ))}
        </ul>
      </div>
      <footer>
        <p>Contact information, terms, and privacy policy</p>
      </footer>
    </div>
  );
};

export default Booking;
