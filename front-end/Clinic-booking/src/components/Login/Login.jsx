import { useState } from "react";
import "./login.css"
import { FaChevronLeft } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';


// class Login extends Component {
//     constructor(props) {
//         super(props);
//     }
// }

// const handleLogin = async () => {
//     if (!email || !password) {
//         toast.error("email/password is required!");
//         return;
//     }

//     let res = await loginApi("eve.holt@reqres.in", password)
//     console.log("check login :", res)
// }


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    return (
        <div className="back-ground col-12 col-sm-4">
            <div className="all">
                <div><h3 className="title">Login Page</h3></div>
                <div className="div-email">
                    <input type="text" className="email" placeholder="Enter your email..."
                        value={email}
                        onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div className="div-password">
                    <input type={isShowPassword ? 'text' : 'password'}
                        className="password" placeholder="Enter your password"
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

                <div className="div-login ">
                    <button
                        className={email && password ? "active" : ""}
                        disabled={email && password ? false : true}
                        onClick={() => handleLogin()}
                    >
                        Login</button>
                </div>
                <div className="shift"></div>
                <div>
                    <a className="text-forget" href="">Forgoten password ?</a>
                </div>
                <div className="button-create-div">
                    <div className="create-button">
                        <Link to='/Register'>
                            Create new account
                        </Link>
                    </div>
                </div>
                <div className="back" >
                    <Link to='/'>
                        <FaChevronLeft className="icon-arrow-left" />
                        Go back </Link>
                </div>

            </div>
        </div>
    )
}
