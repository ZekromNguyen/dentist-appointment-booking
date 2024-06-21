import React, { useEffect, useState } from 'react';
import "./register.css";
import { FaChevronLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { register } from '../../Service/userService';
import { useNavigate } from "react-router-dom";

export default function Register(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");

    const defaultValidInput = {
        isValidUsername: true,
        isValidPassword: true,
        isValidEmail: true,
        isValidPhone: true,
        isValidName: true
    }
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [checkinput, SetCheckInput] = useState(defaultValidInput);

    let navigate = useNavigate();

    const isValidInputs = () => {
        if (!username) {
            toast.error("Tên người dùng bắt buộc")
            return false;
        }
        if (!password) {
            SetCheckInput({ ...defaultValidInput, isValidPassword: false })
            toast.error("Mật khẩu bắt buộc")
            return false;
        }
        let reg = /\S+@\S+\.\S+/;
        if (!reg.test(email)) {
            SetCheckInput({ ...defaultValidInput, isValidEmail: false })
            toast.error("Vui lòng nhập đúng giá trị địa chỉ email");
            return false;
        }
        if (!email) {
            SetCheckInput({ ...defaultValidInput, isValidEmail: false })
            toast.error("Email bắt buộc")
            return false;
        }

        if (!phone) {
            SetCheckInput({ ...defaultValidInput, isValidPhone: false })
            toast.error("Số điện thoại bắt buộc")
            return false;
        }
        if (!name) {
            toast.error("Tên người dùng bắt buộc")
            return false;
        }

        return true;
    }

    const handleRegister = async () => {
        let check = isValidInputs();

        if (check === true) {
            try {
                const response = await register(username, password, email, phone, name);
                if (response && response.status === 200) {
                    navigate("/login");
                    toast.success(response.data.message);
                    toast.success("Đăng ký thành công, vui lòng kiểm tra email của bạn để xác minh mới có thể đăng nhập.");
                } else if (response && response.data && response.data.message) {
                    toast.error(response.data.message);
                } else {
                    toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
                }
            }
        }
    }

    return (
        <div className="back-ground col-12 col-sm-4">
            <ToastContainer />
            <div className="all-register">
                <div><h3 className="title">Trang đăng ký</h3></div>

                {/* username */}
                <div className="div-sdt">
                    <input type="text" className={checkinput.isValidUsername ? "username form-control" : "username form-control is-invalid"} placeholder="Nhập tên tài khoản của bạn..."
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>

                {/* password */}
                <div className="div-password">
                    <input type={isShowPassword ? 'text' : 'password'}
                        className={checkinput.isValidPassword ? "password form-control" : "password form-control is-invalid"} placeholder="Nhập mật khẩu của bạn..."
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
                        className={checkinput.isValidEmail ? "email form-control" : "email form-control is-invalid"} placeholder="Nhập địa chỉ email của bạn..."
                        value={email}
                        onChange={(event) => setEmail(event.target.value)} />
                </div>

                {/* phone */}
                <div className="div-phone">
                    <input type="phone"
                        className={checkinput.isValidPhone ? "phone form-control" : "phone form-control is-invalid"} placeholder="Nhập số điện thoại của bạn..."
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)} />
                </div>

                {/* name */}
                <div className="div-name">
                    <input type="text"
                        className={checkinput.isValidName ? "name form-control" : "name form-control is-invalid"} placeholder="Nhập tên của bạn..."
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>


                <div className="div-sign-up">
                    <button onClick={() => handleRegister()}>
                        Đăng ký
                    </button>
                </div>
                <div className="shift"></div>

                <div className="account">
                    <span className='text-gray-600 mr-1'>Already have an account?</span>
                    <Link className='text-gray-500 underline hover:text-red-500' to='/Login'>
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}
