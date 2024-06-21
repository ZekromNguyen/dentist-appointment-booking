import { Sequelize } from "sequelize";
// import AvailableSlot from "../model/availableSlot";
// import DentistSchedule1 from "../model/dentistSchedule1";
import { AvailableSlot, DentistSchedule } from "../model/model";
import Booking from "../model/booking";
import BookingDetail from "../model/bookingDetail";
import DentistService from "./dentistService";
class BookingService {
  //Hàm get các lịch dentist đã tạo
  async getSlotsByDateByDentistService(date, dentistId) {
    try {
      // Lấy các slot đã được đặt từ BookingDetail1
      const bookedSlots = await BookingDetail.findAll({
        attributes: ["ScheduleID"],
      });

      const bookedScheduleIDs = bookedSlots.map((slot) => slot.ScheduleID);
      console.log(bookedScheduleIDs);
      return await DentistSchedule.findAll({
        where: {
          DentistID: dentistId,
          ScheduleID: {
            [Sequelize.Op.notIn]: bookedScheduleIDs,
          },
          Date: date,
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
    scheduleId
  ) {
    try {
      const newBookingDetail = await BookingDetail.create({
        DateBook: dateBook,
        TypeBook: typeBook,
        Status: status,
        PriceBooking: priceBooking,
        MedicalDay: medicalDay,
        BookingID: bookingId,
        ScheduleID: scheduleId,
      });
      const updateDentistSchedule =
        await DentistService.updateStatusDentistSchedule(
          newBookingDetail.ScheduleID
        );
      if (updateDentistSchedule) {
        console.log("Update status successfully");
      }
      return newBookingDetail;
    } catch (error) {
      console.error("Error creating booking detail in service:", error);
      throw error;
    }
  }
}

export default new BookingService();
