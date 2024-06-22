

import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import './ScheduleManage.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ScheduleManage(props) {
  const [dentists, setDentists] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');
  const [isScheduleVisible, setIsScheduleVisible] = useState(true);
  const currentDate = new Date().toISOString().split('T')[0];

  const toggleScheduleVisibility = () => {
    setIsScheduleVisible(!isScheduleVisible);
  };

  // Get API All Dentist
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

  // Get API All Slot
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get('http://localhost:3000/scheduleSlot');
        setSlots(Array.isArray(response.data) ? response.data : []);
        console.log('checkslotId', response.data);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchSlots();
  }, []);

  // Get API All DentistSchedule
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

  const handleDateChange = (e) => {
    const selected = e.target.value;
    if (selected >= currentDate) {
      setSelectedDate(selected);
    } else {
      alert('Vui lòng chọn một ngày sau ngày hiện tại.');
    }
  };

  const handleTimeClick = (slotId) => {
    console.log('Selected SlotID:', slotId);
    if (selectedSlots.includes(slotId)) {
      setSelectedSlots(selectedSlots.filter(id => id !== slotId));
    } else {
      setSelectedSlots([...selectedSlots, slotId]);
    }
  };

  const handleSave = async () => {
    if (!selectedDentist || !selectedDate || selectedSlots.length === 0) {
      setError('Please fill in all fields');
      return;
    }

    // Check if the dentist already has a schedule on the selected date and time slot
    const existingSchedule = schedules.find(schedule => 
      schedule.DentistID === selectedDentist && 
      schedule.Date === selectedDate && 
      selectedSlots.includes(schedule.SlotID)
    );

    if (existingSchedule) {
      setError('This dentist is already scheduled for one or more of the selected slots on this date.');
      return;
    }

    try {
      const newSchedules = await Promise.all(selectedSlots.map(async (slotId) => {
        const response = await axios.post('http://localhost:3000/schedule', {
          date: selectedDate,
          slotId: slotId,
          dentistId: selectedDentist
        });
        return response.data.newSchedule;
      }));

      setSchedules([...schedules, ...newSchedules]);
      setSelectedDentist('');
      setSelectedDate('');
      setSelectedSlots([]);
      setError('');
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError('Error creating schedule');
    }
  };

  // Filter available slots based on existing schedules
  const filteredSlots = slots.filter(slot => 
    !schedules.some(schedule => 
      schedule.DentistID === selectedDentist && 
      schedule.Date === selectedDate && 
      schedule.SlotID === slot.SlotID
    )
  );

  return (
    <div>
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
                min={currentDate}
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
            <div className="Time-slot-container">
              {filteredSlots.map((availableslot) => (
                <div
                  key={availableslot.SlotID}
                  className={`hour-slot ${selectedSlots.includes(availableslot.SlotID) ? 'selected' : ''}`}
                  onClick={() => handleTimeClick(availableslot.SlotID)}
                >
                  {availableslot.Time}
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
      </div>

      <div className="container dentist-schedule-container">
        <button className="btn btn-toggle" onClick={toggleScheduleVisibility}>
          {isScheduleVisible ? 'Hide Schedule' : 'Show Schedule'}
        </button>
        <div className={`row schedule-table ${isScheduleVisible ? 'visible' : 'hidden'}`}>
          <div className="col-md-12">
            <div className="table-background"></div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ScheduleID</th>
                  <th scope="col">Dentist Name</th>
                  <th scope="col">Date</th>
                  <th scope="col">SlotTime</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => (
                  <tr key={schedule.ScheduleID}>
                    <td>{schedule.ScheduleID}</td>
                    <td>{dentists.find(dentist => dentist.DentistID === schedule.DentistID)?.DentistName}</td>
                    <td>{schedule.Date}</td>
                    <td>{slots.find(availableslot => availableslot.SlotID === schedule.SlotID)?.Time}</td>
                    <td>{schedule.Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

