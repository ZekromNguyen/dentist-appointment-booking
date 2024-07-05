import axios from 'axios';
import BASE_URL from '../ServiceSystem/axios';

class BookingService {
    static async getSlotsByDateByDentistService(dentistID, date) {
        return axios.get(`${BASE_URL}/slotsByDate`, {
            params: { dentistID, date }
        });
    }

    static async createBooking(bookingData) {
        return axios.post(`${BASE_URL}/booking`, bookingData);
    }
}

export default BookingService;
