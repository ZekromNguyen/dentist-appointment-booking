import { useState } from "react";
import "./login.css";
import Footer from '../../components/Footer/Footer';
import { FaChevronLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { login } from "../../Service/userService";

const MAX_LENGTH = 50;

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
        const trimmedEmail = email.trim(); // Trim only email
        const enteredPassword = password; // Keep password as entered

        setCheckInputLogin({
            isValidEmail: !!trimmedEmail,
            isValidPassword: !!enteredPassword
        });

        if (!trimmedEmail) {
            toast.error("Please enter your account");
            return;
        }
        if (trimmedEmail.length > MAX_LENGTH) {
            toast.error("Account exceeds maximum length of 50 characters");
            return;
        }
        if (!enteredPassword) {
            toast.error("Please enter your password");
            return;
        }
        if (enteredPassword.length > MAX_LENGTH) {
            toast.error("Password exceeds maximum length of 50 characters");
            return;
        }

        try {
            const response = await login(trimmedEmail, enteredPassword); // Pass the original password
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
                    case 2: navigate("/doctor"); break; // Use correct paths
                    case 3: navigate("/ClinicOwner"); break; // Use correct paths
                    case 4: navigate("/admin"); break; // Use correct paths
                    default: navigate("/"); break;
                }
            } else if (response.data.message === "Role already logged in from another browser") {
                toast.error("This role is already logged in from another browser.");
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
                        <div className="password-container">
                            <input
                                type={isShowPassword ? 'text' : 'password'}
                                className={`password form-control ${checkInputLogin.isValidPassword ? '' : 'is-invalid'}`}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <div onClick={() => setIsShowPassword(!isShowPassword)} className="icon-container">
                                {isShowPassword ? <FaEye className="icon-open-eye-login" /> : <FaEyeSlash className="icon-open-eye-login" />}
                            </div>
                        </div>
                    </div>
                    <a className="text-link" href="/forgotPassword">Forgot password?</a>
                    <div className="button-group">
                        <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                        <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
                    </div>

                    

                    <div className="button-group">
                        <button className="btn btn-success" onClick={() => navigate("/Register")}>Create Account</button>
                    </div>

                    <div className="back-link">
                        <Link to='/'>
                            <FaChevronLeft className="icon-arrow-left" /> Go Back
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
