import { useState } from "react";
import "./login.css";
import Footer from '../../components/Footer/Footer';
import { FaChevronLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { login } from "../../Service/userService";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [checkInputLogin, setCheckInputLogin] = useState({
        isValidEmail: true,
        isValidPassword: true
    });

    const handleLogin = async () => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        setCheckInputLogin({
            isValidEmail: !!trimmedEmail,
            isValidPassword: !!trimmedPassword
        });

        if (!trimmedEmail) {
            toast.error("Please enter your account");
            return;
        }
        if (!trimmedPassword) {
            toast.error("Please enter your password");
            return;
        }

        try {
            const response = await login(trimmedEmail, trimmedPassword);
            if (response && response.data && response.data.message === "Login successfully") {
                const user = response.data.user;
                if (user.IsActive === false) {
                    toast.error("Your account is not active. Please contact support.");
                    return;
                }
                localStorage.setItem('account', JSON.stringify(user));
                const role = user.RoleID; // Ensure `RoleID` exists
                toast.success("Congratulations, you have logged in successfully");

                switch (role) {
                    case 1: navigate("/"); break;
                    case 2: navigate("/Doctor"); break;
                    case 3: navigate("/ClinicOwner"); break;
                    case 4: navigate("/Admin"); break;
                    default: navigate("/"); break;
                }
            } else {
                toast.error(response.data.error || "Incorrect account or password. Please try again.");
            }
        } catch {
            toast.error("External error.");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') handleLogin();
    };

    const handleReset = () => {
        setEmail("");
        setPassword("");
    }

    return (
        <div className="body">
            <div className="back-ground col-12 col-sm-4">
                <div className="all">
                    <h3 className="title">Login Page</h3>

                    <div className="div-email">
                        <input
                            type="text"
                            className={checkInputLogin.isValidEmail ? 'email form-control' : 'is-invalid email form-control'}
                            placeholder="Enter your account..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <div className="div-password">
                        <input
                            type={isShowPassword ? 'text' : 'password'}
                            className={checkInputLogin.isValidPassword ? 'password form-control' : 'is-invalid password form-control'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <div onClick={() => setIsShowPassword(!isShowPassword)} className="icon-container">
                            {isShowPassword ? <FaEye className="icon-open-eye" /> : <FaEyeSlash className="icon-open-eye" />}
                        </div>
                    </div>

                    <div className="div-login">
                        <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                        <button className="button-reset" onClick={handleReset}>Reset</button>
                    </div>

                    <div className="shift"></div>

                    <a className="text-forget" href="/forgotPassword">Forgot password?</a>

                    <div className="button-create-div">
                        <button className="create-buttonn" onClick={() => navigate("/Register")}>Create Account</button>
                    </div>

                    <div className="back">
                        <Link to='/'>
                            <FaChevronLeft className="icon-arrow-left" /> Go back
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
