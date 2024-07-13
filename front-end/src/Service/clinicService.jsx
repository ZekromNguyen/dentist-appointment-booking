import axios from "axios";
import BASE_URL from "../ServiceSystem/axios";


const getAllClinic = async (ClinicID) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/handleGetAllClinic?id=${ClinicID}`,
            {
                params: { ClinicID: ClinicID },
            }
        );
        return response.data; // Return the data from the response
    } catch (error) {
        throw new Error("Error getting AccountID from account: " + error.message);
    }
};

const getAllClinicOwner = async (ClinicOwnerID) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/handleGetClinicOwner?id=${ClinicOwnerID}`,
            {
                params: { ClinicOwnerID: ClinicOwnerID },
            }
        );
        return response.data; // Return the data from the response
    } catch (error) {
        throw new Error("Error getting AccountID from account: " + error.message);
    }
};

export { getAllClinic, getAllClinicOwner }