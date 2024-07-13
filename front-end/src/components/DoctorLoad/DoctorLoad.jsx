import React, { useEffect, useState } from 'react';
import './doctor.scss';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import BookingDetails from '../Booking/BookingDetails';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkSession } from '../../Service/userService';
import axios from 'axios';
import BASE_URL from '../../ServiceSystem/axios';

const DoctorLoad = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [dentist, setDentist] = useState(null);
    const [treatmentDate, setTreatmentDate] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [showBookingDetails, setShowBookingDetails] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(50000);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null); // Track selected slot

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const customer = await checkSession();
                if (!customer) {
                    navigate('/login');
                } else {
                    setCustomerId(customer.customerId);
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            }
        };
        fetchSession();
    }, [navigate]);

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
                        setSchedules(response.data.slots);
                        setError('');
                    } else {
                        throw new Error('Failed to fetch schedules');
                    }
                } catch (error) {
                    console.error('Error fetching schedules:', error);
                    setError('Không thể tải được lịch khám. Vui lòng thử lại sau.');
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
            setSelectedSlot(null); // Deselect slot
        } else {
            setSelectedTimes([...selectedTimes, { SlotId: slotId, ScheduleId: scheduleId, SlotTime: slotTime }]);
            setSelectedSlot({ SlotId: slotId, ScheduleId: scheduleId, SlotTime: slotTime }); // Select slot
        }
    };

    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        if (!loggedIn) {
            alert('Vui lòng đăng nhập để đặt lịch khám.');
            return;
        }

        try {
            const newBookings = selectedTimes.map(time => ({
                customerName: typeof customerId === 'object' ? customerId.customerName : customerId,
                customerId: typeof customerId === 'object' ? customerId.customerId : customerId,
                dentistId: dentist.DentistID,
                status: 'Pending',
                typeBook: 'Online',
                price: parseFloat(selectedPrice),
                dentist: dentist.DentistName,
                date: treatmentDate,
                slotTime: time.SlotTime,
                ScheduleId: time.ScheduleId,
                SlotId: time.SlotId
            }));

            setBookingDetails(newBookings);

            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(...newBookings);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            setShowBookingDetails(true);
        } catch (error) {
            console.error('Error confirming booking:', error);
        }

        setSelectedTimes([]); // Reset selected times
    };

    const handleCloseBookingDetails = () => {
        setShowBookingDetails(false);
    };

    if (!dentist) {
        return null;
    }

    return (
        <div className='DoctorLoad'>
            <Header />
            <form onSubmit={handleConfirmBooking}>
                <div className='doctor'>
                    <div className='doctor-img' style={{ backgroundImage: `url(${BASE_URL}/${dentist.ImagePath})` }}></div>
                    <div className='doctor-detail'>
                        <h2 className='doctor-name'>{dentist.DentistName}</h2>
                        <div className='doctor-infor'>Thông tin</div>
                        <div className='doctor-description'>{dentist.Description}</div>
                        <div className='doctor-Clinic'>Phòng khám: {dentist.clinic.ClinicName}</div>
                        <p className='doctor-Clinic'>Địa chỉ phòng khám: {dentist.clinic.Address}</p>
                    </div>
                </div>
                <div className='time-Clinic'>
                    <span className='clinic-icon'>
                        <i className='fas fa-clock'></i> {/* Sử dụng Font Awesome icon */}
                    </span>
                    Giờ mở cửa
                </div>
                <div className='time-Clinic-detail'>
                    {dentist.clinic.OpenTime}-{dentist.clinic.CloseTime}
                </div>

                <div className='booking-section'>
                    <label>Chọn ngày khám:</label>
                    <input
                        type='date'
                        value={treatmentDate}
                        onChange={(e) => handleSelectDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />

                    {loading && <p>Đang tải lịch khám...</p>}

                    {error && <p>{error}</p>}
                    {schedules.length > 0 && (
                        <>
                            <div className='slot-time'>
                                <label>Chọn giờ khám:</label>
                                <div className='time-slots'>
                                    {schedules.map(schedule => (
                                        <div
                                            key={schedule.ScheduleID}
                                            className={`hour-slot ${selectedTimes.find(time => time.SlotId === schedule.SlotID) ? 'selected' : ''}`}
                                            onClick={() => handleTimeClick(schedule.SlotID, schedule.ScheduleID, schedule.AvailableSlot.Time)}
                                        >
                                            {schedule.AvailableSlot.Time} {/* Hiển thị slotTime */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {selectedSlot && (
                        <div className='booking-details'>
                            <h3>Thông tin đặt lịch:</h3>
                            <p>Ngày khám: {treatmentDate}</p>
                            <p>Giờ khám: {selectedSlot.SlotTime}</p>
                            <p>Phí dịch vụ: {(selectedPrice).toLocaleString('vi-VN')} VNĐ</p>
                        </div>
                    )}

                    {selectedSlot && (
                        <button type='submit' className='btn'>
                            Xác Nhận Đặt Lịch
                        </button>
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

            <Footer />
        </div>
    );
};

export default DoctorLoad;
