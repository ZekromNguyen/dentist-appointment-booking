import axios from 'axios';

import BASE_URL from '../ServiceSystem/axios';

class DentistService {
    static async getAllDentist1() {
        return axios.get(`${BASE_URL}/getAllDentist1`);
    }
}

export default DentistService;
