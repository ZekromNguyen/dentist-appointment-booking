import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import './BookingManager.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

class BookingManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            showModal: false,
            selectedBookingId: null,
            selectedStatus: ''
        };
    }

    async componentDidMount() {
        await this.handleGetAllBookings();
    }

    handleGetAllBookings = async () => {
        try {
            const response = await axios.get('http://localhost:3000/getAllBooking');
            if (response.data && response.data.bookings) {
                this.setState({
                    bookings: response.data.bookings,
                });
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    handleOpenModal = (bookingId, currentStatus) => {
        this.setState({
            showModal: true,
            selectedBookingId: bookingId,
            selectedStatus: currentStatus
        });
    };

    handleCloseModal = () => {
        this.setState({
            showModal: false,
            selectedBookingId: null,
            selectedStatus: ''
        });
    };

    handleChangeStatus = async () => {
        const { selectedBookingId, selectedStatus } = this.state;
        try {
            const response = await axios.put(`http://localhost:3000/updateBookingStatus`, {
                bookingId: selectedBookingId,
                status: selectedStatus
            });
            if (response.data && response.data.errCode === 0) {
                const updatedBookings = this.state.bookings.map(booking =>
                    booking.BookingID === selectedBookingId ? { ...booking, Status: selectedStatus } : booking
                );
                this.setState({ bookings: updatedBookings, showModal: false });
            } else {
                alert('Error updating status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    handleStatusChange = (event) => {
        this.setState({ selectedStatus: event.target.value });
    };

    render() {
        const { bookings, showModal, selectedStatus } = this.state;
        return (
            <div className='Manage-booking'>
                <div className='mt-100'>Manage Bookings</div>
                <div className='booking-table mt-30 mx-10'>
                    <table>
                        <thead>
                            <tr>
                                <th>BookingID</th>
                                <th>CustomerName</th>
                                <th>BookingDate</th>
                                <th>TypeBook</th>
                                <th>MedicalDay</th>
                                <th>Time</th>
                                <th>DentistName</th>
                                <th>Status</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <React.Fragment key={booking.BookingID}>
                                    {booking.BookingDetails.map((detail, index) => (
                                        <tr key={`${booking.BookingID}-${index}`}>
                                            {index === 0 && (
                                                <td rowSpan={booking.BookingDetails.length}>
                                                    {booking.BookingID}
                                                </td>
                                            )}
                                            {index === 0 && (
                                                <td rowSpan={booking.BookingDetails.length}>
                                                    {booking.Customer.CustomerName}
                                                </td>
                                            )}
                                            <td>{new Date(detail.DateBook).toLocaleString()}</td>
                                            <td>{detail.TypeBook}</td>
                                            <td>{new Date(detail.MedicalDay).toLocaleDateString()}</td>
                                            <td>{detail.DentistSchedule?.AvailableSlot?.Time}</td>
                                            <td>{detail.DentistSchedule?.Dentist?.DentistName}</td>
                                            <td>{detail.Status}</td>
                                            <td>{detail.PriceBooking}</td>
                                            {index === 0 && (
                                                <td rowSpan={booking.BookingDetails.length}>
                                                    <Button onClick={() => this.handleOpenModal(booking.BookingID, booking.Status)}>
                                                        Change Status
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Modal show={showModal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Booking Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedStatus}
                                    onChange={this.handleStatusChange}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleChangeStatus}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingManager);
