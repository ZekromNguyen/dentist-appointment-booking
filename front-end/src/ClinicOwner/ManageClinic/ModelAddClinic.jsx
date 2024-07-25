import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../ServiceSystem/axios';

const AddClinicModal = ({ show, handleClose, onClinicAdded }) => {
  const [clinic, setClinic] = useState({
    ClinicName: '',
    Address: '',
    OpenTime: '',
    CloseTime: '',
    LocationID: '',
    Description: '',
    image: null,
  });
  const [locations, setLocations] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  const Data = JSON.parse(localStorage.getItem('account'));
  const clinicOwnerID = Data ? Data.clinicOwnerId : null;

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/handleGetAllLocation`, {
          params: { LocationID: 'ALL' },
        });

        if (response.data && response.data.errCode === 0) {
          setLocations(response.data.account); // Update this based on the response structure
        } else {
          console.error('Error fetching locations:', response.data);
          setError('Error fetching locations.');
        }
      } catch (error) {
        toast.error('Error fetching locations.');
        console.error('Error fetching locations:', error);
        setError('Error fetching locations.');
      }
    };

    fetchLocations();
  }, []);

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

  const validateTimes = () => {
    const [openHour] = clinic.OpenTime.split(':').map(Number);
    const [closeHour] = clinic.CloseTime.split(':').map(Number);

    return openHour < closeHour;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateTimes()) {
      toast.error('Open Time must be earlier than Close Time.');
      return;
    }

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
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Clinic added successfully!');
      onClinicAdded(response.data);
      handleClose();
      window.location.reload();
    } catch (error) {
      toast.error('Error adding clinic. Please try again.');
      console.error('Error adding clinic:', error);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <>
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
                as="select"
                name="OpenTime"
                value={clinic.OpenTime.split(':')[0]} // Display hours only
                onChange={(e) => setClinic({ ...clinic, OpenTime: `${e.target.value}:00` })}
              >
                <option value="">Select hour</option>
                {hours.map((hour, index) => (
                  <option key={`open-${index}-${hour}`} value={hour}>
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
                value={clinic.CloseTime.split(':')[0]} // Display hours only
                onChange={(e) => setClinic({ ...clinic, CloseTime: `${e.target.value}:00` })}
              >
                <option value="">Select hour</option>
                {hours.map((hour, index) => (
                  <option key={`close-${index}-${hour}`} value={hour}>
                    {hour}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                as="select"
                name="LocationID"
                value={clinic.LocationID}
                onChange={handleChange}
                required
              >
                <option>Select location</option>
                {locations.map((location) => (
                  <option key={`location-${location.LocationID}`} value={location.LocationID}>
                    {location.LocationName} {/* Ensure this field exists in your data */}
                  </option>
                ))}
              </Form.Control>
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
      <ToastContainer />
    </>
  );
};

export default AddClinicModal;
