import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import BASE_URL from '../../ServiceSystem/axios';
import { handleEditDentist } from '../../Service/userService';

class ModelEditDentist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dentistName: '',
            clinicID: '',
            clinics: [], // Array to store clinics fetched from API
        };
    }

    componentDidMount() {
        let dentist = this.props.currentDentist;
        if (dentist) {
            this.setState({
                dentistName: dentist.DentistName,
                clinicID: dentist.ClinicID
            });
        }
        // Fetch clinics data when component mounts
        this.fetchClinics();
    }

    fetchClinics = async () => {
        try {
            const ownerData = JSON.parse(localStorage.getItem('account'));
            const clinicOwnerId = ownerData.clinicOwnerId;
            const response = await axios.get(`${BASE_URL}/getAllClinic`, {
                params: {
                    ownerId: clinicOwnerId
                }
            });
            if (response.data && response.data.clinics) {
                this.setState({
                    clinics: response.data.clinics,
                });
            }
        } catch (error) {
            console.error('Error fetching clinics:', error);
        }
    };

    toggle = () => {
        this.props.toggleFromParent();
    };

    isValidInputs = () => {
        const { dentistName, clinicID } = this.state;
        if (!dentistName || !clinicID) {
            toast.error("Dentist Name and Clinic ID are required");
            return false;
        }
        return true;
    };

    handleEditDentistClick = async () => {
        if (this.isValidInputs()) {
            const { dentistName, clinicID } = this.state;
            const dentistData = {
                DentistID: this.props.currentDentist.DentistID,
                DentistName: dentistName,
                ClinicID: clinicID
            };
            try {
                const response = await handleEditDentist(dentistData);
                if (response.errCode === 0) {
                    toast.success("Dentist updated successfully!");
                    this.toggle();
                    this.props.onDentistUpdated(); // Call onDentistUpdated after updating
                } else {
                    toast.error('Error updating dentist: ' + response.errMessage);
                }
            } catch (error) {
                toast.error('Error editing dentist: ' + error.message);
                console.error('Error editing dentist:', error);
            }
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    render() {
        const { isOpen } = this.props;
        const { dentistName, clinicID, clinics } = this.state;
        return (
            <Modal isOpen={isOpen} toggle={this.toggle} className='model' size="lg" centered>
                <ModalHeader toggle={this.toggle}>Edit Dentist</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="dentistName">Dentist Name</Label>
                        <Input type="text" id="dentistName"
                            name="dentistName"
                            onChange={this.handleInputChange}
                            value={dentistName}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="clinicID">Clinic Name</Label>
                        <Input
                            type="select"
                            name="clinicID"
                            id="clinicID"
                            value={clinicID}
                            onChange={this.handleInputChange}
                        >
                            <option value="">Select clinic</option>
                            {clinics.map((clinic) => (
                                <option key={clinic.ClinicID} value={clinic.ClinicID}>
                                    {clinic.ClinicName}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleEditDentistClick}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
                <ToastContainer />
            </Modal>
        );
    }
}

export default ModelEditDentist;
