import axios from 'axios';

const API_URL = 'http://localhost:3000';

const getAllSenderDetails = async (receiverId) => {
    try {
        const response = await axios.get(`${API_URL}/senders/${receiverId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sender details:', error);
        throw error;
    }


};
const getMessagesForClinicOwner = async (clinicOwnerId) => {
    try {
        const response = await axios.get(`/api/messages/clinicowner/${clinicOwnerId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching messages for clinic owner');
    }
};



export { getAllSenderDetails, getMessagesForClinicOwner };