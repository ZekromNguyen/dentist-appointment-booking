import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import './ScheduleManage.scss'; // Ensure your custom SCSS file is correctly linked
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

export default function ScheduleManage(props) {
  const [dentists, setDentists] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [hours, setHours] = useState([]);
  const [selectedTime, setSelectedTime] = useState(''); // State to store selected time
  const [appointments, setAppointments] = useState([]); // State to store appointments

  // Call API GetALLDentist
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

  // Call API Get SlotTime
  useEffect(() => {
    // Simulate fetching hours data (replace with actual API call if needed)
    const fetchHours = () => {
      // Example hours data (can be fetched from API)
      const hoursData = [
        { id: 1, time: '08:00 AM' },
        { id: 2, time: '09:00 AM' },
        { id: 3, time: '10:00 AM' },
        { id: 4, time: '11:00 AM' },
        { id: 5, time: '12:00 PM' },
        { id: 6, time: '01:00 PM' },
        { id: 7, time: '02:00 PM' },
        { id: 8, time: '03:00 PM' },
        { id: 9, time: '04:00 PM' },
        { id: 10, time: '05:00 PM' },
      ];
      setHours(hoursData);
    };

    fetchHours();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    // You can add further logic here if needed
  };

  const handleTimeClick = (time) => {
    if (time === selectedTime) {
      setSelectedTime(''); // Deselect if clicked again
    } else {
      setSelectedTime(time); // Set the selected time when clicked
    }
  };

  const handleSave = () => {
    // Create a new appointment object with selectedDentist, selectedDate, selectedTime, etc.
    const newAppointment = {
      dentist: selectedDentist,
      date: selectedDate,
      time: selectedTime,
      // Add more fields as needed
    };

    // Update appointments state with new appointment
    setAppointments([...appointments, newAppointment]);

    // Clear selected fields after save if needed
    setSelectedDentist('');
    setSelectedDate('');
    setSelectedTime('');
  };

  return (
    <div className="container manage-schedule-container">
      <div className="m-s-title">
        <FormattedMessage id="manage-schedule.title" />
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="dentistSelect">Chọn bác sĩ</label>
            <select
              id="dentistSelect"
              className="form-control"
              value={selectedDentist}
              onChange={(e) => setSelectedDentist(e.target.value)}
            >
              <option value="">Chọn bác sĩ</option>
              {dentists.map((dentist) => (
                <option key={dentist.DentistName} value={dentist.DentistName}>
                  {dentist.DentistName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="dateSelect">Chọn ngày</label>
            <input
              id="dateSelect"
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label>&nbsp;</label>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 pick-hour-container">
          <div className="hour-slot-container">
            {hours.map((hour) => (
              <div
                key={hour.id}
                className={`hour-slot ${selectedTime === hour.time ? 'selected' : ''}`}
                onClick={() => handleTimeClick(hour.time)}
              >
                {hour.time}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <h3>Dentist Schedules</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Dentist Name</th>
                <th scope="col">Date</th>
                <th scope="col">Slot Time</th>
                {/* Add more headers as needed */}
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.dentist}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  {/* Add more cells for additional appointment fields */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
