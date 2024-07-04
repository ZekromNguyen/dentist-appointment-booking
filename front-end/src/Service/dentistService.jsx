import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

class DentistService {
    static async getAllDentist1() {
        return axios.get(`${BASE_URL}/getAllDentist1`);
    }
}

export default DentistService;
