
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import './ScheduleManage.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format, parseISO } from 'date-fns';

export default function ScheduleManage(props) {
  const [dentists, setDentists] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState('');
  const [selectedDate, setSelectedDate] = useState('currentDate');
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');
  const currentDate = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại (định dạng ISO)
  const [isScheduleVisible, setIsScheduleVisible] = useState(true);

  const toggleScheduleVisibility = () => {
    setIsScheduleVisible(!isScheduleVisible);
  };
  function getDayOfWeek(dateString) {
    const date = parseISO(dateString); // Chuyển đổi chuỗi ngày thành đối tượng Date
    return format(date, 'EEEE'); // Định dạng ngày thành ngày trong tuần (vd: Thứ Hai)
  }

  //Get API All Dentist
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


  //Get API All Slot
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

  //Get API All DentistSchedule
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
    // Kiểm tra nếu ngày được chọn lớn hơn ngày hiện tại
    if (selected > currentDate) {
      setSelectedDate(selected);
      console.log('Selected Date:', selected);
    } else {
      alert('Vui lòng chọn một ngày sau ngày hiện tại.');
      // Nếu muốn đặt lại selectedDate về currentDate khi không hợp lệ
      // setSelectedDate(currentDate);
    }
  };


  const handleTimeClick = (slotId) => {
    console.log('Selected SlotID:', slotId);
    if (slotId === selectedTime) {
      setSelectedTime('');
    } else {
      setSelectedTime(slotId);
    }
  };





  const handleSave = async () => {
    window.location.reload();
    if (!selectedDentist || !selectedDate || !selectedTime) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/schedule', {
        date: selectedDate, 
        slotId: selectedTime,
        dentistId: selectedDentist
      });

      setSchedules([...schedules, response.data.newSchedule]);
      setSelectedDentist('');
      setSelectedDate('');
      setSelectedTime('');
      setError('');
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError('Error creating schedule');
    }
  };

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
              {slots.map((availableslot) => (
                <div
                  key={availableslot.SlotID} // Key should match a unique identifier in your data
                  className={`hour-slot ${selectedTime === availableslot.SlotID ? 'selected' : ''}`}
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
                  <th scope="col">Date Of Week</th>
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
                    <td>{getDayOfWeek(schedule.Date)}</td>
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



