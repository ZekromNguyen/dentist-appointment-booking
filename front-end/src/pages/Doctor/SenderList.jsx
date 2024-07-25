import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllSenderDetails } from '../../Service/chatService';
import './SenderList.scss';

const SenderList = () => {
    const { receiverId } = useParams();
    const navigate = useNavigate();
    const [senderDetails, setSenderDetails] = useState([]);

    useEffect(() => {
        const fetchSenderDetails = async () => {
            try {
                const details = await getAllSenderDetails(receiverId);
                setSenderDetails(details);
            } catch (error) {
                console.error('Error fetching sender details:', error);
            }
        };

        fetchSenderDetails();
    }, [receiverId]);

    const handleChatNavigation = (senderId) => {
        // Navigate to the chat component with the selected sender
        navigate(`/chat/${senderId}/${receiverId}`);
    };

    return (
        <div className="sender-list-container">
            <h2>Senders</h2>
            <ul className="sender-list">
                {senderDetails.map((sender, index) => (
                    <li key={index} onClick={() => handleChatNavigation(sender.SenderID)}>
                        <div>{sender.CustomerName}</div>
                        <div>{sender.AccountID}</div>
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate('/')} className="back-home-button">Back to Home</button>
        </div>
    );
};

export default SenderList;