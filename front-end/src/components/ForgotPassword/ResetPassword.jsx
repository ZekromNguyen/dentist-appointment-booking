// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { resetPassword, getIdFromToken } from '../../Service/userService';
// import { toast } from 'react-toastify';
// import './ResetPassword.scss';

// export default function ResetPassword() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const token = queryParams.get('token');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');

//     useEffect(() => {
//         const fetchIdFromToken = async () => {
//             try {
//                 if (!token) return;
//                 const id = await getIdFromToken(token);
//                 // You can perform additional actions with the ID if necessary
//             } catch (error) {
//                 toast.error(error.message || 'Error getting id from token');
//             }
//         };
//         fetchIdFromToken();
//     }, [token]);

//     const handleResetPassword = async () => {
//         if (password !== confirmPassword) {
//             toast.error('Password and Confirm Password do not match');
//             return;
//         }

//         try {
//             const id = await getIdFromToken(token);
//             if (!id) {
//                 toast.error('Invalid token');
//                 return;
//             }
//             const response = await resetPassword(id, password, confirmPassword);
//             if (response.status === 200) {
//                 toast.success('Password reset successfully');
//                 navigate('/login');
//             } else {
//                 toast.error(response.data.message || 'Error resetting password');
//             }
//         } catch (error) {
//             toast.error(error.message || 'Error resetting password');
//         }
//     };

//     return (
//         <div className="reset-password-container">
//             <h2>Reset Password</h2>
//             <input
//                 type="password"
//                 placeholder="Enter new password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//             />
//             <input
//                 type="password"
//                 placeholder="Confirm new password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//             <button onClick={handleResetPassword}>Submit</button>
//         </div>
//     );
// }

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../../Service/userService';
import "./ResetPassword.scss"
export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            toast.error('Mật khẩu và xác nhận mật khẩu không trùng khớp');
            return;
        }

        try {
            const response = await resetPassword(token, password, confirmPassword);
            if (response && response.status === 200) {
                toast.success('Mật khẩu đã được cập nhật thành công');
                navigate('/login');
            } else {
                toast.error('Có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại sau.');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="reset-password-container"> {/* Match class name with CSS */}
            <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleResetPassword}>Xác nhận</button>
        </div>
    );
}
