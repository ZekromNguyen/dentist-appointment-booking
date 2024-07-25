import React, { useEffect, useState } from 'react';
import './doctor.scss';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import BookingDetails from '../Booking/BookingDetails';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { checkSession } from '../../Service/userService';
import axios from 'axios';
import BASE_URL from '../../ServiceSystem/axios';
import { toast } from 'react-toastify';


const DoctorLoad = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { accountId } = useParams(); // Get accountId from URL

    const [dentist, setDentist] = useState(null);
    const [treatmentDate, setTreatmentDate] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [showBookingDetails, setShowBookingDetails] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [recurringType, setRecurringType] = useState('None');
    const [recurringEndDate, setRecurringEndDate] = useState('');
    const priceBooking = 50000;
    const [price, setPrice] = useState(0);

    const [userAccountId, setUserAccountId] = useState(null); // Store logged-in user's accountId


    useEffect(() => {
        const fetchSession = async () => {
            try {
                const customer = await checkSession();
                if (customer) {
                    setCustomerId(customer.customerId);
                    setUserAccountId(customer.id); // Set the logged-in user's accountId
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            }
        };
        fetchSession();
    }, []);

    useEffect(() => {
        if (state && state.dentist) {
            setDentist(state.dentist);
        }
    }, [state]);

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



    useEffect(() => {
        const fetchSchedules = async () => {
            if (dentist && treatmentDate) {
                setLoading(true);
                try {
                    const response = await axios.get(`${BASE_URL}/slotsByDate`, {
                        params: {
                            dentistID: dentist.DentistID,
                            date: treatmentDate
                        }
                    });
                    if (response.status === 200) {
                        setSchedules(response.data);
                        setSchedules(response.data.slots);
                        setError('');
                    } else {
                        throw new Error('Failed to fetch schedules');
                    }
                } catch (error) {
                    console.error('Error fetching schedules:', error);
                    setError('Unable to load schedules. Please try again later.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchSchedules();
    }, [dentist, treatmentDate]);

    const handleCancelBooking = (cancelledBooking) => {
        try {
            const updatedBookingDetails = bookingDetails.filter(
                booking => booking.ScheduleId !== cancelledBooking.ScheduleId
            );
            setBookingDetails(updatedBookingDetails);
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    };

    const handleSelectDate = (date) => {
        setTreatmentDate(date);
        setSelectedTimes([]);
    };

    const handleTimeClick = (slotId, scheduleId, slotTime) => {
        const alreadySelected = selectedTimes.find(slot => slot.SlotId === slotId);
        if (alreadySelected) {
            setSelectedTimes(selectedTimes.filter(slot => slot.SlotId !== slotId));
            setSelectedSlot(null);
        } else {
            setSelectedTimes([...selectedTimes, { SlotId: slotId, ScheduleId: scheduleId, SlotTime: slotTime }]);
            setSelectedSlot({ SlotId: slotId, ScheduleId: scheduleId, SlotTime: slotTime });
        }
    };

    const handleTypeChange = (event) => {
        setRecurringType(event.target.value);
    };

    const handleRecurringEndDateChange = (event) => {
        setRecurringEndDate(event.target.value);
    };

    const handleConfirmBooking = async (e) => {
        e.preventDefault();

        // Check if any slots are selected
        if (selectedTimes.length === 0) {
            toast.warn('Please select at least one time slot to make a booking.');
            return;
        }
        if (!loggedIn) {
            toast.warn('Please log in to make a booking.');

            // Navigate to the login page after 2 seconds
            // setTimeout(() => {
            //     navigate('/login');
            // }, 2000);

            return;
        }

        try {
            const newBookings = selectedTimes.map(time => ({
                customerName: typeof customerId === 'object' ? customerId.customerName : customerId,
                customerId: typeof customerId === 'object' ? customerId.customerId : customerId,
                dentistId: dentist.DentistID,
                status: 'Pending',
                typeBook: 'Online',
                price: price, // Total price for all selected times
                priceBooking: parseFloat(priceBooking),
                dentist: dentist.DentistName,
                date: treatmentDate,
                slotTime: time.SlotTime,
                ScheduleId: time.ScheduleId,
                SlotId: time.SlotId,
                RecurringType: recurringType,
                recurringEndDate
            }));

            setBookingDetails(newBookings);

            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(...newBookings);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            setShowBookingDetails(true);
        } catch (error) {
            console.error('Error confirming booking:', error);
        }

        setSelectedTimes([]);
    };

    const handleCloseBookingDetails = () => {
        setShowBookingDetails(false);
    };

    useEffect(() => {
        if (selectedTimes.length > 0) {
            let totalCost = priceBooking;
            if (recurringType === "Weekly") {
                totalCost *= 4;
            } else if (recurringType === "Monthly") {
                totalCost *= 12;
            }
            setPrice(totalCost);
        } else {
            setPrice(0);
        }
    }, [selectedTimes, recurringType, priceBooking]);

    if (!dentist) {
        return null;
    }


    const handleChatClick = () => {
        console.log('userAccountId before navigate:', userAccountId); // Log the userAccountId before navigation
        if (!loggedIn) {
            toast.warn('Please log in to chat with the dentist.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            return;
        }

        navigate(`/chat/${userAccountId}/${dentist.AccountID}`);
    };

    return (
        <div className='DoctorLoad'>
            <Header />
            <form onSubmit={handleConfirmBooking}>
                <div className='doctor'>
                    <div className='doctor-img' style={{ backgroundImage: `url(${BASE_URL}/${dentist.ImagePath})` }}></div>
                    <div className='doctor-detail'>
                        <h2 className='doctor-name'>{dentist.DentistName}</h2>
                        <div className='doctor-infor'>Information</div>
                        <div className='doctor-description'>{dentist.Description}</div>
                        <div className='doctor-Clinic'>Clinic: {dentist.clinic.ClinicName}</div>
                        <p className='doctor-Clinic'>Clinic Address: {dentist.clinic.Address}</p>
                    </div>
                </div>
                <div className='time-Clinic'>
                    <span className='clinic-icon'>
                        <i className='fas fa-clock'></i>
                    </span>
                    Operating-Time
                </div>
                <div className='time-Clinic-detail'>
                    {dentist.clinic.OpenTime}-{dentist.clinic.CloseTime}
                </div>

                <div className='booking-section'>
                    <label>Select Date:</label>
                    <input
                        type='date'
                        value={treatmentDate}
                        onChange={(e) => handleSelectDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />

                    <label>Recurring Type:</label>
                    <select
                        value={recurringType}
                        onChange={handleTypeChange}
                    >
                        <option value='None'>Slot</option>
                        <option value='Weekly'>Weekly</option>
                        <option value='Monthly'>Monthly</option>
                    </select>

                    {/* {recurringType !== 'None' && (
                        <>
                            <label>Recurring End Date:</label>
                            <input
                                type='date'
                                value={recurringEndDate}
                                onChange={handleRecurringEndDateChange}
                            />
                        </>
                    )} */}

                    {loading && <p>Loading schedules...</p>}

                    {error && <p>{error}</p>}
                    {schedules.length === 0 && !loading && (
                        <p>No available slots for the selected date.</p>
                    )}
                    {schedules.length > 0 && (
                        <>
                            <div className='slot-time'>
                                <label>Select Time:</label>
                                <div className='time-slots'>
                                    {schedules.map(schedule => (
                                        <div
                                            key={schedule.ScheduleID}
                                            className={`hour-slot ${selectedTimes.find(time => time.SlotId === schedule.SlotID) ? 'selected' : ''}`}
                                            onClick={() => handleTimeClick(schedule.SlotID, schedule.ScheduleID, schedule.AvailableSlot.Time)}
                                        >
                                            {schedule.AvailableSlot.Time}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='price-section'>
                                <div className='price-section'>
                                    <p>Total Cost (Total): {(price * selectedTimes.length).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                    {/* <p>Chi phí đặt lịch: {priceBooking.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p> */}
                                </div>
                            </div>
                            <button type='submit'>Submit</button>
                        </>
                    )}
                </div>
            </form>
            {showBookingDetails && (
                <BookingDetails
                    show={showBookingDetails}
                    handleClose={handleCloseBookingDetails}
                    bookingDetails={bookingDetails}
                    onCancelBooking={handleCancelBooking}
                    customerName={customerId ? customerId.customerName : ''}
                />

            )}
            <button className="chat-button" onClick={handleChatClick}>
                Message with dentist
            </button>
            <Footer />
        </div>
    );
};

export default DoctorLoad;