// import { useState } from "react";
// import "./login.css";
// import Footer from '../../components/Footer/Footer';
// import Header from '../../components/Header/Header';
// import { FaChevronLeft } from "react-icons/fa6";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { toast } from 'react-toastify';
// import { useNavigate } from "react-router-dom";
// import { login } from "../../Service/userService";

// export default function Login(props) {
//     let navigate = useNavigate();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isShowPassword, setIsShowPassword] = useState(false);
//     const defaultValidInputLogin = {
//         isValidEmail: true,
//         isValidPassword: true
//     };
//     const [checkInputLogin, setCheckInputLogin] = useState(defaultValidInputLogin);

//     const handleLogin = async () => {
//         setCheckInputLogin(defaultValidInputLogin);

//         if (!email) {
//             setCheckInputLogin({ ...defaultValidInputLogin, isValidEmail: false });
//             toast.error("Vui lòng nhập email của bạn");
//             return;
//         }
//         if (!password) {
//             setCheckInputLogin({ ...defaultValidInputLogin, isValidPassword: false });
//             toast.error("Vui lòng nhập mật khẩu của bạn");
//             return;
//         }

//         try {
//             let response = await login(email, password);
//             console.log(">>check response", response.data);

//             if (response && response.data && response.data.message === "Login successfully") {

//                 const Role = response.data.account.RoleID;// phần quyền người dùng theo RoleID
//                 console.log('check role',Role);
//                 if(Role == 1){
//                     toast.success("Chúc mừng bạn đăng nhập thành công")
//                     navigate("/");
//                 }else if(Role == 4){
//                     toast.success("Chúc mừng bạn đăng nhập thành công")
//                     navigate("/Admin");
//                 }
                
//             } else if (response && response.data && response.data.error) {
//                 toast.error(response.data.error);
//             } else {
//                 toast.error("nhập sai tài khoản hoặc mật khẩu. Vui lòng thử lại.");
//             }
//         } catch (error) {
//             toast.error("lỗi ngoài.");
//         }
//     };

//     return (
//         <div className="body">
//             <div className="back-ground col-12 col-sm-4">
//                 <div className="all">
//                     <div><h3 className="title">Trang đăng nhập</h3></div>

//                     {/* email */}
//                     <div className="div-email">
//                         <input type="text" className={checkInputLogin.isValidEmail ? 'email form-control' : 'is-invalid email form-control'} placeholder="Nhập địa chỉ email của bạn..."
//                             value={email}
//                             onChange={(event) => setEmail(event.target.value)} />
//                     </div>

//                     {/* password */}
//                     <div className="div-password">
//                         <input type={isShowPassword ? 'text' : 'password'}
//                             className={checkInputLogin.isValidPassword ? 'password form-control' : 'is-invalid password form-control'} placeholder="Nhập mật khẩu của bạn"
//                             value={password}
//                             onChange={(event) => setPassword(event.target.value)} />
//                         <div onClick={() => setIsShowPassword(!isShowPassword)} className="icon-container">
//                             {isShowPassword ? (
//                                 <FaEye className="icon-open-eye col-12 col-sm-4" />
//                             ) : (
//                                 <FaEyeSlash className="icon-open-eye col-12 col-sm-4" />
//                             )}
//                         </div>
//                     </div>

//                     {/* button login */}
//                     <div className="div-login">
//                         <button className="btn btn-primary" onClick={handleLogin}>
//                             Đăng nhập
//                         </button>
//                     </div>

//                     <div className="shift"></div>

//                     {/* forget password */}
//                     <div>
//                         <a className="text-forget" href="/forgotPassword">Đã quên mật khẩu?</a>
//                     </div>

//                     {/* button create account */}
//                     <div className="button-create-div">
//                         <div className="create-button">
//                             <Link to='/Register'>Tạo tài khoản</Link>
//                         </div>
//                     </div>

//                     {/* button back home */}
//                     <div className="back">
//                         <Link to='/'>
//                             <FaChevronLeft className="icon-arrow-left" />
//                             Go back
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }
import { useState } from "react";
import "./login.css";
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { FaChevronLeft } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { login } from "../../Service/userService";
import { loginSuccess, setUserRole } from "../../store/actions";

export default function Login(props) {
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
            console.log(">>check response", response.data);

            if (response && response.data && response.data.message === "Login successfully") {
                const Role = response.data.account.RoleID;
                console.log('check role', Role);

                if (Role == 1) {
                    toast.success("Chúc mừng bạn đăng nhập thành công");
                    navigate("/");
                }else if(Role == 2){
                    toast.success("Chúc mừng bạn đăng nhập thành công");
                    navigate("/Doctor");
                } else if (Role == 4) {
                    toast.success("Chúc mừng bạn đăng nhập thành công");
                    navigate("/Admin");
                }
            } else if (response && response.data && response.data.error) {
                toast.error(response.data.error);
            } else {
                toast.error("Nhập sai tài khoản hoặc mật khẩu. Vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Lỗi ngoài.");
        }
    };

    return (
        <div className="body">
            <div className="back-ground col-12 col-sm-4">
                <div className="all">
                    <div><h3 className="title">Trang đăng nhập</h3></div>

                    {/* email */}
                    <div className="div-email">
                        <input type="text" className={checkInputLogin.isValidEmail ? 'email form-control' : 'is-invalid email form-control'} placeholder="Nhập địa chỉ email của bạn..."
                            value={email} onChange={(event) => setEmail(event.target.value)} />
                                </div>
            
                                {/* password */}
                                <div className="div-password">
                                    <input type={isShowPassword ? 'text' : 'password'}
                                        className={checkInputLogin.isValidPassword ? 'password form-control' : 'is-invalid password form-control'} placeholder="Nhập mật khẩu của bạn"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)} />
                                    <div onClick={() => setIsShowPassword(!isShowPassword)} className="icon-container">
                                        {isShowPassword ? (
                                            <FaEye className="icon-open-eye col-12 col-sm-4" />
                                        ) : (
                                            <FaEyeSlash className="icon-open-eye col-12 col-sm-4" />
                                        )}
                                    </div>
                                </div>
            
                                {/* button login */}
                                <div className="div-login">
                                    <button className="btn btn-primary" onClick={handleLogin}>
                                        Đăng nhập
                                    </button>
                                </div>
            
                                <div className="shift"></div>
            
                                {/* forget password */}
                                <div>
                                    <a className="text-forget" href="/forgotPassword">Đã quên mật khẩu?</a>
                                </div>
            
                                {/* button create account */}
                                <div className="button-create-div">
                                    <div className="create-button">
                                        <Link to='/register'>Tạo tài khoản</Link>
                                    </div>
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
            