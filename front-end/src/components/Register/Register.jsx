import React, { useState } from 'react';
import "./register.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register } from '../../Service/userService';
import { Link } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [checkInput, setCheckInput] = useState({
        isValidUsername: true,
        isValidPassword: true,
        isValidConfirmPassword: true,
        isValidEmail: true,
        isValidPhone: true,
        isValidName: true
    });
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({
        username: false,
        password: false,
        confirmPassword: false,
        email: false,
        phone: false,
        name: false
    });

    const maxLength = 50;

    const handleInputChange = (event, setState, fieldName) => {
        const value = event.target.value;
        if (value.length > maxLength) {
            toast.error(`${fieldName} không được vượt quá ${maxLength} ký tự`);
            return;
        }
        setState(value);
    };

    const validateField = (field, value) => {
        switch (field) {
            case 'username':
                if (!value) {
                    setCheckInput(prev => ({ ...prev, isValidUsername: false }));
                    toast.error("Username is required");
                } else {
                    setCheckInput(prev => ({ ...prev, isValidUsername: true }));
                }
                break;
            case 'password':
                if (!value) {
                    setCheckInput(prev => ({ ...prev, isValidPassword: false }));
                    toast.error("Password is required");
                } else if (value.length < 8) {
                    setCheckInput(prev => ({ ...prev, isValidPassword: false }));
                    toast.error("Password must be at least 8 characters long");
                } else {
                    setCheckInput(prev => ({ ...prev, isValidPassword: true }));
                }
                break;
            case 'confirmPassword':
                if (!value) {
                    setCheckInput(prev => ({ ...prev, isValidConfirmPassword: false }));
                    toast.error("Confirm Password is required");
                } else if (value !== password) {
                    setCheckInput(prev => ({ ...prev, isValidConfirmPassword: false }));
                    toast.error("Passwords do not match");
                } else {
                    setCheckInput(prev => ({ ...prev, isValidConfirmPassword: true }));
                }
                break;
            case 'email':
                const regEmail = /\S+@\S+\.\S+/;
                if (!value) {
                    setCheckInput(prev => ({ ...prev, isValidEmail: false }));
                    toast.error("Email is required");
                } else if (!regEmail.test(value)) {
                    setCheckInput(prev => ({ ...prev, isValidEmail: false }));
                    toast.error("Please enter a valid email address");
                } else {
                    setCheckInput(prev => ({ ...prev, isValidEmail: true }));
                }
                break;
            case 'phone':
                const regPhone = /^(0|\+84)\d{9}$/;
                if (!value) {
                    setCheckInput(prev => ({ ...prev, isValidPhone: false }));
                    toast.error("Phone number is required");
                } else if (!regPhone.test(value)) {
                    setCheckInput(prev => ({ ...prev, isValidPhone: false }));
                    toast.error("Please enter a valid 10-digit Vietnamese phone number");
                } else {
                    setCheckInput(prev => ({ ...prev, isValidPhone: true }));
                }
                break;
            case 'name':
                const regName = /^[^\d]+$/;
                if (!value) {
                    setCheckInput(prev => ({ ...prev, isValidName: false }));
                    toast.error("Name is required");
                } else if (!regName.test(value)) {
                    setCheckInput(prev => ({ ...prev, isValidName: false }));
                    toast.error("Name cannot contain numbers");
                } else {
                    setCheckInput(prev => ({ ...prev, isValidName: true }));
                }
                break;
            default:
                break;
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, {
            username,
            password,
            confirmPassword,
            email,
            phone,
            name
        }[field]);
    };

    const isFormFilled = () => {
        return username && password && confirmPassword && email && phone && name;
    };

    const handleRegister = async () => {
        if (!isFormFilled()) {
            toast.error("Please fill in all required fields");
            return;
        }

        const isValid = Object.values(checkInput).every(Boolean);

        if (isValid) {
            setIsLoading(true);
            try {
                const response = await register(username, password, email, phone, name);
                if (response && response.status === 200) {
                    toast.success("Registration successful, please check your email to verify your account.");
                } else if (response && response.data && response.data.error) {
                    toast.error(response.data.error);
                } else {
                    toast.error("An error occurred, please try again.");
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error("An error occurred, please try again.");
                }
            }
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setPhone("");
        setName("");
        setCheckInput({
            isValidUsername: true,
            isValidPassword: true,
            isValidConfirmPassword: true,
            isValidEmail: true,
            isValidPhone: true,
            isValidName: true
        });
        setTouched({
            username: false,
            password: false,
            confirmPassword: false,
            email: false,
            phone: false,
            name: false
        });
    };

    return (
        <div className="back-ground col-12 col-sm-4">
            <ToastContainer />
            <div className="all-register">
                <div><h3 className="title">Register Page</h3></div>

                {/* username */}
                <div className="div-sdt">
                    <input
                        type="text"
                        className={checkInput.isValidUsername || !touched.username ? "username form-control" : "username form-control is-invalid"}
                        placeholder="Enter your username..."
                        value={username}
                        onChange={(event) => handleInputChange(event, setUsername, 'Username')}
                        onBlur={() => handleBlur('username')}
                    />
                </div>

                {/* password */}
                <div className="div-password">
                    <input
                        type={isShowPassword ? 'text' : 'password'}
                        className={checkInput.isValidPassword || !touched.password ? "password form-control" : "password form-control is-invalid"}
                        placeholder="Enter your password..."
                        value={password}
                        onChange={(event) => handleInputChange(event, setPassword, 'Password')}
                        onBlur={() => handleBlur('password')}
                    />
                    <div onClick={() => setIsShowPassword(!isShowPassword)} className="icon-container">
                        {isShowPassword ? <FaEye className="icon-open-eye-register col-12 col-sm-4" /> : <FaEyeSlash className="icon-open-eye-register col-12 col-sm-4" />}
                    </div>
                </div>

                {/* confirm password */}
                <div className="div-password">
                    <input
                        type={isShowConfirmPassword ? 'text' : 'password'}
                        className={checkInput.isValidConfirmPassword || !touched.confirmPassword ? "password form-control" : "password form-control is-invalid"}
                        placeholder="Confirm your password..."
                        value={confirmPassword}
                        onChange={(event) => handleInputChange(event, setConfirmPassword, 'Confirm Password')}
                        onBlur={() => handleBlur('confirmPassword')}
                    />
                    <div onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)} className="icon-container">
                        {isShowConfirmPassword ? <FaEye className="icon-open-eye-register col-12 col-sm-4" /> : <FaEyeSlash className="icon-open-eye-register col-12 col-sm-4" />}
                    </div>
                </div>

                {/* email */}
                <div className="div-email">
                    <input
                        type="text"
                        className={checkInput.isValidEmail || !touched.email ? "email form-control" : "email form-control is-invalid"}
                        placeholder="Enter your email..."
                        value={email}
                        onChange={(event) => handleInputChange(event, setEmail, 'Email')}
                        onBlur={() => handleBlur('email')}
                    />
                </div>

                {/* phone */}
                <div className="div-phone">
                    <input
                        type="text"
                        className={checkInput.isValidPhone || !touched.phone ? "phone form-control" : "phone form-control is-invalid"}
                        placeholder="Enter your phone number..."
                        value={phone}
                        onChange={(event) => handleInputChange(event, setPhone, 'Phone')}
                        onBlur={() => handleBlur('phone')}
                    />
                </div>

                {/* name */}
                <div className="div-name">
                    <input
                        type="text"
                        className={checkInput.isValidName || !touched.name ? "name form-control" : "name form-control is-invalid"}
                        placeholder="Enter your name..."
                        value={name}
                        onChange={(event) => handleInputChange(event, setName, 'Name')}
                        onBlur={() => handleBlur('name')}
                    />
                </div>

                <div className="div-button">
                    <button
                        className="btn-register"
                        onClick={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                    <button className="btn-reset" onClick={handleReset}>Reset</button>
                </div>
                <Link to="/login">Already have an account? Login</Link>
            </div>
        </div>
    );
}
