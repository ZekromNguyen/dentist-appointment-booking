import { useEffect, useState } from 'react';
import axios from 'axios';
import "./ManageDentist.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { checkSession } from "../../Service/userService";
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import BASE_URL from '../../ServiceSystem/axios';

const ManageDentist = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [dentistID, setDentistID] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra session khi component được mount
        const fetchSession = async () => {
            const dentistId = await checkSession();
            if (dentistId === null) {
                setDentistID(null);
                navigate('/login');
            } else {
                setDentistID(dentistId);
            }
        };
        fetchSession();
    }, [navigate]);

    useEffect(() => {
        const fetchScheduleData = async () => {
            if (dentistID) {
                try {
                    const response = await axios.get(`${BASE_URL}/getDentistSchedule`, {
                        params: {
                            dentistId: dentistID.dentistId
                        }
                    });
                    if (response.status !== 200) {
                        throw new Error('Failed to fetch dentist schedule');
                    }
                    setScheduleData(response.data.newDentistScheduleByDentistId);
                } catch (error) {
                    console.error("There was an error fetching the data!", error);
                }
            }
        };
        fetchScheduleData();
    }, [dentistID]);

    const handleView = (schedule) => {
        setSelectedSchedule(schedule);
        setStatus(schedule.Status); // Set the current status in the state
        setShowModal(true);
        console.log('View button clicked for schedule:', schedule);
    };
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };
    const handleClose = () => setShowModal(false);
    const handleSave = async () => {
        // Logic to save the new status
        try {
            await axios.put(`${BASE_URL}/updateScheduleStatus`, {
                ScheduleID: selectedSchedule.ScheduleID,
                Status: status
            });
            // Update the local state with the new status
            setScheduleData(scheduleData.map(schedule =>
                schedule.ScheduleID === selectedSchedule.ScheduleID
                    ? { ...schedule, Status: status }
                    : schedule
            ));
            setShowModal(false);
        } catch (error) {
            console.error("There was an error updating the status!", error);
        }
    };

    return (
        <div>
            <h1>Dentist Schedule</h1>
            <table>
                <thead>
                    <tr>
                        <th>ScheduleID</th>
                        <th>DentistName</th>
                        <th>Date</th>
                        <th>SlotTime</th>
                        <th>CustomerName</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {scheduleData.map((schedule) => (
                        <tr key={schedule.ScheduleID}>
                            <td>{schedule.ScheduleID}</td>
                            <td>{schedule.Dentist.DentistName}</td>
                            <td>{schedule.Date}</td>
                            <td>{schedule.AvailableSlot.Time}</td>
                            <td>{schedule.BookingDetail?.Booking?.Customer?.CustomerName || 'N/A'}</td>
                            <td>{schedule.Status}</td>
                            <td>
                                <button onClick={() => handleView(schedule)} className="btn btn-primary">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Schedule Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSchedule && (
                        <div>
                            <p><strong>ScheduleID:</strong> {selectedSchedule.ScheduleID}</p>
                            <p><strong>DentistName:</strong> {selectedSchedule.Dentist.DentistName}</p>
                            <p><strong>Date:</strong> {selectedSchedule.Date}</p>
                            <p><strong>SlotTime:</strong> {selectedSchedule.AvailableSlot.Time}</p>
                            <p><strong>CustomerName:</strong> {selectedSchedule.BookingDetail?.Booking?.Customer?.CustomerName || 'N/A'}</p>
                            <Form.Group controlId="formStatus">
                                <Form.Label><strong>Status:</strong></Form.Label>
                                <Form.Control as="select" value={status} onChange={handleStatusChange}>
                                    <option value="Booked">Booked</option>
                                    <option value="Cancelled">Cancelled</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageDentist;