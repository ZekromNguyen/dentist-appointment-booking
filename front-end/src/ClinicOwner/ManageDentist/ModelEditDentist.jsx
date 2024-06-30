import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';
import { handleEditDentist } from '../../Service/userService';

class ModelEditDentist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dentistName: '',
            clinicID: ''
        };
    }

    componentDidMount() {
        let dentist = this.props.currentDentist;
        if (dentist && !_.isEmpty(dentist)) {
            this.setState({
                dentistName: dentist.DentistName,
                clinicID: dentist.ClinicID
            });
        }
    }

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

    render() {
        const { isOpen } = this.props;
        const { dentistName, clinicID } = this.state;
        return (
            <Modal isOpen={isOpen} toggle={this.toggle} className='model' size="lg" centered>
                <ModalHeader toggle={this.toggle}>Edit Dentist</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="dentistName">Dentist Name</Label>
                        <Input type="text" id="dentistName"
                            onChange={(event) => this.setState({ dentistName: event.target.value })}
                            value={dentistName}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="clinicID">Clinic ID</Label>
                        <Input type="text" id="clinicID" value={clinicID} onChange={(event) => this.setState({ clinicID: event.target.value })} />
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
