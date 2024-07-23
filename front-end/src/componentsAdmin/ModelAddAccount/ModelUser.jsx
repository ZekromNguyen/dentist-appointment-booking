import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './model.scss';
import { useNavigate } from 'react-router-dom';
import { handelAddUser } from '../../Service/userService';

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
        name: ''
    });

    let navigate = useNavigate();

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
                        name: ''
                    });
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
                                <input className={errors.username ? "form-control is-invalid" : "form-control"}
                                    type="text"
                                    onChange={(event) => { setUsername(event.target.value); validateField('username', event.target.value); }}
                                    value={username} />
                                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                            </div>
                            <div className="col-6">
                                <label>Password</label>
                                <input className={errors.password ? "form-control is-invalid" : "form-control"}
                                    type="password"
                                    onChange={(event) => { setPassword(event.target.value); validateField('password', event.target.value); }}
                                    value={password} />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                            <div className="col-6">
                                <label>Email</label>
                                <input className={errors.email ? "form-control is-invalid" : "form-control"}
                                    type="email"
                                    onChange={(event) => { setEmail(event.target.value); validateField('email', event.target.value); }}
                                    value={email} />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            <div className="col-6">
                                <label>Phone Number</label>
                                <input className={errors.phone ? "form-control is-invalid" : "form-control"}
                                    type="text"
                                    onChange={(event) => { setPhone(event.target.value); validateField('phone', event.target.value); }}
                                    value={phone} />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>
                            <div className="col-6">
                                <label>Role</label>
                                <select className={errors.roleID ? "form-control is-invalid" : "form-control"}
                                    onChange={(event) => { setRoleID(event.target.value); validateField('roleID', event.target.value); }}
                                    value={roleID}>
                                    <option value="">Choose role...</option>
                                    <option value="1">Customer</option>
                                    <option value="2">Dentist</option>
                                    <option value="3">Clinic Owner</option>
                                </select>
                                {errors.roleID && <div className="invalid-feedback">{errors.roleID}</div>}
                            </div>
                            {roleID === "1" && (
                                <div className="col-6">
                                    <label>Name</label>
                                    <input className={errors.name ? "form-control is-invalid" : "form-control"}
                                        type="text"
                                        onChange={(event) => { setName(event.target.value); validateField('name', event.target.value); }}
                                        value={name} />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                            )}
                            {roleID === "2" && (
                                <>
                                    <div className="col-6">
                                        <label>Dentist Name</label>
                                        <input className="form-control"
                                            type="text"
                                            onChange={(event) => setDentistName(event.target.value)}
                                            value={dentistName} />
                                    </div>
                                    <div className="col-6">
                                        <label>Description</label>
                                        <textarea className="form-control"
                                            onChange={(event) => setDescription(event.target.value)}
                                            value={description}></textarea>
                                    </div>
                                </>
                            )}
                            {roleID === "3" && (
                                <>
                                    <div className="col-6">
                                        <label>Clinic Owner Name</label>
                                        <input className="form-control"
                                            type="text"
                                            onChange={(event) => setClinicOwnerName(event.target.value)}
                                            value={clinicOwnerName} />
                                    </div>
                                    <div className="col-6">
                                        <label>Clinic ID</label>
                                        <input className="form-control"
                                            type="text"
                                            onChange={(event) => setClinicID(event.target.value)}
                                            value={clinicID} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleAddNewUser}>
                    Save Changes
                </Button>{' '}
                <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelUser);
