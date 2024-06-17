import axios from "axios";

// Get All Info dentist
const getAllDentist = async (DentistID) => {
    try {
        const response = await axios.get(
            `http://localhost:3000/getAllDentist?id=${DentistID}`,
            {
              //  params: { DentistID: DentistID },
            }
        );
        return response.data; // Return the data from the response
    } catch (error) {
        throw new Error("Error getting DentistID from account: " + error.message);
    }
};

export{
    getAllDentist
}