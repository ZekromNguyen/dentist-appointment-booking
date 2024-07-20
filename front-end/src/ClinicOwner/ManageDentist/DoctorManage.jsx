import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllDentist, deleteDentist, handleEditDentist } from '../../Service/userService';
import ModelAddDentist from './ModelAddDentist';
import ModelEditDentist from './ModelEditDentist';
import './DoctorManage.scss'; // Ensure correct SCSS path
import 'bootstrap/dist/css/bootstrap.min.css';
import BASE_URL from '../../ServiceSystem/axios';

class DoctorManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDentists: [],
      isOpenModalAddDentist: false,
      isOpenModalEditDentist: false,
      doctorEdit: {},
    };
  }

  async componentDidMount() {
    await this.handleGetAllDentists();
  }

  handleGetAllDentists = async () => {
    try {
      const response = await getAllDentist('ALL');
      if (response && response.errCode === 0) {
        this.setState({
          arrDentists: response.account,
        });
      } else {
        console.error('Error fetching dentists:', response);
      }
    } catch (error) {
      console.error('Error fetching dentists:', error);
    }
  };

  handleAddNewDentist = () => {
    this.setState({
      isOpenModalAddDentist: true,
    });
  };

  toggleAddDentistModal = () => {
    this.setState({
      isOpenModalAddDentist: !this.state.isOpenModalAddDentist,
    });
  };

  toggleEditDentistModal = () => {
    this.setState({
      isOpenModalEditDentist: !this.state.isOpenModalEditDentist,
    });
  };

  handleDentistUpdated = () => {
    this.setState({
      isOpenModalEditDentist: false,
      isOpenModalAddDentist: false,
    });
    this.handleGetAllDentists();
  };

  handleDeleteDoctor = async (doctor) => {
    try {
      const response = await deleteDentist(doctor.DentistID);
      if (response && response.errCode === 0) {
        this.handleGetAllDentists();
      } else {
        console.error('Error deleting dentist:', response);
      }
    } catch (error) {
      console.error('Error deleting dentist:', error);
    }
  };

  handleEditDoctor = (doctor) => {
    this.setState({
      doctorEdit: doctor,
      isOpenModalEditDentist: true,
    });
  };

  render() {
    const { arrDentists, isOpenModalAddDentist, isOpenModalEditDentist, doctorEdit } = this.state;

    return (
      <div className='Manage-doctor'>
        {isOpenModalAddDentist && (
          <ModelAddDentist
            isOpen={isOpenModalAddDentist}
            toggleFromParent={this.toggleAddDentistModal}
            onDentistAdded={this.handleDentistUpdated}
          />
        )}
        {isOpenModalEditDentist && (
          <ModelEditDentist
            isOpen={this.state.isOpenModalEditDentist}
            toggleFromParent={this.toggleEditDentistModal}
            onDentistUpdated={this.handleDentistUpdated}
            currentDentist={this.state.doctorEdit}
            doctor={doctorEdit}
          />
        )}

        <div className='dentist-title'>Manage Dentist</div>
        <button
          className='btn-add btn-primary px-3 ml-2'
          onClick={this.handleAddNewDentist}
        >
          Add new dentist
        </button>
        <div className='doctor-table mt-30 mx-10'>
          <table id='doctors'>
            <thead>
              <tr>
                <th>DentistID</th>
                <th>DentistName</th>
                <th>DentistImage</th>
                <th>AccountID</th>
                <th>ClinicID</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {arrDentists.map((item, index) => (
                <tr key={index}>
                  <td>{item.DentistID}</td>
                  <td>{item.DentistName}</td>
                  <td>
                    <img
                      src={`${BASE_URL}/${item.ImagePath}`} // Đảm bảo rằng đường dẫn URL là đúng
                      alt={`${item.DentistName}'s profile`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{item.AccountID}</td>
                  <td>{item.ClinicID}</td>
                  <td>{item.Description}</td>
                  <td>
                    <button className='button-edit' style={{ fontSize: "15px" }} onClick={() => this.handleEditDoctor(item)}>Edit</button>
                    <button className='button-delete' style={{ fontSize: "15px" }} onClick={() => this.handleDeleteDoctor(item)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // Map relevant state from Redux store if needed
});

const mapDispatchToProps = (dispatch) => ({
  // Dispatch relevant actions if needed
});

export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
