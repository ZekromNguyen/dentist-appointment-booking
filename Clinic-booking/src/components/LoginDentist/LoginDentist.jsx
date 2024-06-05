import React from 'react'
import { FaEye } from 'react-icons/fa6';
import { FaEyeSlash } from 'react-icons/fa6';
import { FaChevronLeft } from "react-icons/fa6";
import { useState } from "react";
import "./loginDentist.css";


export default function LoginDentist() {
    const [usernameDentist, setUsernameDentist] = useState("");
    const [passwordDentist, setPasswordDentist] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);

    return (
        <div className="back-ground-dentist col-12 col-sm-4">

            <div className="all-Dentist">
                <div><h3 className="title">Login Page Dentist</h3></div>
                <div className="div-sdt">
                    <input type="text" className="username" placeholder="Enter your username..."
                        value={usernameDentist}
                        onChange={(event) => setUsernameDentist(event.target.value)} />
                </div>
                <div className="div-password">
                    <input type={isShowPassword ? 'text' : 'password'}
                        className="password" placeholder="Enter your password..."
                        value={passwordDentist}
                        onChange={(event) => setPasswordDentist(event.target.value)} />
                    <div onClick={() => setIsShowPassword(!isShowPassword)} className="icon-container">
                        {isShowPassword ? (
                            <FaEye className="icon-open-eye col-12 col-sm-4" />
                        ) : (
                            <FaEyeSlash className="icon-open-eye col-12 col-sm-4" />
                        )}
                    </div>
                </div>

                <div className="div-login ">
                    <button
                        className={usernameDentist && passwordDentist ? "active" : ""}
                        disabled={usernameDentist && passwordDentist ? false : true}
                    >
                        Login</button>
                </div>
                <div className="shift"></div>

                <div className="back" >
                    <FaChevronLeft className="icon-arrow-left" />
                    Go back</div>
            </div>
        </div>
    )
}
