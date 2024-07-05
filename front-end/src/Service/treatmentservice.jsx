import axios from "axios";
import BASE_URL from "../ServiceSystem/axios";

export const getAllTreatments = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/treatments`);
        return response.data; // Return the data from the response
    } catch (error) {
        throw new Error('Error fetching treatments: ' + error.message);
    }
};