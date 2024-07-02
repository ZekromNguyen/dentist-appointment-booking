import axios from "axios";

export const getAllTreatments = async () => {
    try {
        const response = await axios.get('http://localhost:3000/treatments');
        return response.data; // Return the data from the response
    } catch (error) {
        throw new Error('Error fetching treatments: ' + error.message);
    }
};