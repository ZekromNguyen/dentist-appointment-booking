import { Sequelize } from "sequelize";
import { AvailableSlot, DentistSchedule } from "../model/model";
import Booking from "../model/booking";
import BookingDetail from "../model/bookingDetail";
import Payment from "../model/payment"; // Import lớp Payment
import DentistService from "./dentistService";

class BookingService {
  // Hàm get các lịch dentist đã tạo
  async getSlotsByDateService(date) {
    try {
      const bookedSlots = await BookingDetail.findAll({
        attributes: ["ScheduleID"],
      });

      const bookedScheduleIDs = bookedSlots.map((slot) => slot.ScheduleID);
      console.log(bookedScheduleIDs);
      return await DentistSchedule.findAll({
        where: {
          Date: date,
          ScheduleID: {
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

  // Hàm tạo thanh toán
  async createPayment(bookingId, paymentMethod, status) {
    try {
      const payment = await Payment.create({
        BookingID: bookingId,
        PaymentMethod: paymentMethod,
        Status: status,
      });
      return payment;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }

  // Hàm lấy booking theo ID
  async getBookingById(bookingId) {
    try {
      return await Booking.findByPk(bookingId);
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      throw error;
    }
  }

  // Hàm cập nhật trạng thái booking
  async updateBookingStatus(bookingId, status) {
    try {
      const booking = await this.getBookingById(bookingId);
      if (booking) {
        booking.Status = status;
        await booking.save();
        return booking;
      }
      return null;
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  }
}

export default new BookingService();
