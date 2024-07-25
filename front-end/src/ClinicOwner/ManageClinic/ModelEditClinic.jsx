import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../../ServiceSystem/axios';

const EditClinicModal = ({ show, handleClose, clinic, onClinicUpdated }) => {
  const [updatedClinic, setUpdatedClinic] = useState(clinic);

  useEffect(() => {
    setUpdatedClinic(clinic);
  }, [clinic]);

  const handleChange = (e) => {
    setUpdatedClinic({ ...updatedClinic, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/clinics/${updatedClinic.ClinicID}`, updatedClinic, {
        headers: { 'Content-Type': 'application/json' },
      });
      onClinicUpdated(response.data);
      handleClose();
    } catch (error) {
      console.error('Error updating clinic:', error);
    }
  };

  // Generate hour options from 00 to 23
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Clinic</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Clinic Name</Form.Label>
            <Form.Control
              type="text"
              name="ClinicName"
              value={updatedClinic.ClinicName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="Address"
              value={updatedClinic.Address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Open Time</Form.Label>
            <Form.Control
              as="select"
              name="OpenTime"
              value={updatedClinic.OpenTime.split(':')[0]} // Display only hours
              onChange={(e) => setUpdatedClinic({ ...updatedClinic, OpenTime: `${e.target.value}:00:00` })}
            >
              <option value="">Select hour</option>
              {hours.map(hour => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Close Time</Form.Label>
            <Form.Control
              as="select"
              name="CloseTime"
              value={updatedClinic.CloseTime.split(':')[0]} // Display only hours
              onChange={(e) => setUpdatedClinic({ ...updatedClinic, CloseTime: `${e.target.value}:00:00` })}
            >
              <option value="">Select hour</option>
              {hours.map(hour => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Location ID</Form.Label>
            <Form.Control
              type="number"
              name="LocationID"
              value={updatedClinic.LocationID}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="Description"
              value={updatedClinic.Description}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditClinicModal;
