import { useState } from "react";
import "./login.css";
import Footer from '../../components/Footer/Footer';
import { FaChevronLeft } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { login } from "../../Service/userService";

export default function Login() {
    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const defaultValidInputLogin = {
        isValidEmail: true,
        isValidPassword: true
    };
    const [checkInputLogin, setCheckInputLogin] = useState(defaultValidInputLogin);

    const handleLogin = async () => {
        setCheckInputLogin(defaultValidInputLogin);

        if (!email) {
            setCheckInputLogin({ ...defaultValidInputLogin, isValidEmail: false });
            toast.error("Vui lòng nhập email của bạn");
            return;
        }
        if (!password) {
            setCheckInputLogin({ ...defaultValidInputLogin, isValidPassword: false });
            toast.error("Vui lòng nhập mật khẩu của bạn");
            return;
        }

        try {
            let response = await login(email, password);
            console.log(">>check response", response.data.message);

            if (response && response.data && response.data.message === "Login successfully") {
                localStorage.setItem('account', JSON.stringify(response.data.user));
                const Role = response.data.user.RoleID; // Đảm bảo rằng `RoleID` tồn tại trong đối tượng user
                console.log('check role', Role);

                if (Role === 1) {
                    toast.success("Chúc mừng bạn đăng nhập thành công");
                    navigate("/");
                } else if (Role === 2) {
                    toast.success("Chúc mừng bạn đăng nhập thành công");
                    navigate("/Doctor");
                } else if (Role === 3) {
                    toast.success("Chúc mừng bạn đăng nhập thành công");
                    navigate("/ClinicOwner");
                } else if (Role === 4) {
                    toast.success("Chúc mừng bạn đăng nhập thành công");
                    navigate("/Admin");
                }
            } else {
                toast.error(response.data.error || "Nhập sai tài khoản hoặc mật khẩu. Vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Lỗi ngoài.");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    const handleRegister = () => {
        navigate("/Register")
    }

    const handleReset = () => {
        setEmail("");
        setPassword("");
    }
    return (
        <div className="body">
            <div className="back-ground col-12 col-sm-4">
                <div className="all">
                    <div><h3 className="title">Trang đăng nhập</h3></div>

                    {/* email */}
                    <div className="div-email">
                        <input
                            type="text"
                            className={checkInputLogin.isValidEmail ? 'email form-control' : 'is-invalid email form-control'}
                            placeholder="Nhập địa chỉ email của bạn..."
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            onKeyPress={handleKeyPress} // Thêm dòng này
                        />
                    </div>

                    {/* password */}
                    <div className="div-password">
                        <input
                            type={isShowPassword ? 'text' : 'password'}
                            className={checkInputLogin.isValidPassword ? 'password form-control' : 'is-invalid password form-control'}
                            placeholder="Nhập mật khẩu của bạn"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyPress={handleKeyPress} // Thêm dòng này
                        />
                        <div onClick={() => setIsShowPassword(!isShowPassword)} className="icon-container">
                            {isShowPassword ? (
                                <FaEye className="icon-open-eye col-12 col-sm-3" />
                            ) : (
                                <FaEyeSlash className="icon-open-eye col-12 col-sm-3" />
                            )}
                        </div>
                    </div>

                    {/* button login */}
                    <div className="div-login">
                        <button className="btn btn-primary" onClick={handleLogin}>
                            Đăng nhập
                        </button>

                        <button className="button-reset" style={{ backgroundColor: "white", color: "black", border: "1px solid black" }} onClick={handleReset}>
                            Làm mới
                        </button>
                    </div>

                    <div className="shift"></div>

                    {/* forget password */}
                    <div>
                        <a className="text-forget" href="/forgotPassword">Đã quên mật khẩu?</a>
                    </div>

                    {/* button create account */}
                    <div className="button-create-div">
                        <button className="create-buttonn" onClick={handleRegister}>
                            Tạo tài khoản
                        </button>
                    </div>

                    {/* button back home */}
                    <div className="back">
                        <Link to='/'>
                            <FaChevronLeft className="icon-arrow-left" />
                            Go back
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
