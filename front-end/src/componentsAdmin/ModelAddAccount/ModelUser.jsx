import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './model.scss';
import { useNavigate } from 'react-router-dom';
import { handelAddUser } from '../../Service/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllClinic } from '../../Service/clinicService'; // Ensure this import is correct

const ModelUser = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [roleID, setRoleID] = useState('');
    const [name, setName] = useState('');
    const [clinicID, setClinicID] = useState('');
    const [dentistName, setDentistName] = useState('');
    const [description, setDescription] = useState('');
    const [clinicOwnerName, setClinicOwnerName] = useState('');
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        roleID: '',
        name: '',
        dentistName: '',
        clinicOwnerName: '',
        clinicID: ''
    });
    const [clinics, setClinics] = useState([]); // Initialize as an empty array

    const navigate = useNavigate();

    const handleGetAllClinic = async () => {
        try {
            let response = await getAllClinic('ALL');

            // Log response for debugging
            console.log('Clinic response:', response);

            if (response && response.errCode === 0) {
                console.log('Clinics data:', response.account); // Log data from the correct property
                setClinics(response.account || []); // Ensure clinics is always an array
            } else {
                console.error('Error fetching clinics:', response);
            }
        } catch (error) {
            console.error('Error occurred while fetching clinics:', error);
        }
    };


    useEffect(() => {
        handleGetAllClinic();
    }, []);

    const toggle = () => {
        props.toggleFromParent();
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'username':
                error = value ? '' : 'Username is required';
                break;
            case 'password':
                error = value.length >= 8 ? '' : 'Password must be at least 8 characters';
                break;
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                error = emailPattern.test(value) ? '' : 'Invalid email address';
                break;
            case 'phone':
                const phonePattern = /^(\+84|0)[1-9]\d{8}$/;
                error = phonePattern.test(value) ? '' : 'Phone number must be a 10-digit Vietnamese number';
                break;
            case 'name':
                error = /\d/.test(value) ? 'Name should not contain numbers' : '';
                break;
            case 'roleID':
                error = value ? '' : 'Role selection is required';
                break;
            case 'dentistName':
                error = value ? '' : 'Dentist name is required';
                break;
            case 'clinicOwnerName':
                error = value ? '' : 'Clinic owner name is required';
                break;
            case 'clinicID':
                error = value ? '' : 'Clinic selection is required';
                break;
            default:
                break;
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const isValidInputs = () => {
        let isValid = true;
        let newErrors = { ...errors };

        if (!username) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else {
            newErrors.username = '';
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        } else {
            newErrors.password = '';
        }

        if (!email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else {
            const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailReg.test(email)) {
                newErrors.email = 'Invalid email address';
                isValid = false;
            } else {
                newErrors.email = '';
            }
        }

        if (!phone) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else {
            const phoneReg = /^(\+84|0)[1-9]\d{8}$/;
            if (!phoneReg.test(phone)) {
                newErrors.phone = 'Phone number must be a 10-digit Vietnamese number';
                isValid = false;
            } else {
                newErrors.phone = '';
            }
        }

        if (!roleID) {
            newErrors.roleID = 'Role selection is required';
            isValid = false;
        } else {
            newErrors.roleID = '';
        }

        if (roleID === "1") {
            if (!name) {
                newErrors.name = 'Name is required';
                isValid = false;
            } else if (/\d/.test(name)) {
                newErrors.name = 'Name should not contain numbers';
                isValid = false;
            } else {
                newErrors.name = '';
            }
        } else {
            newErrors.name = '';
        }

        if (roleID === "2") {
            if (!dentistName) {
                newErrors.dentistName = 'Dentist name is required';
                isValid = false;
            } else {
                newErrors.dentistName = '';
            }

            if (!clinicID) {
                newErrors.clinicID = 'Clinic selection is required';
                isValid = false;
            } else {
                newErrors.clinicID = '';
            }
        }

        if (roleID === "3") {
            if (!clinicOwnerName) {
                newErrors.clinicOwnerName = 'Clinic owner name is required';
                isValid = false;
            } else {
                newErrors.clinicOwnerName = '';
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleAddNewUser = async () => {
        const check = isValidInputs();
        if (check) {
            try {
                const response = await handelAddUser({
                    username,
                    password,
                    email,
                    phone,
                    roleID,
                    name,
                    clinicID,
                    dentistName,
                    description,
                    clinicOwnerName
                });
                if (response && response.message === "Account created successfully") {
                    setUsername('');
                    setPassword('');
                    setEmail('');
                    setPhone('');
                    setRoleID('');
                    setName('');
                    setClinicID('');
                    setDentistName('');
                    setDescription('');
                    setClinicOwnerName('');
                    setErrors({
                        username: '',
                        password: '',
                        email: '',
                        phone: '',
                        roleID: '',
                        name: '',
                        dentistName: '',
                        clinicOwnerName: '',
                        clinicID: ''
                    });
                    toast.success("Account created successfully");
                } else {
                    setErrors({ ...errors, general: response.error || "An error occurred, please try again." });
                }
            } catch (error) {
                setErrors({ ...errors, general: error.response?.data?.message || "An error occurred, please try again." });
            }
        }
    };

    return (
        <Modal isOpen={props.isOpen} toggle={toggle} className='model' size="lg" centered>
            <ModalHeader toggle={toggle}>Create a new user</ModalHeader>
            <ModalBody>
                <div className="User-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <label>Username</label>
                                <input className="form-control" type="text" value={username} onChange={(e) => { setUsername(e.target.value); validateField('username', e.target.value); }} />
                                {errors.username && <p className="text-danger">{errors.username}</p>}
                            </div>
                            <div className="col-6">
                                <label>Password</label>
                                <input className="form-control" type="password" value={password} onChange={(e) => { setPassword(e.target.value); validateField('password', e.target.value); }} />
                                {errors.password && <p className="text-danger">{errors.password}</p>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <label>Email</label>
                                <input className="form-control" type="text" value={email} onChange={(e) => { setEmail(e.target.value); validateField('email', e.target.value); }} />
                                {errors.email && <p className="text-danger">{errors.email}</p>}
                            </div>
                            <div className="col-6">
                                <label>Phone</label>
                                <input className="form-control" type="text" value={phone} onChange={(e) => { setPhone(e.target.value); validateField('phone', e.target.value); }} />
                                {errors.phone && <p className="text-danger">{errors.phone}</p>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <label>Role</label>
                                <select className="form-control" value={roleID} onChange={(e) => { setRoleID(e.target.value); validateField('roleID', e.target.value); }}>
                                    <option value="">Select Role</option>
                                    <option value="1">Customer</option>
                                    <option value="2">Dentist</option>
                                    <option value="3">Clinic Owner</option>
                                </select>
                                {errors.roleID && <p className="text-danger">{errors.roleID}</p>}
                            </div>
                            <div className="col-6">
                                {roleID === '1' && (
                                    <div>
                                        <label>Name</label>
                                        <input className="form-control" type="text" value={name} onChange={(e) => { setName(e.target.value); validateField('name', e.target.value); }} />
                                        {errors.name && <p className="text-danger">{errors.name}</p>}
                                    </div>
                                )}
                                {roleID === '2' && (
                                    <>
                                        <div>
                                            <label>Dentist Name</label>
                                            <input className="form-control" type="text" value={dentistName} onChange={(e) => { setDentistName(e.target.value); validateField('dentistName', e.target.value); }} />
                                            {errors.dentistName && <p className="text-danger">{errors.dentistName}</p>}
                                            <label>Clinic</label>
                                            <select className="form-control" value={clinicID} onChange={(e) => { setClinicID(e.target.value); validateField('clinicID', e.target.value); }}>
                                                <option value="">Select Clinic</option>
                                                {clinics.map((clinic) => (
                                                    <option key={clinic.ClinicID} value={clinic.ClinicID}>{clinic.ClinicName}</option>
                                                ))}
                                            </select>
                                            {errors.clinicID && <p className="text-danger">{errors.clinicID}</p>}
                                        </div>
                                        <div className="col-12">
                                            <label>Description</label>
                                            <textarea className="form-control"
                                                onChange={(event) => setDescription(event.target.value)}
                                                value={description}></textarea>
                                        </div>
                                    </>
                                )}
                                {roleID === '3' && (
                                    <div>
                                        <label>Clinic Owner Name</label>
                                        <input className="form-control" type="text" value={clinicOwnerName} onChange={(e) => { setClinicOwnerName(e.target.value); validateField('clinicOwnerName', e.target.value); }} />
                                        {errors.clinicOwnerName && <p className="text-danger">{errors.clinicOwnerName}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                        {errors.general && <p className="text-danger">{errors.general}</p>}
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleAddNewUser}>Add New User</Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

const mapStateToProps = (state) => ({
    language: state.app.language
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModelUser);
