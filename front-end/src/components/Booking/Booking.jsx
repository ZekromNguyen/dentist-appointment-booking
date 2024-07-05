import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Booking.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import BookingDetails from './BookingDetails'; // Import component BookingDetails
import { Link, useNavigate } from 'react-router-dom';
import { checkSession } from '../../Service/userService';
import BASE_URL from '../../ServiceSystem/axios';

const Booking = () => {
  const [dentists, setDentists] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState({ id: '', name: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]); // State to store selected slots
  const [customerid, setCustomerId] = useState('');
  const [BookingMessage, setBookingMessage] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]); // State to store booking details
  const [showBookingDetails, setShowBookingDetails] = useState(false); // State to control modal visibility
  const currentDate = new Date().toISOString().split('T')[0];

  const navigate = useNavigate();

  const priceBooking = 50000; // Define the booking price here


  //***********************Get All Dentist********************************/
  useEffect(() => {
    // Kiểm tra session khi component được mount
    const fetchSession = async () => {
      const customerId = await checkSession();
      if (customerId === null) {
        setCustomerId(null);
        navigate('/login');
      }
      if (customerId) {
        setCustomerId(customerId);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getAllDentists`);
        setDentists(Array.isArray(response.data.dentists) ? response.data.dentists : []);
      } catch (error) {
        console.error('Error fetching dentists:', error);
      }
    };
    fetchDentists();
  }, []);


  //**************************Get Slot By Dentist and Date*******************************/

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedDentist.id && selectedDate) {
        try {
          const formattedDate = selectedDate;
          const response = await axios.get(`${BASE_URL}/slotsByDate`, {
            params: {
              dentistID: selectedDentist.id,
              date: formattedDate
            }
          });
          if (!response.status === 200) {
            throw new Error('Failed to fetch slots');
          }
          setAvailableSlots(response.data);
        } catch (error) {
          console.error('Error fetching slots:', error);
        }
      }
    };
    fetchAvailableSlots();
  }, [selectedDentist, selectedDate]);



  //******************Get customerID************************************/
  useEffect(() => {
    const fetchCustomerID = async () => {
      try {
        const account = JSON.parse(localStorage.getItem('account'));
        if (account && account.id) {
          const response = await axios.get(`${BASE_URL}/getCustomerId`, {
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


  //*******************************Get Dentist Schedule****************************/
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/scheduleDentist`);
        setSchedules(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };
    fetchSchedules();
  }, []);


  // ***************************Hủy Booking ********************************

  const handleCancelBooking = async (cancelledBooking) => {
    try {
      // Remove cancelled booking from bookingDetails
      const updatedBookingDetails = bookingDetails.filter(
        booking => booking.ScheduleId !== cancelledBooking.ScheduleId
      );
      setBookingDetails(updatedBookingDetails);

      //************************ Return slotTime đã cancel **************************************
      setAvailableSlots(prevSlots => [
        ...prevSlots, // giữ lại các dòng đã có sẵn
        {
          ScheduleID: cancelledBooking.ScheduleId,
          SlotID: cancelledBooking.SlotId,
          AvailableSlot: { Time: cancelledBooking.slotTime }
        }
      ]);


      //************************ Cập nhập lại local storage khi có thay đổi cancel **************************

      const updatedAppointments = appointments.filter(
        appointment => appointment.ScheduleId !== cancelledBooking.ScheduleId
      );
      setAppointments(updatedAppointments);
      localStorage.setItem('bookings', JSON.stringify(updatedAppointments));

      // ******************************* Hiển thị các slot còn lại trong booking details ***********************88
      const updatedSelectedTimes = selectedTimes.filter(
        time => time.ScheduleId !== cancelledBooking.ScheduleId
      );

      setSelectedTimes(updatedSelectedTimes);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }

  };
  //******************************* Chọn slot time***************************************/

  const handleTimeClick = (slotId, scheduleId, slotTime) => {
    const alreadySelected = selectedTimes.find(slot => slot.SlotId === slotId);
    if (alreadySelected) {
      // Loại bỏ slot đã được chọn khỏi danh sách selectedTimes
      setSelectedTimes(selectedTimes.filter(slot => slot.SlotId !== slotId));
    } else {
      // Thêm slot mới vào danh sách selectedTimes
      setSelectedTimes([...selectedTimes, { SlotId: slotId, ScheduleId: scheduleId, SlotTime: slotTime }]);
    }
  };


  //*********************** Chọn ngày *******************************/
  const handleDateChange = (e) => {
    const selected = e.target.value;
    if (selected >= currentDate) {
      setSelectedDate(selected);
    } else {
      alert('Vui lòng chọn một ngày sau ngày hiện tại.');
    }
  };
  //***************************** Chọn Bác Sĩ **************************8*/
  const handleDentistChange = (e) => {
    const dentistID = e.target.value;
    const dentistName = e.target.options[e.target.selectedIndex].text;

    setSelectedDentist({ id: dentistID, name: dentistName });
  };


  //----------------------- Booking -------------------------------------
  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      const newBookings = selectedTimes.map(time => ({
        customerName: customerid.customerName,
        customerId: customerid.customerId,
        dentistId: selectedDentist.id,
        status: 'Pending',
        typeBook: 'Online',
        price: parseFloat(priceBooking),
        dentist: selectedDentist.name,
        date: selectedDate,
        slotTime: time.SlotTime,
        ScheduleId: time.ScheduleId,
        SlotId: time.SlotId
      }));

      setBookingDetails(newBookings); // Update bookingDetails

      // Save bookingDetails to localStorage (if needed)
      let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
      bookings.push(...newBookings);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      setBookingMessage('Booking successfully created!');
      setShowBookingDetails(true); // Show BookingDetails modal

      // Update availableSlots to hide selected slots
      setAvailableSlots(prevSlots => prevSlots.filter(slot => !selectedTimes.find(selected => selected.ScheduleId === slot.ScheduleID)));
      setSelectedDentist('');
      setSelectedDate(''); g
      setSelectedTimes([]); // Reset selected times

    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingMessage('Error creating booking');
    }
  };

  //---------------------------------------- Booking Detail ---------------------------------------------

  const handleCloseBookingDetails = () => {
    setShowBookingDetails(false);
  };

  useEffect(() => {
    const fetchAppointments = () => {
      const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
      setAppointments(bookings);
    };
    fetchAppointments();
  }, [BookingMessage]); // Update appointments list when BookingMessage changes

  // Update selectedTimes when component mounts
  useEffect(() => {
    const storedTimes = JSON.parse(localStorage.getItem('selectedTimes')) || [];
    setSelectedTimes(storedTimes);
  }, []);

  // Update localStorage when selectedTimes changes
  useEffect(() => {
    localStorage.setItem('selectedTimes', JSON.stringify(selectedTimes));
  }, [selectedTimes]);



  return (
    <div className="container booking-schedule-container">
      <div className="booking-form">
        <form onSubmit={handleBooking}>
          <label>Select Date:</label>
          <input
            id="dateSelect"
            type="date"
            className="form-control"
            value={selectedDate}
            min={currentDate}
            onChange={handleDateChange}
          />

          <label>Select Dentist:</label>
          <select
            id="dentistSelect"
            className="form-control"
            value={selectedDentist.id}
            onChange={handleDentistChange}
          >
            <option value="">Select a dentist</option>
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
                key={availableslot.ScheduleID}

                className={`hour-slot ${selectedTimes.find(time => time.SlotId === availableslot.SlotID) ? 'selected' : ''}`}
                onClick={() => handleTimeClick(availableslot.SlotID, availableslot.ScheduleID, availableslot.AvailableSlot.Time)}
              >
                {availableslot.AvailableSlot.Time}
              </div>
            ))}
          </div>

          {selectedTimes.length > 0 && (
            <div className="price-booking">
              <label>Total Cost: {(selectedTimes.length * priceBooking).toLocaleString('vi-VN')} VNĐ</label>
            </div>
          )}

          <button className="btn" type="submit">
            Book Appointment
          </button>
        </form>
      </div>

      {/* Render BookingDetails modal */}
      <BookingDetails
        show={showBookingDetails}
        handleClose={handleCloseBookingDetails}
        bookingDetails={bookingDetails}
        onCancelBooking={handleCancelBooking} // Pass handleCancelBooking function to BookingDetails props
      />
    </div>
  );
};

export default Booking;


