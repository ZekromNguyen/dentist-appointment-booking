import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../ServiceSystem/axios';
import { Modal, Button, Form } from 'react-bootstrap';
import './treatment.scss';

const TreatmentUpload = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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

    useEffect(() => {
        filterBookings(searchTerm);
    }, [searchTerm, bookings]);

    const handleGetAllBookings = async (dentistId) => {
        try {
            const response = await axios.get(`${BASE_URL}/getAllBookingByDentist?DentistId=${dentistId}`);
            if (response.data && response.data.bookings) {
                const filteredBookings = response.data.bookings
                    .filter(booking =>
                        booking.BookingDetails.some(detail =>
                            detail.DentistSchedule.DentistID === dentistId &&
                            detail.Status === 'Confirmed'
                        )
                    );
                setBookings(filteredBookings);
                setFilteredBookings(filteredBookings);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const filterBookings = (term) => {
        if (term) {
            const lowercasedTerm = term.toLowerCase();
            const filtered = bookings.filter(booking =>
                booking.Customer.CustomerName.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredBookings(filtered);
        } else {
            setFilteredBookings(bookings);
        }
    };

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
                handleGetAllBookings(dentistId);
            } else {
                alert('Error updating status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const fetchTreatments = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/treatment`);
            setTreatments(Array.isArray(response.data.treatments) ? response.data.treatments : []);
            setHasUploaded(true);
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
        setHasUploaded(false);
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

    const handleSubmitUpload = async (event) => {
        event.preventDefault();
        const hasTreatment = await checkIfTreatmentExists(bookingDetailId);
        if (hasTreatment) {
            alert('This booking already has a treatment result.');
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
        } catch (error) {
            console.error('Error handling treatment:', error);
        }
    };

    const checkIfTreatmentExists = async (bookingDetailId) => {
        try {
            const response = await axios.get(`${BASE_URL}/check/${bookingDetailId}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking treatment existence:', error);
            return false;
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
            await axios.patch(`${BASE_URL}/treatments/${editingTreatmentId}`, formData);
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

    return (
        <div className='treatment-booking'>
            <div className='treatment-title mt-100'>Treatment Patients</div>
            <div className='search-bar mt-30 mx-10'>
                <Form.Control
                    type="text"
                    placeholder="Search by Customer Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className='btn-search mt-2' onClick={() => filterBookings(searchTerm)}>Search</Button>
            </div>
            <div className='treatment-table-as mt-30 mx-10'>
                <table>
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            {/* <th>Booking Date</th> */}
                            <th>Status</th>
                            <th>Medical Date</th>
                            <th>Time</th>
                            <th>Treatment Date</th>
                            <th>Note</th>
                            <th>Result Image</th>
                            <th>Action</th>
                            <th>Upload Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((booking) =>
                            booking.BookingDetails.map((detail) => {
                                const treatment = treatments.find(t => t.BookingDetailID === detail.BookingDetailID);
                                return (
                                    <tr key={detail.BookingDetailID}>
                                        <td>{booking.Customer.CustomerName}</td>
                                        {/* <td>{new Date(detail.DateBook).toLocaleString('vi-VN')}</td> */}
                                        <td>{detail.Status}</td>
                                        <td>{new Date(detail.MedicalDay).toLocaleDateString('vi-VN')}</td>
                                        <td>{detail.DentistSchedule?.AvailableSlot?.Time}</td>
                                        <td>{treatment ? new Date(treatment.TreatmentDate).toLocaleDateString('vi-VN') : '-'}</td>

                                        {/* <td>{new Date(detail.DateBook).toLocaleTimeString('vi-VN')}</td> */}
                                        <td>{treatment ? treatment.Note : '-'}</td>
                                        <td>
                                            {treatment && treatment.Result ? (
                                                <img
                                                    src={`${BASE_URL}${treatment.Result}`}
                                                    alt={`${treatment.TreatmentID}'s result`}
                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                />) : '-'}
                                        </td>
                                        <td>
                                            <Button variant='primary' onClick={() => handleOpenModal(detail.BookingID, detail.Status)}>Change Status</Button>
                                            {treatment && (
                                                <>
                                                    <Button variant='success' onClick={() => handleOpenEditModal(treatment)}>Edit</Button>
                                                    {/* <Button variant='danger' onClick={() => handleDelete(treatment.TreatmentID)}>Delete</Button> */}
                                                </>
                                            )}
                                        </td>
                                        <td>
                                            <Button variant='secondary' onClick={() => handleOpenUploadModal(detail.BookingDetailID)}>Upload Result</Button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Select Status</Form.Label>
                            <Form.Control as="select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                                <option value="">Select...</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Completed">Completed</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" onClick={handleChangeStatus}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Treatment Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitUpload}>
                        <Form.Group controlId="formNote">
                            <Form.Label>Note</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formTreatmentDate">
                            <Form.Label>Treatment Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={treatmentDate}
                                onChange={(e) => setTreatmentDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formResultImage">
                            <Form.Label>Result Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setResultImage(e.target.files[0])}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Upload
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUploadModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Treatment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitEdit}>
                        <Form.Group controlId="formNote">
                            <Form.Label>Note</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formTreatmentDate">
                            <Form.Label>Treatment Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={treatmentDate}
                                onChange={(e) => setTreatmentDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formResultImage">
                            <Form.Label>Result Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setResultImage(e.target.files[0])}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TreatmentUpload;