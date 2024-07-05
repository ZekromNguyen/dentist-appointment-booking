import React, { useEffect, useState } from 'react';
import BookingService from '../../Service/bookingService';
import './doctor.scss';
import Header from '../Header/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import { checkSession } from '../../Service/userService';
import BookingDetails from '../Booking/BookingDetails';
import BASE_URL from '../../ServiceSystem/axios';

export default function DoctorLoad() {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;

    const [dentist, setDentist] = useState(null);
    const [treatmentDate, setTreatmentDate] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [customerId, setCustomerId] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [showBookingDetails, setShowBookingDetails] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(50000); // Giá mặc định

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const customer = await checkSession();
                if (customer) {
                    setCustomerId(customer.customerId);
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
        const fetchSchedules = async () => {
            if (dentist && treatmentDate) {
                setLoading(true);
                try {
                    const response = await BookingService.getSlotsByDateByDentistService(dentist.DentistID, treatmentDate);
                    setSchedules(response.data);
                    setError('');
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

    const handleSelectDate = (date) => {
        setTreatmentDate(date);
        setSelectedSchedule(null);
    };

    const handleSelectSchedule = (schedule) => {
        setSelectedSchedule(schedule);
    };

    const handleConfirmBooking = async () => {
        if (!loggedIn) {
            alert('Vui lòng đăng nhập để đặt lịch khám.');
            return;
        }

        if (!selectedSchedule || !selectedSchedule.AvailableSlot) {
            alert('Vui lòng chọn một lịch khám có sẵn.');
            return;
        }

        if (!selectedSchedule ||!selectedSchedule.ScheduleID) {
            alert('Lịch khám được chọn không hợp lệ.');
            return;
        }

        const bookingData = {
            bookings: [{
                customerId,
                price: selectedPrice,
                status: 'Pending',
                typeBook: 'SomeType', // Loại đặt lịch thực tế
                date: treatmentDate,
                scheduleId: selectedSchedule.ScheduleID,
            }]
        };

        try {
            setLoading(true);
            const bookingResponse = await BookingService.createBooking(bookingData);

            if (bookingResponse.status === 200) {
                alert('Đặt lịch thành công!');
                setBookingDetails([...bookingDetails, ...bookingResponse.data.results.map(result => result.bookingDetail)]);
                setShowBookingDetails(true);
            } else {
                throw new Error('Đặt lịch thất bại');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                alert(`Đặt lịch thất bại: ${error.response.data.message || 'Lỗi không xác định'}`);
            } else if (error.request) {
                console.error('Request data:', error.request);
                alert('Không nhận được phản hồi từ server. Vui lòng thử lại.');
            } else {
                console.error('Error message:', error.message);
                alert('Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCloseBookingDetails = () => {
        setShowBookingDetails(false);
    };

    if (!dentist) {
        return null; // Hoặc hiển thị chỉ số tải
    }
    //<Header />
    return (
        <div className='DoctorLoad'>

            <div className='doctor'>
                <div className='doctor-img' style={{ backgroundImage: `url(${BASE_URL}/${dentist?.ImagePath})` }}></div>
                <div className='doctor-detail'>
                    <div className='doctor-name'>{dentist.DentistName}</div>
                    <div className='doctor-description'>{dentist.Description}</div>
                    <div className='clinic-address'>{dentist.clinic.Address}</div>
                    <div className='clinic-clinicName'>{dentist.clinic.ClinicName}</div>
                </div>
            </div>
            <div className='clinic-time-title'>Giờ hoạt động</div>
            <div className='clinic-time'>
                {dentist.clinic.OpenTime} - {dentist.clinic.CloseTime}
            </div>
            <div className='clinic-time-schedule'>Chọn ngày khám</div>
            <div className='schedule_date'>
                <input
                    type="date"
                    id="treatmentDate"
                    name="treatmentDate"
                    value={treatmentDate}
                    onChange={(e) => handleSelectDate(e.target.value)}
                    required
                />
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : treatmentDate && schedules.length === 0 ? (
                <p>Không có lịch khám cho ngày đã chọn.</p>
            ) : (
                <div className='schedule-list'>
                    {schedules.map(schedule => (
                        <div
                            key={schedule.ScheduleID}
                            className={`schedule-item ${schedule.Status === 'Available' ? 'available' : ''} ${selectedSchedule?.ScheduleID === schedule.ScheduleID ? 'selected' : ''}`}
                            onClick={() => handleSelectSchedule(schedule)}
                        >
                            <div className='schedule_dayOfWeek'>{schedule.DayOfWeek}</div>
                            <div className='schedule_time'>{schedule.AvailableSlot ? schedule.AvailableSlot.Time : 'Không khả dụng'}</div>
                        </div>
                    ))}
                </div>
            )}
            {selectedSchedule && (
                <div className='selected-price'>
                    Giá tiền: {selectedPrice} VNĐ
                </div>
            )}
            {selectedSchedule && (
                <button className='booking-submit' onClick={handleConfirmBooking}>Xác nhận đặt lịch</button>
            )}
            <Footer />

            <BookingDetails
                show={showBookingDetails}
                handleClose={handleCloseBookingDetails}
                bookingDetails={bookingDetails}
            />
        </div>
    );
}
