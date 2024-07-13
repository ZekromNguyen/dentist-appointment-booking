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
              type="time"
              name="OpenTime"
              value={updatedClinic.OpenTime}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Close Time</Form.Label>
            <Form.Control
              type="time"
              name="CloseTime"
              value={updatedClinic.CloseTime}
              onChange={handleChange}
            />
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
