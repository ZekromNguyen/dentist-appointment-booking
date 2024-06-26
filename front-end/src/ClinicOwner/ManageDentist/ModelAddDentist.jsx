// Import necessary modules/components
import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

class ModelAddDentist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinics: [], // Array to store clinics fetched from API
            username: '',
            password: '',
            email: '',
            phone: '',
            dentistName: '',
            clinicID: '', // State to store selected clinic ID
            image: null, // State to store the selected image file
            description: '' // State for description field
        };
    }

    componentDidMount() {
        // Fetch clinics data when component mounts
        this.fetchClinics();
    }

    fetchClinics = async () => {
        try {
            const response = await axios.get('http://localhost:3000/getAllClinic');
            if (response.data && response.data.clinics) {
                this.setState({
                    clinics: response.data.clinics,
                });
            }
        } catch (error) {
            console.error('Error fetching clinics:', error);
            // Handle error as needed
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleImageChange = (event) => {
        this.setState({
            image: event.target.files[0] // Store the selected file in state
        });
    };

    handleDescriptionChange = (event) => {
        this.setState({ description: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { username, password, email, phone, dentistName, clinicID, image, description } = this.state;

        // Validate input fields and image selection
        if (!username || !password || !email || !phone || !dentistName || !clinicID || !image || !description) {
            alert('Please fill in all fields and select an image.');
            return;
        }

        try {
            // Create FormData and append fields
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('dentistName', dentistName);
            formData.append('clinicID', clinicID);
            formData.append('image', image); // Append image file to FormData
            formData.append('description', description); // Append description to FormData

            // Send POST request to backend
            const response = await axios.post('http://localhost:3000/registerDentist', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set content type for uploading files
                }
            });

            console.log('Response:', response.data);
            alert('Dentist registration successful.');
            this.props.onDentistAdded(); // Trigger parent component callback on success
        } catch (error) {
            console.error('Error adding dentist:', error);

            if (error.response) {
                // Server returned an error
                console.error('Server response:', error.response.status);
                console.error('Response data:', error.response.data);

                // Check if error.response.data.message is defined
                const errorMessage = error.response.data.message || 'An undefined error occurred';
                alert(`Failed to register dentist: ${errorMessage}`);
            } else if (error.request) {
                // Request was sent but no response was received
                console.error('No response received:', error.request);
                alert('Failed to register dentist: No response from server');
            } else {
                // Error occurred during request setup
                console.error('Request setup error:', error.message);
                alert('Failed to register dentist: Request setup error');
            }
        }
    };

    render() {
        const { isOpen, toggleFromParent } = this.props;
        const { username, password, email, phone, dentistName, clinicID, description, clinics } = this.state;

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
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={password}
                                onChange={this.handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={email}
                                onChange={this.handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter phone"
                                name="phone"
                                value={phone}
                                onChange={this.handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDentistName">
                            <Form.Label>Dentist Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter dentist name"
                                name="dentistName"
                                value={dentistName}
                                onChange={this.handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formClinicID">
                            <Form.Label>Clinic ID</Form.Label>
                            <Form.Control
                                as="select"
                                name="clinicID"
                                value={clinicID}
                                onChange={this.handleInputChange}
                                required
                            >
                                <option value="">Select clinic</option>
                                {clinics.map((clinic) => (
                                    <option key={clinic.clinicID} value={clinic.clinicID}>
                                        {clinic.ClinicName} {/* Make sure the property name matches */}
                                    </option>
                                ))}
                            </Form.Control>
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
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage">
                            <Form.Label>Profile Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={this.handleImageChange}
                                required
                            />
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
