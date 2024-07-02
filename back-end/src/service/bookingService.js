import { Sequelize } from "sequelize";
import {
  AvailableSlot,
  DentistSchedule,
  Dentist,
  Booking,
  BookingDetail,
  Customer,
} from "../model/model";
import DentistService from "./dentistService";
import Payment from "../model/payment"; // Import lớp Payment
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
      const availableScheduleS = await DentistSchedule.findAll({
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
      const availableScheduleIDs = availableScheduleS.map((availableSchedule) =>
        availableSchedule.toJSON()
      );
      return availableScheduleIDs;
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

  //hàm get all booking
  async getAllBooking() {
    try {
      const bookings = await Booking.findAll({
        include: [
          {
            model: Customer,
            attributes: ["CustomerName"],
          },
          {
            model: BookingDetail,
            include: [
              {
                model: DentistSchedule,
                attributes: ["DentistID", "SlotID"],
                include: [
                  {
                    model: Dentist,
                    attributes: ["DentistName"],
                  },
                  {
                    model: AvailableSlot,
                    attributes: ["Time"],
                  },
                ],
              },
            ],
          },
        ],
      });
      const bookingIDs = bookings.map((booking) => booking.toJSON());
      return bookingIDs;
    } catch (error) {
      console.error("Error in getAllBooking method: ", error);
      throw error;
    }
  }

  async getAllBookingByCustomerId(CustomerId) {
    try {
      const bookings = await Booking.findAll({
        where: {
          CustomerID: CustomerId
        },
        include: [
          {
            model: BookingDetail,
            include: [
              {
                model: DentistSchedule,
                include: [
                  {
                    model: Dentist,
                    attributes: ["DentistName"],
                  },
                  {
                    model: AvailableSlot,
                    attributes: ["Time"],
                  }
                ]
              }
            ],
          }
        ],

      });
      const bookingIDs = bookings.map((booking) => booking.toJSON());
      return bookingIDs;
    } catch (error) {
      console.error("Error in getAllBooking method: ", error);
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
  //Hàm lấy tên dentist Name theo bookingDetail
  async getDentistNameByBookingDetail(BookingDetailID) {
    try {
      const dentist = await BookingDetail.findOne({
        where: { BookingDetailID: BookingDetailID },
        include: [
          {
            model: Booking,
            attributes: ["CustomerID"],
            include: {
              model: Customer,
              attributes: ["CustomerName"],
            },
          },
          {
            model: DentistSchedule,
            attributes: ["SlotID", "DentistID"],
            include: [
              {
                model: AvailableSlot,
                attributes: ["Time"],
              },
              {
                model: Dentist,
                attributes: ["DentistName"],
              },
            ],
          },
        ],
      });
      const plainDentist = dentist ? dentist.toJSON() : null; // Convert to JSON if not null
      return plainDentist;
    } catch (error) {
      console.error("Error in getDentistNameByBookingDetail method: ", error);
      throw error;
    }
  }
}

export default new BookingService();
