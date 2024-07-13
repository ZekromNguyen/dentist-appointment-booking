import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../../ServiceSystem/axios';

const AddClinicModal = ({ show, handleClose, onClinicAdded }) => {
  const [clinic, setClinic] = useState({
    ClinicName: '',
    Address: '',
    OpenTime: '',
    CloseTime: '',
    LocationID: '',
    Description: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  const Data = JSON.parse(localStorage.getItem('account'));
  const clinicOwnerID = Data ? Data.clinicOwnerId : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClinic({ ...clinic, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setClinic({ ...clinic, image: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('ClinicName', clinic.ClinicName);
    formData.append('Address', clinic.Address);
    formData.append('OpenTime', clinic.OpenTime);
    formData.append('CloseTime', clinic.CloseTime);
    formData.append('LocationID', clinic.LocationID);
    formData.append('Description', clinic.Description);
    formData.append('image', clinic.image);
    formData.append('ClinicOwnerID', clinicOwnerID);
    try {
      const response = await axios.post(`${BASE_URL}/clinics`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onClinicAdded(response.data);
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
        <Form onSubmit={handleSubmit} encType='multipart/form-data'>
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
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="Description"
              value={clinic.Description}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Selected"
                  style={{ width: '100%', maxHeight: '300px' }}
                />
              </div>
            )}
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
