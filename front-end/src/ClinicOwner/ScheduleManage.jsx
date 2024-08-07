


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ScheduleManage.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../ServiceSystem/axios';

export default function ScheduleManage(props) {
  const [dentists, setDentists] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSchedules, setBookedSchedules] = useState([]);
  const [expiredSlots, setExpiredSlots] = useState([]);
  const [remainingSlots, setRemainingSlots] = useState([]);
  const [error, setError] = useState('');
  const [isScheduleVisible, setIsScheduleVisible] = useState(true);
  const [isBookedScheduleVisible, setIsBookedScheduleVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState('dentist-schedule');
  const [isDentistLoggedIn, setIsDentistLoggedIn] = useState(false);
  const [loggedInDentistID, setLoggedInDentistID] = useState(null);
  const currentDate = new Date().toISOString().split('T')[0];

  const [OwnerID, setOwnerID] = useState(null);
  // Fetch logged-in dentist information

  useEffect(() => {
    const dentistData = JSON.parse(localStorage.getItem('account'));
    if (dentistData && dentistData.dentistId) {
      setLoggedInDentistID(dentistData.dentistId);
      setIsDentistLoggedIn(true);
    }
  }, []);

  // Fetch OwnerID based on ClinicID
  useEffect(() => {
    const fetchOwnerID = async () => {
      if (isDentistLoggedIn) {

        try {
          const response = await axios.get(`${BASE_URL}/getOwnerIdByClinicId`, {
            params: { DentistId: loggedInDentistID },
          });
          const ownerID = response.data.OwnerID.ClinicOwnerID;
          setOwnerID(ownerID);
          //fetchDentists(ownerID);
        } catch (error) {
          console.error('Error fetching OwnerID:', error);
        }
      }
    };

    fetchOwnerID();
  }, [isDentistLoggedIn, loggedInDentistID]);

  // Get API All Dentists
  useEffect(() => {
    const fetchDentists = async () => {
      try {
        let OwnerId;
        if (isDentistLoggedIn) {
          OwnerId = OwnerID; // Lấy OwnerID từ state
        } else {
          const data = JSON.parse(localStorage.getItem('account'));
          OwnerId = data.clinicOwnerId;
        }
        if (OwnerId) {
          const response = await axios.get(`${BASE_URL}/getAllDentists?OwnerId=${OwnerId}`);
          setDentists(Array.isArray(response.data.dentists) ? response.data.dentists : []);
        }
      } catch (error) {
        console.error('Error fetching dentists:', error);
      }
    };

    fetchDentists();
  }, [OwnerID, isDentistLoggedIn]);

  const fetchSlots = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/scheduleSlot`);
      setSlots(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if ((isDentistLoggedIn && selectedDate) || (selectedDentist && selectedDate)) {
        const dentistID = isDentistLoggedIn ? loggedInDentistID : selectedDentist;
        try {
          const response = await axios.get(`${BASE_URL}/slotsByDate`, {
            params: {
              dentistID,
              date: selectedDate,
              isNotCustomer: 1,
            },
          });
          if (response.status !== 200) {
            throw new Error('Failed to fetch slots');
          }
          setAvailableSlots(response.data.slots);
        } catch (error) {
          console.error('Error fetching slots:', error);
        }
      }
    };
    fetchAvailableSlots();
  }, [selectedDentist, selectedDate, isDentistLoggedIn, loggedInDentistID]);

  // Get API All Dentist Schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        let OwnerId;
        if (isDentistLoggedIn) {
          OwnerId = OwnerID; // Lấy OwnerID từ state
        } else {
          const data = JSON.parse(localStorage.getItem('account'));
          OwnerId = data.clinicOwnerId;
        }
        if (OwnerId) {
          const response = await axios.get(`${BASE_URL}/scheduleDentist?OwnerId=${OwnerId}`);
          const allSchedules = Array.isArray(response.data) ? response.data : [];
          setSchedules(allSchedules);
          const booked = allSchedules.filter(schedule => schedule.Status === 'Booked');
          setBookedSchedules(booked);
          const expired = allSchedules.filter(schedule => schedule.Status === 'Expired');
          setExpiredSlots(expired);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, [isDentistLoggedIn, OwnerID]);

  const updateRemainingSlots = () => {
    if (slots.length > 0) {
      if (availableSlots.length > 0) {
        const availableSlotIDs = availableSlots.map(slot => slot.SlotID);
        console.log(availableSlotIDs);
        const dentistID = isDentistLoggedIn ? loggedInDentistID : selectedDentist;
        const bookedSlotIDs = bookedSchedules
          .filter(schedule =>
            schedule.DentistID === dentistID &&
            schedule.Date === selectedDate
          )
          .map(schedule => schedule.SlotID);
        const remainingSlots = slots.filter(slot =>
          !availableSlotIDs.includes(slot.SlotID) &&
          !bookedSlotIDs.includes(slot.SlotID)
        );
        setRemainingSlots(remainingSlots);
        console.log(remainingSlots);
      } else {
        const dentistID = isDentistLoggedIn ? loggedInDentistID : selectedDentist;
        const bookedSlotIDs = schedules
          .filter(schedule =>
            schedule.DentistID === dentistID &&
            schedule.Date === selectedDate
          )
          .map(schedule => schedule.SlotID);
        const remainingSlots = slots.filter(slot =>
          !bookedSlotIDs.includes(slot.SlotID)
        );
        setRemainingSlots(remainingSlots);
      }
    }
  };

  useEffect(() => {
    updateRemainingSlots();
  }, [slots, availableSlots, schedules, selectedDate, loggedInDentistID, selectedDentist, isDentistLoggedIn]);

  const toggleScheduleVisibility = () => {
    setIsScheduleVisible(!isScheduleVisible);
  };

  const toggleBookedScheduleVisibility = () => {
    setIsBookedScheduleVisible(!isBookedScheduleVisible);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    if (selected >= currentDate) {
      setSelectedDate(selected);
    } else {
      alert('Please select a date after today.');
    }
  };

  const handleTimeClick = (slotId) => {
    if (selectedSlots.includes(slotId)) {
      setSelectedSlots(selectedSlots.filter(id => id !== slotId));
    } else {
      setSelectedSlots([...selectedSlots, slotId]);
    }
  };
  const handleSave = async () => {
    // Determine the dentist ID to use based on login status
    const dentistIDToUse = isDentistLoggedIn ? loggedInDentistID : selectedDentist;

    // Initialize error flags
    let errorMessage = '';

    // Check if all fields are missing
    const allFieldsMissing = !dentistIDToUse && !selectedDate && selectedSlots.length === 0;

    // Check for missing fields and set appropriate error messages
    if (allFieldsMissing) {
      errorMessage = 'Please select all fields !!!!!';
    } else if (!dentistIDToUse) {
      errorMessage = 'Please select a dentist !!!!!';
    } else if (!selectedDate) {
      errorMessage = 'Please select a date !!!!!';
    } else if (selectedSlots.length === 0) {
      errorMessage = 'Please select at least one time slot !!!!!';
    } else {
      // Check for existing schedule conflict
      const existingSchedule = schedules.find(schedule =>
        schedule.DentistID === dentistIDToUse &&
        schedule.Date === selectedDate &&
        selectedSlots.includes(schedule.SlotID)
      );

      if (existingSchedule) {
        errorMessage = 'This dentist is already scheduled for one or more of the selected slots on this date.';
      }
    }

    // If there's an error message, set the error and exit
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      // Save new schedules
      const newSchedules = await Promise.all(selectedSlots.map(async (slotId) => {
        const response = await axios.post(`${BASE_URL}/schedule`, {
          date: selectedDate,
          slotId: slotId,
          dentistId: parseInt(dentistIDToUse)
        });
        return response.data.newSchedule;
      }));

      // Update and sort schedules
      const updatedSchedules = [...schedules, ...newSchedules];
      updatedSchedules.sort((a, b) => {
        const dateA = new Date(a.Date);
        const dateB = new Date(b.Date);

        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        // If dates are the same, compare SlotID to maintain a consistent order
        return a.SlotID - b.SlotID;
      });

      // Update state
      setSchedules(updatedSchedules);
      setSelectedDentist('');
      setSelectedDate('');
      setSelectedSlots([]);
      setError('');
      setAvailableSlots([]);
      fetchSlots();
      updateRemainingSlots();
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError('Error creating schedule');
    }
  };





  const handleDeleteSchedule = async (scheduleId) => {
    confirmDelete(async () => {
      try {
        const response = await axios.delete(`${BASE_URL}/schedule/${scheduleId}`);
        if (response.status === 200) {
          setSchedules(schedules.filter(schedule => schedule.ScheduleID !== scheduleId));
          toast.success("Schedule deleted successfully");
        } else {
          setError('Failed to delete schedule');
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
        setError('Error deleting schedule');
      }
    });
  };

  const filteredSchedules = isDentistLoggedIn
    ? schedules.filter(schedule => schedule.DentistID === loggedInDentistID &&
      schedule.Date === (selectedDate || currentDate)
    )
    : schedules;


  const filteredBookedSchedules = isDentistLoggedIn
    ? bookedSchedules.filter(schedule =>
      schedule.DentistID === loggedInDentistID && schedule.Date === (selectedDate || currentDate))
    : bookedSchedules;

  // Kiểm tra và loại bỏ các bản ghi trùng lặp dựa trên ScheduleID
  const uniqueFilteredBookedSchedules = filteredBookedSchedules.filter(
    (schedule, index, self) => index === self.findIndex(s => s.ScheduleID === schedule.ScheduleID)
  );



  return (
    <div>
      <div className="container manage-schedule-container">
        <div className="m-s-title">Manage Schedule</div>

        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="dentistSelect">Select Dentist</label>
              {isDentistLoggedIn ? (
                <input
                  id="dentistSelect"
                  type="text"
                  className="form-control"
                  value={dentists.find(dentist => dentist.DentistID === loggedInDentistID)?.DentistName || ''}
                  readOnly
                />
              ) : (
                <select
                  id="dentistSelect"
                  className="form-control"
                  value={selectedDentist}
                  onChange={(e) => setSelectedDentist(e.target.value)}
                >
                  <option value="">Select Dentist</option>
                  {dentists.map((dentist) => (
                    <option key={dentist.DentistID} value={dentist.DentistID}>
                      {dentist.DentistName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="dateSelect">Select Date</label>
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
              <button className="btn btnn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 pick-hour-container">
            <div className="Time-slot-container">
              {remainingSlots.length > 0 ? (
                remainingSlots.map((remainingSlot) => (
                  <div
                    key={remainingSlot.SlotID}
                    className={`hour-slot ${selectedSlots.includes(remainingSlot.SlotID) ? 'selected' : ''}`}
                    onClick={() => handleTimeClick(remainingSlot.SlotID)}
                  >
                    {remainingSlot.Time}
                  </div>
                ))
              ) : (
                <p>No slots available.</p>
              )}
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          <div className="col-md-6">
            <div className="option-selector">
              <select onChange={handleOptionChange} value={selectedOption} className="form-control">
                <option value="dentist-schedule">Dentist Schedule</option>
                <option value="booked-schedule">Booked Schedule</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-6">
            {selectedOption === 'dentist-schedule' && (
              <div className="dentist-schedule-container">
                <button className="btn btn-toggle" onClick={toggleScheduleVisibility}>
                  {isScheduleVisible ? 'Hide Schedule' : 'Show Schedule'}
                </button>
                <div className={`schedule-table ${isScheduleVisible ? 'visible' : 'hidden'}`}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">ScheduleID</th>
                        <th scope="col">Dentist Name</th>
                        <th scope="col">Date</th>
                        <th scope="col">Slot Time</th>
                        <th scope="col">Status</th>
                        {!isDentistLoggedIn && <th scope="col">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchedules.map((schedule) => (
                        schedule.Status === 'Available' && (
                          <tr key={schedule.ScheduleID}>
                            <td>{schedule.ScheduleID}</td>
                            <td>{dentists.find(dentist => dentist.DentistID === schedule.DentistID)?.DentistName}</td>
                            <td>{new Date(schedule.Date).toLocaleDateString('vi-VN')}</td>
                            <td>{slots.find(availableslot => availableslot.SlotID === schedule.SlotID)?.Time}</td>
                            <td>{schedule.Status}</td>
                            {!isDentistLoggedIn && (
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDeleteSchedule(schedule.ScheduleID)}
                                >
                                  Delete
                                </button>
                              </td>
                            )}
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-6">
            {selectedOption === 'booked-schedule' && (
              <div className="booked-schedule-container">
                <button className="btn btn-toggle" onClick={toggleBookedScheduleVisibility}>
                  {isBookedScheduleVisible ? 'Hide Booked Schedules' : 'Show Booked Schedules'}
                </button>
                <div className={`schedule-table ${isBookedScheduleVisible ? 'visible' : 'hidden'}`}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">ScheduleID</th>
                        <th scope="col">Dentist Name</th>
                        <th scope="col">Date</th>
                        <th scope="col">Slot Time</th>
                        <th scope="col">Customer Name</th>
                        {!isDentistLoggedIn && <th scope="col">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueFilteredBookedSchedules.map((schedule) => (
                        schedule.Status === 'Booked' && (
                          <tr key={schedule.ScheduleID}>
                            <td>{schedule.ScheduleID}</td>
                            <td>{dentists.find(dentist => dentist.DentistID === schedule.DentistID)?.DentistName}</td>
                            <td>{new Date(schedule.Date).toLocaleDateString('vi-VN')}</td>
                            <td>{slots.find(availableslot => availableslot.SlotID === schedule.SlotID)?.Time}</td>
                            <td>{schedule.BookingDetail?.Booking?.Customer?.CustomerName || 'N/A'}</td>
                            <td>{schedule.Status}</td>
                            {!isDentistLoggedIn && (
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDeleteSchedule(schedule.ScheduleID)}
                                >
                                  Delete
                                </button>
                              </td>
                            )}
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





