import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllSenderDetails } from '../../Service/chatService';
import moment from 'moment';
import './SenderList.scss';

const SenderList = () => {
    const { receiverId } = useParams();
    const navigate = useNavigate();
    const [senderDetails, setSenderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSenderDetails = async () => {
            try {
                const details = await getAllSenderDetails(receiverId);
                console.log("Fetched sender details:", details); // Debugging line
                setSenderDetails(details);
            } catch (error) {
                setError('Error fetching sender details');
                console.error('Error fetching sender details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSenderDetails();
    }, [receiverId]);

    const handleChatNavigation = (senderId) => {
        navigate(`/chat/${receiverId}/${senderId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!senderDetails || senderDetails.length === 0) {
        return <div>No sender details available</div>;
    }

    return (
        <div className="sender-list-container">
            <h2>Messages</h2>
            <ul className="sender-list">
                {senderDetails.map((senderDetail) => (
                    <li
                        key={senderDetail.SenderID}
                        className={!senderDetail.isViewed ? 'unread' : ''}
                        onClick={() => handleChatNavigation(senderDetail.SenderID)}
                    >
                        <div className="sender-info">
                            <div className="sender-name">{senderDetail.CustomerName}</div>

                        </div>
                        <div className="message-timestamp">
                            {moment(senderDetail.Timestamp).format('MMM DD, YYYY h:mm A')}
                        </div>
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate('/Doctor')} className="back-home-button">Back to Home</button>
        </div>
    );
};

export default SenderList;

