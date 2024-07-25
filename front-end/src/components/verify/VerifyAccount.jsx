import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyAccount = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');

            if (token) {
                try {
                    const response = await fetch(`http://localhost:3000/verify?token=${token}`);
                    if (response.ok) {
                        navigate('/login'); // Chuyển hướng sau khi xác minh thành công
                    } else {
                        console.error('Verification failed:', await response.json());
                        // Xử lý thông báo lỗi nếu cần
                    }
                } catch (error) {
                    console.error('Verification failed:', error);
                    // Xử lý thông báo lỗi nếu cần
                }
            }
        };

        verifyToken();
    }, [navigate]);

    return (
        <div>
            <p>Verifying your account...</p>
        </div>
    );
};

export default VerifyAccount;
