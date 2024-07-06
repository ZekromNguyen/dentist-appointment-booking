import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddClinicModal = ({ show, handleClose, onClinicAdded }) => {
  const [clinic, setClinic] = useState({
    ClinicName: '',
    Address: '',
    OpenTime: '',
    CloseTime: '',
    LocationID: ''
  });

  const handleChange = (e) => {
    setClinic({ ...clinic, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clinic)
      });
      const data = await response.json();
      onClinicAdded(data);
      handleClose();
    } catch (error) {
      console.error('Error adding clinic:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Clinic</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Clinic Name</Form.Label>
            <Form.Control
              type="text"
              name="ClinicName"
              value={clinic.ClinicName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="Address"
              value={clinic.Address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Open Time</Form.Label>
            <Form.Control
              type="time"
              name="OpenTime"
              value={clinic.OpenTime}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Close Time</Form.Label>
            <Form.Control
              type="time"
              name="CloseTime"
              value={clinic.CloseTime}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Location ID</Form.Label>
            <Form.Control
              type="number"
              name="LocationID"
              value={clinic.LocationID}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="primary" type="submit">
              Add Clinic
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

export default AddClinicModal;
