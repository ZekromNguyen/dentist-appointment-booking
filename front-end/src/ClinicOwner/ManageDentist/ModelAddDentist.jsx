import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../../ServiceSystem/axios';

class ModelAddDentist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinics: [],
            username: '',
            password: '',
            email: '',
            phone: '',
            dentistName: '',
            clinicID: '',
            image: null,
            description: '',
            errors: {
                username: '',
                password: '',
                email: '',
                phone: '',
                dentistName: '',
                clinicID: '',
                image: '',
                description: ''
            }
        };
    }

    componentDidMount() {
        this.fetchClinics();
    }

    fetchClinics = async () => {
        try {
            const ownerData = JSON.parse(localStorage.getItem('account'));
            const clinicOwnerId = ownerData.clinicOwnerId;
            const response = await axios.get(`${BASE_URL}/getAllClinic`, {
                params: { ownerId: clinicOwnerId }
            });
            if (response.data && response.data.clinics) {
                this.setState({ clinics: response.data.clinics });
            }
        } catch (error) {
            console.error('Error fetching clinics:', error);
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value }, () => this.validateField(name, value));
    };

    handleImageChange = (event) => {
        this.setState({
            image: event.target.files[0]
        });
    };

    handleDescriptionChange = (event) => {
        this.setState({ description: event.target.value });
    };

    validateField = (name, value) => {
        let errors = this.state.errors;

        switch (name) {
            case 'username':
                errors.username = value ? '' : 'Username is required';
                break;
            case 'password':
                errors.password = value.length >= 8 ? '' : 'Password must be at least 8 characters';
                break;
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                errors.email = emailPattern.test(value) ? '' : 'Invalid email address';
                break;
            case 'phone':
                const phonePattern = /^(\+84|0)[1-9]\d{8}$/;
                errors.phone = phonePattern.test(value) ? '' : 'Phone number must be a 10-digit Vietnamese number';
                break;
            case 'dentistName':
                errors.dentistName = /\d/.test(value) ? 'Dentist name should not contain numbers' : '';
                break;
            case 'clinicID':
                errors.clinicID = value ? '' : 'Clinic selection is required';
                break;
            case 'description':
                errors.description = value ? '' : 'Description is required';
                break;
            default:
                break;
        }

        this.setState({ errors });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { username, password, email, phone, dentistName, clinicID, image, description, errors } = this.state;

        // Check if there are any validation errors
        const hasErrors = Object.values(errors).some(error => error);
        if (hasErrors) {
            alert('Please correct the errors in the form before submitting.');
            return;
        }

        // Check if any fields are missing
        if (!username || !password || !email || !phone || !dentistName || !clinicID || !image || !description) {
            alert('Please fill in all fields and select an image.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('dentistName', dentistName);
            formData.append('clinicID', clinicID);
            formData.append('image', image);
            formData.append('description', description);

            const response = await axios.post(`${BASE_URL}/registerDentist`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Response:', response.data);
            alert('Dentist registration successful.');
            this.props.onDentistAdded();
        } catch (error) {
            console.error('Error adding dentist:', error);
            if (error.response) {
                const errorMessage = error.response.data.message || 'An undefined error occurred';
                alert(`Failed to register dentist: ${errorMessage}`);
            } else if (error.request) {
                alert('Failed to register dentist: No response from server');
            } else {
                alert('Failed to register dentist: Request setup error');
            }
        }
    };

    render() {
        const { isOpen, toggleFromParent } = this.props;
        const { username, password, email, phone, dentistName, clinicID, description, clinics, errors } = this.state;

        return (
            <Modal show={isOpen} onHide={toggleFromParent}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Dentist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleSubmit} encType='multipart/form-data'>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                value={username}
                                onChange={this.handleInputChange}
                                isInvalid={!!errors.username}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={password}
                                onChange={this.handleInputChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={email}
                                onChange={this.handleInputChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter phone"
                                name="phone"
                                value={phone}
                                onChange={this.handleInputChange}
                                isInvalid={!!errors.phone}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formDentistName">
                            <Form.Label>Dentist Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter dentist name"
                                name="dentistName"
                                value={dentistName}
                                onChange={this.handleInputChange}
                                isInvalid={!!errors.dentistName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.dentistName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formClinicID">
                            <Form.Label>Clinic Name</Form.Label>
                            <Form.Control
                                as="select"
                                name="clinicID"
                                value={clinicID}
                                onChange={this.handleInputChange}
                                isInvalid={!!errors.clinicID}
                            >
                                <option value="">Select clinic</option>
                                {clinics.map((clinic) => (
                                    <option key={clinic.ClinicID} value={clinic.ClinicID}>
                                        {clinic.ClinicName}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.clinicID}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                name="description"
                                value={description}
                                onChange={this.handleDescriptionChange}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formImage">
                            <Form.Label>Profile Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={this.handleImageChange}
                                isInvalid={!!errors.image}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.image}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="secondary" onClick={toggleFromParent}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export default ModelAddDentist;
