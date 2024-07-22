import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../../Service/userService';
import "./ResetPassword.scss";

export default function ResetPassword() {
    const location = useLocation();
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            toast.error('Invalid or missing token');
            navigate('/'); // Redirect to home or some error page
        }
    }, [location, navigate]);

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            toast.error('Password and Confirm Password do not match');
            return;
        }

        try {
            const response = await resetPassword(token, password, confirmPassword);
            if (response && response.status === 200) {
                toast.success('Password has been updated successfully');
                navigate('/login');
            } else {
                toast.error('An error occurred while updating the password. Please try again later.');
            }
        } catch (error) {
            toast.error('An error occurred while updating the password. Please try again later.');
        }
    };

    return (
        <div className="reset-password-container">
            <div className='reset-title'>Confirm Password</div>
            <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleResetPassword}>Confirm</button>
        </div>
    );
}
