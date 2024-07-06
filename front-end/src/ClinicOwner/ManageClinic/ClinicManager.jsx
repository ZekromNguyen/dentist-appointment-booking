import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import AddClinicModal from './ModelAddClinic';
import ClinicList from './ClinicList';
import BASE_URL from "../../ServiceSystem/axios";

const ClinicManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [clinics, setClinics] = useState([]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleClinicAdded = (newClinic) => {
    setClinics([...clinics, newClinic]);
  };

  const fetchClinics = async () => {
    try {
      const ownerData = JSON.parse(localStorage.getItem('account'));
      const clinicOwnerId = ownerData.clinicOwnerId;
      const response = await axios.get(`${BASE_URL}/getAllClinic`, {
        params: {
          ownerId: clinicOwnerId
        }
      });
      if (response.data && response.data.clinics) {
        setClinics(response.data.clinics);
      }
    } catch (error) {
      console.error('Error fetching clinics:', error);
      // Handle error as needed
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  return (
    <div>
      <h1>Manage Clinics</h1>
      <Button variant="primary" onClick={handleShow}>
        Add New Clinic
      </Button>
      <AddClinicModal show={showModal} handleClose={handleClose} onClinicAdded={handleClinicAdded} />
      <ClinicList clinics={clinics} />
    </div>
  );
};

export default ClinicManager;
