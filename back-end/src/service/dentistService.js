import { Sequelize } from "sequelize";
// import AvailableSlot from "../model/availableSlot";
// import DentistSchedule1 from "../model/dentistSchedule1";
import { AvailableSlot, DentistSchedule1 } from "../model/model";
import Booking from "../model/booking";
import BookingDetail1 from "../model/bookingDetail1";
class BookingService {
  async getAvailableSlot() {
    try {
      const slots = await AvailableSlot.findAll();
      const plainSlots = slots.map((slot) => slot.toJSON());
      return plainSlots;
    } catch (error) {
      console.error("Error fetching slots from database:", error);
      throw error;
    }
  }
  async getDentistSchedule() {
    try {
      const schedules = await DentistSchedule1.findAll();
      const plainSchedules = schedules.map((schedule) => schedule.toJSON());
      return plainSchedules;
    } catch (error) {
      console.error("Error fetching slots from database:", error);
      throw error;
    }
  }
  async createScheduleForDentist({ DentistID, date, slotId }) {
    try {
      const newSchedule = await DentistSchedule1.create({
        DentistID,
        SlotID: slotId,
        Date: date,
      });
      return newSchedule;
    } catch (error) {
      console.error("Error in createSchedule method: ", error);
      throw error;
    }
  }
  async getDentistSchedules() {
    try {
      const schedules = await DentistSchedule1.findAll({
        include: {
          model: AvailableSlot,
          attributes: ["Time"],
        },
      });
      const plainSchedules = schedules.map((schedule) => schedule.toJSON());
      return plainSchedules;
    } catch (error) {
      console.error("Error in createSchedule method: ", error);
      throw error;
    }
  }
  async getSlotsByDateService(date) {
    try {
      // Lấy các slot đã được đặt từ BookingDetail1
      const bookedSlots = await BookingDetail1.findAll({
        attributes: ["ScheduleID1"],
      });

      const bookedScheduleIDs = bookedSlots.map((slot) => slot.ScheduleID1);
      console.log(bookedScheduleIDs);
      return await DentistSchedule1.findAll({
        where: {
          Date: date,
          ScheduleID1: {
            [Sequelize.Op.notIn]: bookedScheduleIDs,
          },
        },
        include: {
          model: AvailableSlot,
          attributes: ["Time"],
        },
        order: [["SlotID", "ASC"]],
      });
    } catch (error) {
      throw new Error("Error fetching slots by date");
    }
  }
  async createBooking(customerId, status, price) {
    try {
      const booking = await Booking.create({
        Status: status,
        CustomerID: customerId,
        TotalPrice: price,
      });
      return booking;
    } catch (error) {
      console.error("Error creating booking in service:", error);
      throw error;
    }
  }
  async createBookingDetail(
    dateBook,
    typeBook,
    status,
    priceBooking,
    medicalDay,
    bookingId,
    scheduleId1
  ) {
    try {
      const newBookingDetail = await BookingDetail1.create({
        DateBook: dateBook,
        TypeBook: typeBook,
        Status: status,
        PriceBooking: priceBooking,
        MedicalDay: medicalDay,
        BookingID: bookingId,
        ScheduleID1: scheduleId1,
      });
      return newBookingDetail;
    } catch (error) {
      console.error("Error creating booking detail in service:", error);
      throw error;
    }
  }
}

export default new BookingService();
