import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './Chat.scss';
import { checkSession } from '../../Service/userService';

const socket = io('http://localhost:3000', { withCredentials: true });

const Chat = () => {
    const { senderId, receiverId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState('');
    const [roleId, setRoleId] = useState('');
    const messagesEndRef = useRef(null); // Ref for the end of the messages container

    useEffect(() => {
        console.log('Component mounted', { senderId, receiverId });

        // Fetch the username         
        const fetchUsername = async () => {
            try {
                const customer = await checkSession();
                setUsername(customer.name);
                console.log('Username fetched:', customer.name);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();

        // Fetch existing messages         
        fetchMessages();

        // Listen for new messages         
        socket.on('newMessage', (message) => {
            console.log('New message received:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('newMessage');
        };
    }, [senderId, receiverId]);

    useEffect(() => {
        const fetchSession = async () => {
            const account = await checkSession();
            setRoleId(account.RoleID);
        };
        fetchSession();
    }, [navigate]);

    // Scroll to the bottom whenever messages state updates
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = () => {
        console.log('Fetching messages for', { senderId, receiverId });
        try {
            socket.emit('getMessages', { senderId, receiverId }, (response) => {
                if (response.error) {
                    console.error('Error retrieving messages:', response.error);
                } else {
                    console.log('Messages received:', response);
                    // Ensure the messages have the right keys as per your front-end expectation                     
                    // Adjust 'SenderID' and 'MessageText' if needed                     
                    setMessages(response.map(msg => ({
                        SenderID: msg.senderId,
                        MessageText: msg.messageText,
                        ...msg // Any additional properties you might have                     
                    })));
                }
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        console.log('Messages state updated:', messages);
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const message = { senderId, receiverId, messageText: newMessage };
        try {
            socket.emit('sendMessage', message, (response) => {
                if (response.error) {
                    console.error('Error sending message:', response.error);
                } else {
                    console.log('Message sent successfully:', response);
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, response];
                        console.log('Updated messages state:', updatedMessages);
                        return updatedMessages;
                    });
                }
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleBackToHome = () => {
        if (roleId === 2) {
            navigate('/Doctor');
        } else if (roleId === 1) {
            navigate('/');
        }
    };

    // New function to navigate to the SenderList page     
    const handleNavigateToSenderList = () => {
        navigate(`/senders/${senderId}`);
    };

    // Function to handle key press in input field     
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <button onClick={handleBackToHome} className="back-button">
                    <FontAwesomeIcon icon={faHome} /> Back to Home
                </button>
                <div className="username-display">
                    {username}
                </div>
                {roleId === 2 && (
                    <button onClick={handleNavigateToSenderList} className="senderlist-button">
                        Go to Sender List
                    </button>
                )}
            </div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.SenderID == senderId ? 'message-sent' : 'message-received'}`}
                    >
                        {msg.MessageText}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}  // Add this line to handle key press                     
                    placeholder="Type a message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;

/*
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './Chat.scss';
import { checkSession } from '../../Service/userService';

const socket = io('http://localhost:3000', { withCredentials: true });

const Chat = () => {
    const { senderId, receiverId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState('');
    const [roleId, setRoleId] = useState('');
    const messagesEndRef = useRef(null); // Ref for the end of the messages container

    useEffect(() => {
        console.log('Component mounted', { senderId, receiverId });

        // Fetch the username         
        const fetchUsername = async () => {
            try {
                const customer = await checkSession();
                setUsername(customer.name);
                console.log('Username fetched:', customer.name);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();

        // Fetch existing messages         
        fetchMessages();

        // Listen for new messages         
        socket.on('newMessage', (message) => {
            console.log('New message received:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('newMessage');
        };
    }, [senderId, receiverId]);

    useEffect(() => {
        const fetchSession = async () => {
            const account = await checkSession();
            setRoleId(account.RoleID);
        };
        fetchSession();
    }, [navigate]);

    // Scroll to the bottom whenever messages state updates
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = () => {
        console.log('Fetching messages for', { senderId, receiverId });
        try {
            socket.emit('getMessages', { senderId, receiverId }, (response) => {
                if (response.error) {
                    console.error('Error retrieving messages:', response.error);
                } else {
                    console.log('Messages received:', response);
                    // Ensure the messages have the right keys as per your front-end expectation                     
                    // Adjust 'SenderID' and 'MessageText' if needed                     
                    setMessages(response.map(msg => ({
                        SenderID: msg.senderId,
                        MessageText: msg.messageText,
                        ...msg // Any additional properties you might have                     
                    })));
                }
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        console.log('Messages state updated:', messages);
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const message = { senderId, receiverId, messageText: newMessage };
        try {
            socket.emit('sendMessage', message, (response) => {
                if (response.error) {
                    console.error('Error sending message:', response.error);
                } else {
                    console.log('Message sent successfully:', response);
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, response];
                        console.log('Updated messages state:', updatedMessages);
                        return updatedMessages;
                    });
                }
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleBackToHome = () => {
        if (roleId === 2) {
            navigate('/Doctor');
        } else if (roleId === 1) {
            navigate('/');
        }
    };

    // New function to navigate to the SenderList page     
    const handleNavigateToSenderList = () => {
        navigate(`/senders/${senderId}`);
    };

    // Function to handle key press in input field     
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <button onClick={handleBackToHome} className="back-button">
                    <FontAwesomeIcon icon={faHome} /> Back to Home
                </button>
                <div className="username-display">
                    {username}
                </div>
                {roleId === 2 && (
                    <button onClick={handleNavigateToSenderList} className="senderlist-button">
                        Go to Sender List
                    </button>
                )}
            </div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.SenderID == senderId ? 'message-sent' : 'message-received'}`}
                    >
                        {msg.MessageText}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}  // Add this line to handle key press                     
                    placeholder="Type a message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
 */
