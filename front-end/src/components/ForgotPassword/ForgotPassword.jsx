// // import React, { useState } from 'react';
// // import "./forgotpassword.scss";
// // import { useNavigate } from "react-router-dom";
// // import { toast } from 'react-toastify';
// // import { forgotPassword } from '../../Service/userService';  // Import forgotPassword
// // //import LoadingSpinner from '../../components/ForgotPassword/EmailSentNotification'; // Import LoadingSpinner
// // import UpdatePassword from './ResetPassword';
// // export default function ForgotPassword(props) {
// //     let navigate = useNavigate();

// //     const [email, setEmail] = useState("");
// //     // const [isLoading, setIsLoading] = useState(false);
// //     const defaultValidInput = {
// //         isValidEmail: true
// //     };
// //     const [checkInput, setCheckInput] = useState(defaultValidInput);

// //     const handleForgot = async () => {
// //         setCheckInput(defaultValidInput);

// //         if (!email) {
// //             setCheckInput({ ...defaultValidInput, isValidEmail: false });
// //             toast.error("Vui lòng nhập email của bạn");
// //             return;
// //         }

// //         //setIsLoading(true); // Hiển thị spinner

// //         try {
// //             let response = await forgotPassword(email);
// //             // setIsLoading(false); // Ẩn spinner
// //             if (response.status === 200) {
// //                 //  navigate('/email-sent', { state: { email } }); // Điều hướng đến trang thông báo và truyền email
// //                 // navigate('/ResetPassword');
// //                 if (response.status === 200) {
// //                     navigate(`/ResetPassword?token=${response.data.token}`); // Chuyển hướng đến trang ResetPassword và truyền token qua URL
// //                 }
// //             }
// //         } catch (error) {
// //             // setIsLoading(false); // Ẩn spinner
// //             toast.error("Không thể gửi yêu cầu. Vui lòng thử lại sau.");
// //         }
// //     };

// //     return (
// //         <div className='background-forgot'>
// //             {/* {isLoading && <LoadingSpinner />}  Hiển thị spinner nếu isLoading là true */}
// //             <div className='box-forgot'>
// //                 <div className='forgot-title'>Forgot Password</div>
// //                 <div className='forgot-input'>
// //                     <input
// //                         type='email'
// //                         className={checkInput.isValidEmail ? 'form-control forgot' : 'is-invalid form-control'}
// //                         placeholder='Enter your email...'
// //                         value={email}
// //                         onChange={(event) => setEmail(event.target.value)}
// //                     />
// //                 </div>
// //                 <div className='btn-forgot'>
// //                     <button className='button-forgot' onClick={handleForgot}>Submit</button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

/*import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../Service/userService';
import "./forgotpassword.scss";
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);

    const handleForgot = async () => {
        if (!email) {
            toast.error("Vui lòng nhập email của bạn");
            setIsValidEmail(false);
            return;
        }

        // Kiểm tra tính hợp lệ của địa chỉ email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error("Địa chỉ email không hợp lệ");
            setIsValidEmail(false);
            return;
        }

        try {
            const response = await forgotPassword(email);
            if (response.status === 200) {
                toast.success("Email xác nhận đã được gửi đến địa chỉ email của bạn");
            }
        } catch (error) {
            toast.error("Không thể gửi yêu cầu. Vui lòng thử lại sau.");
        }
    };


    return (
        <div className='background-forgot'>
            <div className='box-forgot'>
                <div className='forgot-title'>Forgot Password</div>
                <div className='forgot-input'>
                    <input
                        type='email'
                        className={isValidEmail ? 'form-control forgot' : 'is-invalid form-control'}
                        placeholder='Enter your email...'
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setIsValidEmail(true); // Reset trạng thái hợp lệ của email khi người dùng thay đổi nội dung
                        }}
                    />
                </div>
                <div className='btn-forgot'>
                    <button className='button-forgot' onClick={handleForgot}>Submit</button>
                </div>
            </div>
        </div>
    );
}*/
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../Service/userService';
import "./forgotpassword.scss";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);

    const handleForgot = async () => {
        if (!email) {
            toast.error("Vui lòng nhập email của bạn");
            setIsValidEmail(false);
            return;
        }

        // Kiểm tra tính hợp lệ của địa chỉ email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            toast.error("Địa chỉ email không hợp lệ");
            setIsValidEmail(false);
            return;
        }

        try {
            const response = await forgotPassword(email);
            if (response.status === 200) {
                toast.success("Email xác nhận đã được gửi đến địa chỉ email của bạn");
            } else {
                toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        } catch (error) {
            toast.error("Không thể gửi yêu cầu. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className='background-forgot'>
            <div className='box-forgot'>
                <div className='forgot-title'>Quên mật khẩu</div>
                <div className='forgot-input'>
                    <input
                        type='email'
                        className={`form-control forgot ${!isValidEmail ? 'is-invalid' : ''}`}
                        placeholder='Nhập email của bạn...'
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            setIsValidEmail(true); // Reset trạng thái hợp lệ của email khi người dùng thay đổi nội dung
                        }}
                    />
                </div>
                <div className='btn-forgot'>
                    <button className='button-forgot' onClick={handleForgot}>Gửi</button>
                </div>
            </div>
        </div>
    );
}

