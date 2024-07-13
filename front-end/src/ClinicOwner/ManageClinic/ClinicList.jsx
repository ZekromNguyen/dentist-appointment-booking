import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import EditClinicModal from './ModelEditClinic';
import './ClinicList.scss';

const ClinicList = ({ clinics, onClinicUpdated }) => {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = (clinic) => {
    setSelectedClinic(clinic);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setSelectedClinic(null);
  };

  const handleClinicUpdated = (updatedClinic) => {
    // Cập nhật danh sách phòng khám với phòng khám đã được chỉnh sửa
    const updatedClinics = clinics.map(clinic =>
      clinic.ClinicID === updatedClinic.ClinicID ? updatedClinic : clinic
    );
    onClinicUpdated(updatedClinics);
  };

  return (
    <div className='clinicListContainer'>
      <h2>Clinics</h2>
      <Table striped bordered hover className='table'>
        <thead>
          <tr>
            <th>ClinicID</th>
            <th>Clinic Name</th>
            <th>Address</th>
            <th>Open Time</th>
            <th>Close Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clinics.map((clinic) => (
            <tr key={clinic.ClinicID}>
              <td>{clinic.ClinicID}</td>
              <td>{clinic.ClinicName}</td>
              <td>{clinic.Address}</td>
              <td>{clinic.OpenTime}</td>
              <td>{clinic.CloseTime}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditClick(clinic)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedClinic && (
        <EditClinicModal
          show={showEditModal}
          handleClose={handleEditClose}
          clinic={selectedClinic}
          onClinicUpdated={handleClinicUpdated}
        />
      )}
    </div>
  );
};

export default ClinicList;
