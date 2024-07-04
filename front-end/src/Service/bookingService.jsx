import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

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
