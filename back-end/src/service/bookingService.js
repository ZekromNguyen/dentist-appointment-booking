import { Sequelize } from "sequelize";
import AvailableSlot from "../model/availableSlot";

class BookingService {
  async getAvailableSlot() {
    try {
      const slots = await AvailableSlot.findAll();
      console.log("Fetched slots:", slots); // Debugging: Log the fetched slots
      const plainSlots = slots.map((slot) => slot.toJSON());
      return plainSlots;
    } catch (error) {
      console.error("Error fetching slots from database:", error);
      throw error;
    }
  }
}
module.exports = new BookingService();
