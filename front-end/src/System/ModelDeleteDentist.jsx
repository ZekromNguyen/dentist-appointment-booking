import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { deleteDentist } from '../Service/userService';

class ModelDeleteDentist extends Component {
    handleDeleteDentist = async () => {
        try {
            await deleteDentist(this.props.dentistID);
            this.props.onDentistDeleted();
        } catch (error) {
            console.error('Error deleting dentist:', error);
        }
    };

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggleFromParent}>
                <ModalHeader toggle={this.props.toggleFromParent}>Delete Dentist</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this dentist?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.handleDeleteDentist}>Delete</Button>
                    <Button color="secondary" onClick={this.props.toggleFromParent}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModelDeleteDentist;
