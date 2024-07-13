import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../ServiceSystem/axios';
import { Modal, Button, Form } from 'react-bootstrap';
import './treatment.scss';

const TreatmentUpload = () => {
    const [bookings, setBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [bookingDetailId, setBookingDetailId] = useState('');
    const [note, setNote] = useState('');
    const [treatmentDate, setTreatmentDate] = useState('');
    const [resultImage, setResultImage] = useState(null);
    const [editingTreatmentId, setEditingTreatmentId] = useState(null);
    const [treatments, setTreatments] = useState([]);
    const [hasUploaded, setHasUploaded] = useState(false);
    const [dentistId, setDentistId] = useState(null);

    useEffect(() => {
        const accountData = localStorage.getItem('account');
        if (accountData) {
            const parsedAccountData = JSON.parse(accountData);
            const dentistIdFromLogin = parsedAccountData.dentistId;
            if (dentistIdFromLogin) {
                setDentistId(dentistIdFromLogin);
            }
        }
    }, []);

    useEffect(() => {
        if (dentistId) {
            handleGetAllBookings(dentistId);
            fetchTreatments();
        }
    }, [dentistId]);

    const handleGetAllBookings = async (dentistId) => {
        try {
            const response = await axios.get(`${BASE_URL}/getAllBooking`);
            if (response.data && response.data.bookings) {
                const filteredBookings = response.data.bookings.filter(booking =>
                    booking.BookingDetails.some(detail => detail.DentistSchedule.DentistID === dentistId)
                );
                setBookings(filteredBookings);
                console.log("check filter", filteredBookings)
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };
    const fetchTreatments = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/treatment`);
            setTreatments(Array.isArray(response.data.treatments) ? response.data.treatments : []);
        } catch (error) {
            console.error('Error fetching treatments:', error);
        }
    };

    const handleOpenModal = (bookingId, currentStatus) => {
        setShowModal(true);
        setSelectedBookingId(bookingId);
        setSelectedStatus(currentStatus);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBookingId(null);
        setSelectedStatus('');
    };

    const handleOpenUploadModal = (bookingDetailId) => {
        setShowUploadModal(true);
        setBookingDetailId(bookingDetailId);
    };

    const handleCloseUploadModal = () => {
        setShowUploadModal(false);
        setBookingDetailId('');
        setNote('');
        setTreatmentDate('');
        setResultImage(null);
        setHasUploaded(false); // Đặt lại trạng thái upload khi đóng modal
    };

    const handleOpenEditModal = (treatment) => {
        setEditingTreatmentId(treatment.TreatmentID);
        setNote(treatment.Note);
        setTreatmentDate(new Date(treatment.TreatmentDate).toISOString().split('T')[0]);
        setResultImage(treatment.Result);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingTreatmentId(null);
        setNote('');
        setTreatmentDate('');
        setResultImage(null);
    };

    // const handleChangeStatus = async () => {
    //     const { selectedBookingId, selectedStatus } = this.state;
    //     try {
    //         const updateStatus = {
    //             BookingID: selectedBookingId,
    //             Status: selectedStatus,
    //         };
    //         const response = await axios.put(`${BASE_URL}/updateBookingStatus`, updateStatus);
    //         if (response.status === 200 && response.data.updateBooking !== null) {
    // //             Update the state to reflect the new status
    //             const updatedBookings = this.state.bookings.map(booking => {
    //                 if (booking.BookingID === selectedBookingId) {
    //                     return {
    //                         ...booking,
    //                         BookingDetails: booking.BookingDetails.map(detail => ({
    //                             ...detail,
    //                             Status: selectedStatus
    //                         }))
    //                     };
    //                 }
    //                 return booking;
    //             });
    //             this.setState({ bookings: updatedBookings, showModal: false });
    //         } else {
    //             alert('Error updating status');
    //         }
    //     } catch (error) {
    //         console.error('Error updating status:', error);
    //     }
    // };

    const handleChangeStatus = async () => {
        try {
            const updateStatus = {
                BookingID: selectedBookingId,
                Status: selectedStatus,
            };
            const response = await axios.put(`${BASE_URL}/updateBookingStatus`, updateStatus);
            if (response.status === 200 && response.data.updateBooking !== null) {
                const updatedBookings = bookings.map(booking =>
                    booking.BookingID === selectedBookingId ? { ...booking, Status: selectedStatus } : booking
                );
                setBookings(updatedBookings);
                setShowModal(false);
            } else {
                alert('Error updating status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleSubmitUpload = async (event) => {
        event.preventDefault();

        if (hasUploaded) {
            alert('Đã upload');
            return;
        }

        const formData = new FormData();
        formData.append('BookingDetailID', bookingDetailId);
        formData.append('Note', note);
        formData.append('TreatmentDate', treatmentDate);
        formData.append('Result', resultImage);

        try {
            await axios.post(`${BASE_URL}/treatments`, formData);
            alert('Treatment uploaded successfully');
            handleCloseUploadModal();
            fetchTreatments();
            setHasUploaded(true); // Đánh dấu là đã upload
        } catch (error) {
            console.error('Error handling treatment:', error);
        }
    };

    const handleSubmitEdit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('Note', note);
        formData.append('TreatmentDate', treatmentDate);
        if (resultImage) {
            formData.append('Result', resultImage);
        }

        try {
            await axios.patch(`${BASE_URL}/treatments/${editingTreatmentId}`, formData); // Chỉnh lại endpoint PATCH thành '/treatments/:id'
            alert('Treatment updated successfully');
            handleCloseEditModal();
            fetchTreatments();
        } catch (error) {
            console.error('Error handling treatment:', error);
        }
    };

    const handleDelete = async (treatmentId) => {
        try {
            await axios.delete(`${BASE_URL}/treatments/${treatmentId}`);
            alert('Treatment deleted successfully');
            fetchTreatments();
        } catch (error) {
            console.error('Error deleting treatment:', error);
        }
    };
    const toVietnamTime = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() - 7); // Cộng thêm 7 giờ để đúng với giờ Việt Nam
        return date;
    };

    return (
        <div className='treatment-booking'>
            <div className='treatment-title mt-100'>Treatment Patients</div>
            <div className='treatment-table-as mt-30 mx-10'>
                <table>
                    <thead>
                        <tr>
                            <th>BookingID</th>
                            <th>CustomerName</th>
                            <th>BookingDate</th>
                            <th>TypeBook</th>
                            <th>TreatmentDate</th>
                            <th>Time</th>
                            <th>DentistName</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>TreatmentID</th>
                            <th>Result Day</th>
                            <th>Note</th>
                            <th>Result Image</th>
                            <th>Action</th>
                            <th>Upload Result</th>
                        </tr>
                    </thead>
                    <tbody id='font-body'>
                        {bookings.map((booking) => (
                            <React.Fragment key={booking.BookingID}>
                                {booking.BookingDetails.map((detail, index) => {
                                    const relatedTreatments = treatments.filter(treatment => treatment.BookingDetailID === detail.BookingDetailID);
                                    return (
                                        <tr key={`${booking.BookingID}-${index}`}>
                                            {relatedTreatments.length > 0 ? relatedTreatments.map((treatment) => (
                                                <React.Fragment key={treatment.TreatmentID}>
                                                    {index === 0 && (
                                                        <>
                                                            <td rowSpan={booking.BookingDetails.length}>{booking.BookingID}</td>
                                                            <td rowSpan={booking.BookingDetails.length}>{booking.Customer.CustomerName}</td>
                                                        </>
                                                    )}
                                                    <td>{(detail.DateBook).toLocaleString('vi-VN')}</td>
                                                    <td>{detail.TypeBook}</td>
                                                    <td>{new Date(detail.MedicalDay).toLocaleDateString('vi-VN')}</td>
                                                    <td>{detail.DentistSchedule?.AvailableSlot?.Time}</td>
                                                    <td>{detail.DentistSchedule?.Dentist?.DentistName}</td>
                                                    <td>{detail.Status}</td>
                                                    <td>{parseFloat(detail.PriceBooking).toLocaleString('vi-VN')} VND</td>
                                                    <td>{treatment.TreatmentID}</td>
                                                    <td>{new Date(treatment.TreatmentDate).toLocaleDateString('vi-VN')}</td>
                                                    <td>{treatment.Note}</td>
                                                    <td>
                                                        <img
                                                            src={`${BASE_URL}${treatment.Result}`}
                                                            alt={`${treatment.TreatmentID}'s result`}
                                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Button className='button-change' onClick={() => handleOpenModal(booking.BookingID, booking.Status)}>
                                                            Change Status
                                                        </Button>
                                                        <Button variant="warning" onClick={() => handleOpenEditModal(treatment)}>Edit Treatment</Button>
                                                        <Button variant="danger" onClick={() => handleDelete(treatment.TreatmentID)}>Delete Treatment</Button>
                                                    </td>
                                                    {index === 0 && (
                                                        <td rowSpan={booking.BookingDetails.length}>
                                                            <Button className='button-upload' onClick={() => handleOpenUploadModal(detail.BookingDetailID)}>Upload</Button>
                                                        </td>
                                                    )}
                                                </React.Fragment>
                                            )) : (
                                                <>
                                                    {index === 0 && (
                                                        <>
                                                            <td rowSpan={booking.BookingDetails.length}>{booking.BookingID}</td>
                                                            <td rowSpan={booking.BookingDetails.length}>{booking.Customer.CustomerName}</td>
                                                        </>
                                                    )}
                                                    <td>{new Date(detail.DateBook).toLocaleString()}</td>
                                                    <td>{detail.TypeBook}</td>
                                                    <td>{new Date(detail.MedicalDay).toLocaleDateString()}</td>
                                                    <td>{detail.DentistSchedule?.AvailableSlot?.Time}</td>
                                                    <td>{detail.DentistSchedule?.Dentist?.DentistName}</td>
                                                    <td>{detail.Status}</td>
                                                    <td>{detail.PriceBooking}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                        <Button className='button-change' onClick={() => handleOpenModal(booking.BookingID, booking.Status)}>
                                                            Change Status
                                                        </Button>
                                                    </td>
                                                    {index === 0 && (
                                                        <td rowSpan={booking.BookingDetails.length}>
                                                            <Button className='button-upload' onClick={() => handleOpenUploadModal(detail.BookingDetailID)}>Upload</Button>
                                                        </td>
                                                    )}
                                                </>
                                            )}
                                        </tr>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for changing booking status */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Booking Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="statusSelect">
                        <Form.Label>Status</Form.Label>
                        <Form.Control as="select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Cancelled">Completed</option>
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleChangeStatus}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for uploading treatment result */}
            <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Treatment Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitUpload}>
                        <Form.Group controlId="note">
                            <Form.Label>Note</Form.Label>
                            <Form.Control type="text" value={note} onChange={(e) => setNote(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="treatmentDate">
                            <Form.Label>Treatment Date</Form.Label>
                            <Form.Control type="date" value={treatmentDate} onChange={(e) => setTreatmentDate(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="resultImage">
                            <Form.Label>Result Image</Form.Label>
                            <Form.Control type="file" onChange={(e) => setResultImage(e.target.files[0])} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Upload
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for editing treatment result */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Treatment Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitEdit}>
                        <Form.Group controlId="note">
                            <Form.Label>Note</Form.Label>
                            <Form.Control type="text" value={note} onChange={(e) => setNote(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="treatmentDate">
                            <Form.Label>Treatment Date</Form.Label>
                            <Form.Control type="date" value={treatmentDate} onChange={(e) => setTreatmentDate(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="resultImage">
                            <Form.Label>Result Image</Form.Label>
                            <Form.Control type="file" onChange={(e) => setResultImage(e.target.files[0])} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TreatmentUpload;

