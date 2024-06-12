import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EmailSentNotification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    return (
        <div className="notification-container">
            <h2>Email Sent</h2>
            <p>An email has been sent to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.</p>
            <button onClick={() => navigate('/login')}>Back to Login</button>
        </div>
    );
};

export default EmailSentNotification;
