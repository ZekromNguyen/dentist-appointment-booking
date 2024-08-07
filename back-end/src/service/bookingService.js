import { Sequelize } from "sequelize";
import sequelize from "../config/database";
import {
  AvailableSlot,
  DentistSchedule,
  Dentist,
  Booking,
  BookingDetail,
  Customer,
  Account,
  Treatment
} from "../model/model";
import DentistService from "./dentistService";
import Payment from "../model/payment"; // Import lớp Payment
import moment from "moment";
class BookingService {
  //Hàm get các lịch dentist đã tạo
  async getSlotsByDateByDentistService(date, dentistId, isNotCustomer) {
    try {
      // Lấy các slot đã được đặt từ BookingDetail1
      const bookedSlots = await BookingDetail.findAll({
        where: {
          Status: "Confirmed",
        },
        attributes: ["ScheduleID"],
      });

      const bookedScheduleIDs = bookedSlots.map((slot) => slot.ScheduleID);
      console.log(bookedScheduleIDs);
      console.log(isNotCustomer);
      console.log("isNotCustomer type:", typeof isNotCustomer);
      if (Number(isNotCustomer) === 1) {
        console.log("Fetching slots for non-customer...");
        const availableScheduleS = await DentistSchedule.findAll({
          where: {
            DentistID: dentistId,
            Date: date,
            Status: {
              [Sequelize.Op.in]: ["Expired", "Available","Booked"],
            },
          },
          include: {
            model: AvailableSlot,
            attributes: ["Time"],
          },
          order: [["SlotID", "ASC"]],
        });
        const availableScheduleIDs = availableScheduleS.map(
          (availableSchedule) => availableSchedule.toJSON()
        );
        const dateNow = moment().format("YYYY-MM-DD");
        if (dateNow === date) {
          const timeNow = moment().format("HH:mm");
          const slots = await AvailableSlot.findAll();
          const expiredSlotIDs = [];

          // Kiểm tra nếu giờ khám đã qua thì thêm SlotID vào mảng expiredSlotIDs
          slots.forEach((slot) => {
            const slotTime = moment(slot.Time, "HH:mm"); // Chuyển đổi Time từ string sang moment object
            if (slotTime.isBefore(moment(timeNow, "HH:mm"))) {
              expiredSlotIDs.push(slot.SlotID);
            }
          });
          console.log(expiredSlotIDs);
          if (expiredSlotIDs.length > 0) {
            expiredSlotIDs.forEach((slotID) => {
              availableScheduleIDs.push({
                ScheduleID: null,
                DentistID: null,
                SlotID: slotID,
                Date: date,
                DayOfWeek: null,
                Status: null,
                AvailableSlot: null,
              });
            });
          }
          console.log(availableScheduleIDs);
        }

        return availableScheduleIDs;
      } else {
        const availableScheduleS = await DentistSchedule.findAll({
          where: {
            DentistID: dentistId,
            ScheduleID: {
              [Sequelize.Op.notIn]: bookedScheduleIDs,
            },
            Date: date,
            Status: "Available",
          },
          include: {
            model: AvailableSlot,
            attributes: ["Time"],
          },
          order: [["SlotID", "ASC"]],
        });
        const availableScheduleIDs = availableScheduleS.map(
          (availableSchedule) => availableSchedule.toJSON()
        );
        return availableScheduleIDs;
      }
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
    scheduleId,
    recurringType,
    recurringEndDate
  ) {
    try {
      const transaction = await sequelize.transaction();
  
      if (recurringType === "None" || !recurringEndDate) {
        // Create firstBookingDetail
        const firstBookingDetail = await BookingDetail.create(
          {
            DateBook: dateBook,
            TypeBook: typeBook,
            Status: status,
            PriceBooking: priceBooking,
            MedicalDay: medicalDay,
            BookingID: bookingId,
            ScheduleID: scheduleId,
            RecurringType: recurringType,
          },
          { transaction }
        );
        await transaction.commit();
        return firstBookingDetail;
      } else {
        const firstBookingDetail = await BookingDetail.create(
          {
            DateBook: dateBook,
            TypeBook: typeBook,
            Status: status,
            PriceBooking: priceBooking,
            MedicalDay: medicalDay,
            BookingID: bookingId,
            ScheduleID: scheduleId,
            RecurringType: recurringType,
            RecurringEndDate: recurringEndDate,
          },
          { transaction }
        );
  
        // Logic to handle recurring bookings
        const recurringDetails = [];
        const dentistSchedules = [];
        let nextDate = new Date(medicalDay);
        const Schedule = await DentistService.getDetailDentistSchedule(scheduleId);
        const maxRecurrences = recurringType === "Weekly" ? 3 : 11;
        let recurrenceCount = 0;
  
        while (nextDate < new Date(recurringEndDate) && recurrenceCount < maxRecurrences) {
          if (recurringType === "Weekly") {
            nextDate.setDate(nextDate.getDate() + 7);
          } else if (recurringType === "Monthly") {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }
  
          if (nextDate < new Date(recurringEndDate) && recurrenceCount < maxRecurrences) {
            dentistSchedules.push({
              DentistID: Schedule.DentistID,
              SlotID: Schedule.SlotID,
              Date: nextDate,
              Status: "Available",
            });
            recurrenceCount++;
          }
  
          if (dentistSchedules.length > 0) {
            const createdSchedules = await DentistSchedule.bulkCreate(dentistSchedules, { transaction });
            // Get the ScheduleIDs from the created schedules
            createdSchedules.forEach((schedule) => {
              recurringDetails.push({
                DateBook: dateBook,
                TypeBook: typeBook,
                Status: "Pending",
                PriceBooking: priceBooking,
                MedicalDay: schedule.Date,
                BookingID: bookingId,
                ScheduleID: schedule.ScheduleID, // Use the ScheduleID from created schedules
                RecurringType: recurringType,
                RecurringEndDate: recurringEndDate,
              });
            });
            // Clear dentistSchedules after creating them to avoid duplication
            dentistSchedules.length = 0;
          }
        }
  
        if (recurringDetails.length > 0) {
          await BookingDetail.bulkCreate(recurringDetails, { transaction });
        }
        await transaction.commit();
        return firstBookingDetail;
      }
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating booking detail in service:", error);
      throw error;
    }
  }

  //hàm get all booking
  async getAllBooking(OwnerId) {
    try {
      const allDentist = await DentistService.getAllDentistByOwner(OwnerId);
      const allDentistIds = allDentist.map((dentist) => dentist.DentistID);

      if (allDentistIds.length === 0) {
        return [];
      }
      const bookings = await Booking.findAll({
        include: [
          {
            model: Customer,
            attributes: ["CustomerName", "CustomerID"],
          },
          {
            model: BookingDetail,
            include: [
              {
                model: DentistSchedule,
                where: {
                  DentistID: {
                    [Sequelize.Op.in]: allDentistIds,
                  },
                },
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
      return bookings.map((booking) => booking.toJSON());
    } catch (error) {
      console.error("Error in getAllBooking method: ", error);
      throw error;
    }
  }

  async getAllBookingByDentist(DentistId) {
    try {
      const bookings = await Booking.findAll({
        include: [
          {
            model: Customer,
            attributes: ["CustomerName", "CustomerID"],
          },
          {
            model: BookingDetail,
            include: [
              {
                model: DentistSchedule,
                where: {
                  DentistID: DentistId
                },
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
      return bookings.map((booking) => booking.toJSON());
    } catch (error) {
      
    }
  }
  async updateBookingDetail(id, updates) {
    try {
      const result = await BookingDetail.update(updates, {
        where: { BookingDetailID: id },
      });
      if (result[0] === 0) {
        throw new Error("Update failed");
      }
      return result;
    } catch (error) {
      console.error("Error in updateBookingDetail method:", error);
      throw error;
    }
  }
  async deleteBooking(id) {
    try {
      const result = await Booking.destroy({
        where: { BookingID: id },
      });
      if (result === 0) {
        throw new Error("Delete failed");
      }
      return result;
    } catch (error) {
      console.error("Error in deleteBooking method:", error);
      throw error;
    }
  }
  async updateSlotStatus(scheduleId, status) {
    try {
      const result = await DentistSchedule.update(
        { Status: status },
        { where: { ScheduleID: scheduleId } }
      );
      if (result[0] === 0) {
        throw new Error("Update failed");
      }
      return result;
    } catch (error) {
      console.error("Error in updateSlotStatus method:", error);
      throw error;
    }
  }
  async getBookingDetailById(id) {
    try {
      const bookingDetail = await BookingDetail.findByPk(id, {
        include: [
          {
            model: Booking,
          },
          {
            model: DentistSchedule,
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
      if (!bookingDetail) {
        throw new Error("BookingDetail not found");
      }
      return bookingDetail.toJSON();
    } catch (error) {
      console.error("Error in getBookingDetailById method:", error);
      throw error;
    }
  }

  async getAllBookingByCustomerId(CustomerId) {
    try {
      const bookings = await Booking.findAll({
        where: {
          CustomerID: CustomerId,
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

  async getAllBookingInfo() {
    try {
      const bookings = await Booking.findAll({});
      return bookings;
    } catch (error) {
      console.error("Error fetching booking information:", error);
      throw error;
    }
  }

  async getAllBookingDetails(bookingId) {
    try {
      const bookingDetails = await BookingDetail.findAll({
        where: {
          BookingID: bookingId,
        },
      });
      return bookingDetails;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  }

  //Hàm cập nhật trạng thái booking từ owner
  async updateBookingStatusFromOwner(bookingDetailId, status) {
    const transaction = await sequelize.transaction();
    try {
      const [detailUpdated] = await BookingDetail.update(
        { Status: status },
        {
          where: { BookingDetailID: bookingDetailId },
          transaction,
        }
      );
      if (detailUpdated === 0) {
        await transaction.rollback();
        throw new Error("BookingDetail update failed");
      }
      await transaction.commit();
      return detailUpdated;
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating booking status from Owner:", error);
      throw error;
    }
  }

  // Hàm cập nhật trạng thái booking
  async updateBookingStatus(bookingId, status) {
    const transaction = await sequelize.transaction();
    try {
      const booking = await this.getBookingById(bookingId);
      if (booking) {
        booking.Status = status;
        await booking.save({ transaction });
        await BookingDetail.update(
          { Status: status },
          {
            where: {
              BookingID: bookingId,
            },
            transaction,
          }
        );
        const updatedBookingDetails = await BookingDetail.findAll({
          where: { BookingID: bookingId },
          transaction,
        });

        // Update DentistSchedule based on updated BookingDetail records
        for (let bookingDetail of updatedBookingDetails) {
          const ScheduleID = bookingDetail.ScheduleID;

          if (ScheduleID) {
            // Update DentistSchedule
            await DentistSchedule.update(
              { Status: "Booked" },
              { where: { ScheduleID: ScheduleID }, transaction, }
            );
          }
        }
        await transaction.commit();
        return booking;
      }
      await transaction.rollback();
      return null;
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating booking status:", error);
      throw error;
    }
  }
  async cancelPendingBookings() {
    try {
      const now = new Date();
      const utcOffset = 7 * 60; // UTC+7 = 7 giờ * 60 phút = 420 phút
      const nowUtcPlus7 = new Date(now.getTime() + (utcOffset * 60000)); // Cộng thêm thời gian UTC+7

      // Lấy thời gian hai phút trước
      const twoMinutesAgo = new Date(nowUtcPlus7.getTime() - (5 * 60000)); // Trừ đi 2 phút (2 phút * 60000 ms/phút)

      console.log('Current time in UTC+7:', nowUtcPlus7.toISOString());
      console.log('2 minutes ago in UTC+7:', twoMinutesAgo.toISOString());


      // Update BookingDetail statuses
      const [updatedCount] = await BookingDetail.update(
        { Status: "Cancelled" },
        {
          where: {
            Status: "Pending",
            DateBook: {
              [Sequelize.Op.lt]: twoMinutesAgo,
            },
          },
        }
      );

      console.log('Number of bookings updated:', updatedCount);

      if (updatedCount > 0) {
        // Find cancelled bookings
        const cancelledBookings = await BookingDetail.findAll({
          where: {
            Status: "Cancelled",
            DateBook: {
              [Sequelize.Op.lt]: twoMinutesAgo,
            },
          },
          attributes: ["ScheduleID"],
        });

        const cancelledScheduleIDs = cancelledBookings.map(
          (booking) => booking.ScheduleID
        );

        console.log('Cancelled Schedule IDs:', cancelledScheduleIDs);

        // Update DentistSchedule statuses
        await DentistSchedule.update(
          { Status: "Available" },
          {
            where: {
              ScheduleID: {
                [Sequelize.Op.in]: cancelledScheduleIDs,
              },
            },
          }
        );
      }
    } catch (error) {
      console.error('Error in cancelPendingBookings method:', error);
      throw error;
    }
  }

  async getAllBookingTodayToSendEmail() {
    try {
      const timeNow = moment().format("HH:mm");
      const dateNow = moment().format("YYYY-MM-DD");
      // Lấy tất cả các slot
      const slots = await AvailableSlot.findAll();
      const expiredSlotIDs = [];

      // Kiểm tra nếu giờ khám đã qua thì thêm SlotID vào mảng expiredSlotIDs
      slots.forEach((slot) => {
        const slotTime = moment(slot.Time, "HH:mm"); // Chuyển đổi Time từ string sang moment object
        if (slotTime.isAfter(moment(timeNow, "HH:mm"))) {
          expiredSlotIDs.push(slot.SlotID);
        }
      });
      const maxExpiredSlotID =
        expiredSlotIDs.length > 0 ? Math.min(...expiredSlotIDs) : null;
      if (maxExpiredSlotID > 0) {
        const bookingDetails = await BookingDetail.findAll({
          where: {
            MedicalDay: dateNow,
            Status: "Confirmed",
          },
          include: [
            {
              model: DentistSchedule,
              attributes: ["SlotID"],
              where: {
                SlotID: maxExpiredSlotID,
              },
              include: {
                model: AvailableSlot,
                attributes: ["Time"],
              },
            },
            {
              model: Booking,
              attributes: ["CustomerID"],
              include: [
                {
                  model: Customer,
                  attributes: ["AccountID"],
                  include: [
                    {
                      model: Account,
                      attributes: ["Email"],
                    },
                  ],
                },
              ],
            },
          ],
        });
        return bookingDetails;
      }
    } catch (error) {
      console.error("Error in getAllBookingTodayToSendEmail method: ", error);
    }
  }

  async getAllBookingToSendEmail(date) {
    try {
      const bookings = await BookingDetail.findAll({
        where: {
          MedicalDay: date,
          Status: "Confirmed",
        },
        include: [
          {
            model: Booking,
            attributes: ["CustomerID"],
            include: [
              {
                model: Customer,
                attributes: ["AccountID"],
                include: [
                  {
                    model: Account,
                    attributes: ["Email"],
                  },
                ],
              },
            ],
          },
          {
            model: DentistSchedule,
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
      const plainBooking = bookings.map((booking) => booking.toJSON());
      return plainBooking;
    } catch (error) {
      console.error("Error in getAllBookingToSendEmail method: ", error);
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

  checkIfTreatmentExists = async (bookingDetailId) => {
    try {
      const treatment = await Treatment.findOne({ where: { BookingDetailID: bookingDetailId } });
      return !!treatment;
    } catch (error) {
      console.error('Error checking treatment existence in service:', error);
      throw new Error('Error checking treatment existence');
    }
  };
}

export default new BookingService();
