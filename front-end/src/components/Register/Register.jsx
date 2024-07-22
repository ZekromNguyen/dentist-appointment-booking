import React, { useState } from 'react';
import "./register.css";
import { FaChevronLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register } from '../../Service/userService';
import { useNavigate } from "react-router-dom";

export default function Register(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [checkinput, SetCheckInput] = useState({
        isValidUsername: true,
        isValidPassword: true,
        isValidEmail: true,
        isValidPhone: true,
        isValidName: true
    });
    const [isLoading, setIsLoading] = useState(false);

    let navigate = useNavigate();

    const isValidInputs = () => {
        if (!username) {
            toast.error("Username is required");
            return false;
        }
        if (!password) {
            SetCheckInput({ ...checkinput, isValidPassword: false });
            toast.error("Password is required");
            return false;
        }
        let reg = /\S+@\S+\.\S+/;
        if (!reg.test(email)) {
            SetCheckInput({ ...checkinput, isValidEmail: false });
            toast.error("Please enter a valid email address");
            return false;
        }
        if (!email) {
            SetCheckInput({ ...checkinput, isValidEmail: false });
            toast.error("Email is required");
            return false;
        }
        if (!phone) {
            SetCheckInput({ ...checkinput, isValidPhone: false });
            toast.error("Phone number is required");
            return false;
        }
        if (!name) {
            toast.error("Name is required");
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        let isValid = isValidInputs();

        if (isValid) {
            setIsLoading(true);

            try {
                const response = await register(username, password, email, phone, name);

                if (response && response.status === 200) {
                    toast.success(response.data.message);
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
        setEmail("");
        setPhone("");
        setName("");
        SetCheckInput({
            isValidUsername: true,
            isValidPassword: true,
            isValidEmail: true,
            isValidPhone: true,
            isValidName: true
        });
    };

    return (
        <div className="back-ground col-12 col-sm-4">
            <ToastContainer />
            <div className="all-register">
                <div><h3 className="title">Register Page</h3></div>

                {/* username */}
                <div className="div-sdt">
                    <input type="text" className={checkinput.isValidUsername ? "username form-control" : "username form-control is-invalid"} placeholder="Enter your username..."
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>

                {/* password */}
                <div className="div-password">
                    <input type={isShowPassword ? 'text' : 'password'}
                        className={checkinput.isValidPassword ? "password form-control" : "password form-control is-invalid"} placeholder="Enter your password..."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)} />
                    <div onClick={() => setIsShowPassword(!isShowPassword)} className="icon-container">
                        {isShowPassword ? (
                            <FaEye className="icon-open-eye-register col-12 col-sm-4" />
                        ) : (
                            <FaEyeSlash className="icon-open-eye-register col-12 col-sm-4" />
                        )}
                    </div>
                </div>

                {/* email */}
                <div className="div-email">
                    <input type="email"
                        className={checkinput.isValidEmail ? "email form-control" : "email form-control is-invalid"} placeholder="Enter your email address..."
                        value={email}
                        onChange={(event) => setEmail(event.target.value)} />
                </div>

                {/* phone */}
                <div className="div-phone">
                    <input type="phone"
                        className={checkinput.isValidPhone ? "phone form-control" : "phone form-control is-invalid"} placeholder="Enter your phone number..."
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)} />
                </div>

                {/* name */}
                <div className="div-name">
                    <input type="text"
                        className={checkinput.isValidName ? "name form-control" : "name form-control is-invalid"} placeholder="Enter your name..."
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

                <div className="div-sign-up">
                    <button className="button-register" onClick={() => handleRegister()}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>

                    <div className="div-reset">
                        <button className="button-reset" onClick={handleReset}>Reset</button>
                    </div>
                </div>

                <div className="shift"></div>
                <div className="account">
                    <span className='text-gray-600 mr-1'>Already have an account?</span>
                    <Link className='text-gray-500 underline hover:text-red-500' to='/Login'>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
