import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { registerDentist } from '../Service/userService';

class ModelAddDentist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            phone: '',
            dentistName: '',
            clinicID: '',
            roleID: '' // Add roleID to state
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async () => {
        const { username, password, email, phone, dentistName, clinicID, roleID } = this.state; // Include roleID
        try {
            await registerDentist(username, password, email, phone, dentistName, clinicID, roleID); // Pass roleID
            this.props.onDentistAdded();
        } catch (error) {
            console.error('Error adding dentist:', error);
        }
    };

    render() {
        const { isOpen, toggleFromParent } = this.props;
        return (
            <Modal show={isOpen} onHide={toggleFromParent}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Dentist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter phone"
                                name="phone"
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDentistName">
                            <Form.Label>Dentist Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter dentist name"
                                name="dentistName"
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formClinicID">
                            <Form.Label>Clinic ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter clinic ID"
                                name="clinicID"
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formRoleID"> {/* Add a form group for roleID */}
                            <Form.Label>Role ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter role ID"
                                name="roleID"
                                onChange={this.handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleFromParent}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ModelAddDentist;
