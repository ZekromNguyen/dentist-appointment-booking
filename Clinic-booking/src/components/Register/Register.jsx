import React, { useEffect, useState } from 'react';
import "./register.css";
import { FaChevronLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa6';
import { FaEyeSlash } from 'react-icons/fa6';
import axios from 'axios'



export default function Register() {

    // useEffect(() => {
    //     axios.get("http://localhost:3000/register").then(data => {
    //         console.log(">>> check data axios", data)
    //     })
    // }, []);

    const handleRegister = () => {
        axios.post("http://localhost:3000/register", {
            email, phone, username, password
        })

    }
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);

    return (

        <div className="back-ground col-12 col-sm-4">
            <div className="all-register">
                <div><h3 className="title">Register Page</h3></div>
                <div className="div-sdt">
                    <input type="text" className="username" placeholder="Enter your username..."
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="div-password">
                    <input type={isShowPassword ? 'text' : 'password'}
                        className="password" placeholder="Enter your password..."
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

                <div className="div-email">
                    <input type="email"
                        className="email" placeholder="Enter your email..."
                        value={email}
                        onChange={(event) => setEmail(event.target.value)} />
                </div>

                <div className="div-phone">
                    <input type="phone"
                        className="phone" placeholder="Enter your phone..."
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)} />
                </div>

                <div className="div-sign-up">
                    <button onClick={() => handleRegister()} className={username && password && email && phone ? "active" : ""}
                        disabled={username && password && email && phone ? false : true}>
                        Sign up</button>
                </div>
                <div className="shift"></div>

                <div className="account">
                    <span className='text-gray-600 mr-1'>Already have an account?</span>
                    <Link
                        className='text-gray-500 underline hover:text-red-500'
                        to='/Login'
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>

    )
}
