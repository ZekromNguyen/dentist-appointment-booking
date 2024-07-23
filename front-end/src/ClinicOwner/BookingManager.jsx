import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Modal, Button, Form, Nav } from "react-bootstrap";
import "./BookingManager.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import BASE_URL from "../ServiceSystem/axios";

class BookingManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      showModal: false,
      selectedDetailId: null,
      selectedStatus: "",
      filterStatus: "Pending", // default filter status
    };
  }

  async componentDidMount() {
    await this.handleGetAllBookings();
  }

  handleGetAllBookings = async () => {
    try {
      const data = JSON.parse(localStorage.getItem('account'));
      const OwnerId = data.clinicOwnerId;
      const response = await axios.get(`${BASE_URL}/getAllBooking?OwnerId=${OwnerId}`);
      if (response.data && response.data.bookings) {
        this.setState({
          bookings: response.data.bookings,
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  handleOpenModal = (detailId, status) => {
    this.setState({
      showModal: true,
      selectedDetailId: detailId,
      selectedStatus: status, // lấy trạng thái của chi tiết
    });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      selectedDetailId: null,
      selectedStatus: "",
    });
  };

  handleChangeStatus = async () => {
    const { selectedDetailId, selectedStatus } = this.state;
    try {
        const updateStatus = {
            DetailID: selectedDetailId,
            Status: selectedStatus,
        };
        const response = await axios.put(
            `${BASE_URL}/updateBookingDetailStatus`,
            updateStatus
        );
        if (
            response.status === 200 &&
            response.data.updateBookingDetail !== null
        ) {
            // Refresh the bookings data
            await this.handleGetAllBookings(); 

            // Update filterStatus to the new status after successful update
            this.setState({
                showModal: false,
                selectedDetailId: null,
                selectedStatus: "",
                filterStatus: selectedStatus, // Update filter status
            });
        } else {
            alert("Error updating status");
        }
    } catch (error) {
        console.error("Error updating status:", error);
    }
  };

  handleStatusChange = (event) => {
    this.setState({ selectedStatus: event.target.value });
  };

  toVietnamTime = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 7); // Cộng thêm 7 giờ để đúng với giờ Việt Nam
    return date;
  };

  handleFilterChange = (selectedStatus) => {
    this.setState({ filterStatus: selectedStatus });
  };

  render() {
    const { bookings, showModal, selectedStatus, filterStatus } = this.state;

    // Filter bookings based on the selected status
    const filteredBookings = bookings.filter((booking) =>
        booking.BookingDetails.some((detail) => detail.Status === filterStatus)
    );
    
    return (
        <div className="Manage-booking">
            <div className="manage-title">Manage Bookings</div>
    
            {/* Centered Navigation for filtering bookings by status */}
            <div className="d-flex justify-content-center my-3">
                <Nav
                    variant="tabs"
                    activeKey={filterStatus}
                    onSelect={this.handleFilterChange}
                >
                    <Nav.Item>
                        <Nav.Link eventKey="Pending">Pending</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Confirmed">Confirmed</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Completed">Completed</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Cancelled">Cancelled</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
    
            <div className="booking-table mt-3 mx-3">
                <table>
                    <thead>
                        <tr>
                            <th>BookingDetailID</th>
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
                        {filteredBookings.map((booking) => (
                            <React.Fragment key={booking.BookingID}>
                                {booking.BookingDetails.map((detail) => (
                                    <tr key={`${detail.BookingDetailID}`}>
                                        <td>{detail.BookingDetailID}</td>
                                        <td>{booking.Customer.CustomerName}</td>
                                        <td>
                                            {this.toVietnamTime(detail.DateBook).toLocaleString(
                                                "vi-VN"
                                            )}
                                        </td>
                                        <td>{detail.TypeBook}</td>
                                        <td>
                                            {new Date(detail.MedicalDay).toLocaleDateString(
                                                "vi-VN"
                                            )}
                                        </td>
                                        <td>{detail.DentistSchedule?.AvailableSlot?.Time}</td>
                                        <td>{detail.DentistSchedule?.Dentist?.DentistName}</td>
                                        <td>{detail.Status}</td>
                                        <td>
                                            {parseFloat(detail.PriceBooking).toLocaleString(
                                                "vi-VN"
                                            )}{" "}
                                            VNĐ
                                        </td>
                                        <td>
                                            <Button
                                                onClick={() =>
                                                    this.handleOpenModal(
                                                        detail.BookingDetailID,
                                                        detail.Status
                                                    )
                                                }
                                            >
                                                Change Status
                                            </Button>
                                        </td>
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

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingManager);
