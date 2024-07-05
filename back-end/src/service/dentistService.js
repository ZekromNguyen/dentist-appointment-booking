import { Sequelize } from "sequelize";
import Clinic from '../model/clinic'; // Điều chỉnh đường dẫn và tên file nếu cần thiết

import {
  AvailableSlot,
  DentistSchedule,
  Booking,
  BookingDetail,
  Customer,
  Dentist,
} from "../model/model";

class DentistService {
  async getAllDentist1() {
    try {
      const dentists = await Dentist.findAll();
      const plainDentists = dentists.map((dentist) => dentist.toJSON());
      return plainDentists;
    } catch (error) {
      console.error("Error fetching dentists from database:", error);
      throw error;
    }
  }
  //Hàm lấy các slot có sẵn của phòng khám
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
  //Hàm dentist tạo lịch làm việc cho họ
  async createScheduleForDentist(DentistID, date, SlotId) {
    try {
      const newSchedule = await DentistSchedule.create({
        DentistID,
        SlotID: SlotId,
        Date: date,
      });
      return newSchedule;
    } catch (error) {
      console.error("Error in createSchedule method: ", error);
      throw error;
    }
  }
  //Hàm lấy các lịch mà dentist đã tạo
  async getDentistSchedules() {
    try {
      const schedules = await DentistSchedule.findAll({
        include: [
          {
            model: Dentist,
            attributes: ["DentistName"],
          },
          {
            model: AvailableSlot,
            attributes: ["Time"],
          },
          {
            model: BookingDetail,
            attributes: ["BookingDetailID", "BookingID"],
            include: {
              model: Booking,
              attributes: ["CustomerID"],
              include: {
                model: Customer,
                attributes: ["CustomerName"],
              },
            },
          },
        ],
      });
      const plainSchedules = schedules.map((schedule) => schedule.toJSON());
      return plainSchedules;
    } catch (error) {
      console.error("Error in createSchedule method: ", error);
      throw error;
    }
  }
  async updateStatusDentistSchedule(id) {
    try {
      const result = await DentistSchedule.update(
        { Status: "Booked" }, // The values to update
        {
          where: {
            ScheduleID: id, // Condition to match ScheduleID in the id
          },
        }
      );
      return result;
    } catch (error) {
      console.error("Error in updateStatusDentistSchedule method: ", error);
      throw error;
    }
  }
  async getDentistScheduleByDentistId(dentistId) {
    try {
      const dentistSchedule = await DentistSchedule.findAll({
        where: { DentistID: dentistId },
        include: [
          {
            model: Dentist,
            attributes: ["DentistName"],
          },
          {
            model: AvailableSlot,
            attributes: ["Time"],
          },
          {
            model: BookingDetail,
            attributes: ["BookingDetailID", "BookingID"],
            include: {
              model: Booking,
              attributes: ["CustomerID"],
              include: {
                model: Customer,
                attributes: ["CustomerName"],
              },
            },
          },
        ],
      });

      const plainDentistSchedule = dentistSchedule.map((schedule) =>
        schedule.toJSON()
      );
      return plainDentistSchedule;
    } catch (error) {
      console.error("Error in getDentistScheduleByDentistId method: ", error);
      throw error;
    }
  }

  ///////////////////////////////////////////////////
  // async getAllDentist(DentistID) {
  //   try {
  //     let options = {
  //       attributes: [
  //         "AccountID",
  //         "DentistID",
  //         "DentistName",
  //         "Description",
  //         "ImagePath",
  //       ],
  //       include: [
  //         {
  //           model: Clinic,
  //           attributes: ["ClinicID", "ClinicName", "Address", "OpenTime", "CloseTime"],
  //           as: 'clinic',
  //         },
  //         {
  //           model: DentistSchedule,
  //           attributes: ["ScheduleID", "Date", "DayOfWeek", "Status", "SlotID"],
  //           as: 'DentistSchedules',
  //           include: [
  //             {
  //               model: AvailableSlot,
  //               attributes: ["SlotID", "Time"],
  //               as: 'AvailableSlot'
  //             }
  //           ]
  //         }
  //       ],
  //     };

  //     let account;
  //     if (DentistID === "ALL") {
  //       account = await Dentist.findAll(options);
  //     } else if (DentistID) {
  //       options.where = { DentistID: DentistID };
  //       account = await Dentist.findOne(options);
  //     }

  //     if (!account) {
  //       console.log(`Dentist with ID ${DentistID} not found`);
  //     }

  //     return account;
  //   } catch (e) {
  //     console.error("Error in getAllDentist:", e);
  //     throw e;
  //   }
  // }


  async getAllDentist(DentistID, date) {
    try {
      let options = {
        attributes: [
          "AccountID",
          "DentistID",
          "DentistName",
          "ClinicID",
          "Description",
          "ImagePath",
        ],
        include: [
          {
            model: Clinic,
            attributes: ["ClinicID", "ClinicName", "Address", "OpenTime", "CloseTime"],
            as: 'clinic',
          },
          {
            model: DentistSchedule,
            attributes: ["ScheduleID", "Date", "DayOfWeek", "Status", "SlotID"],
            as: 'DentistSchedules',
            include: [
              {
                model: AvailableSlot,
                attributes: ["SlotID", "Time"],
                as: 'AvailableSlot'
              }
            ]
          }
        ],
      };

      if (date) {
        options.include[1].where = { Date: date };
      }

      let account;
      if (DentistID === "ALL") {
        account = await Dentist.findAll(options);
      } else if (DentistID) {
        options.where = { DentistID: DentistID };
        account = await Dentist.findOne(options);
      }

      if (!account) {
        console.log(`Dentist with ID ${DentistID} not found`);
      }

      return account;
    } catch (e) {
      console.error("Error in getAllDentist:", e);
      throw e;
    }
  }

  ///////////////////////////////////////////
  async deleteDentist(DentistID) {
    try {
      const dentist = await Dentist.findOne({ where: { DentistID } });
      if (!dentist) {
        return { errCode: 1, errMessage: "Dentist not found" };
      }
      await dentist.destroy();
      return { errCode: 0, errMessage: "Dentist deleted successfully" };
    } catch (error) {
      console.error("Error deleting dentist:", error);
      throw new Error("Error deleting dentist");
    }
  }

  async updateDentist(data) {
    try {
      if (!data.DentistID) {
        return { errCode: 2, errMessage: "DentistID is required" };
      }

      const dentist = await Dentist.findOne({
        where: { DentistID: data.DentistID },
      });
      if (!dentist) {
        return { errCode: 1, errMessage: "Dentist not found" };
      }

      dentist.DentistName = data.DentistName || dentist.DentistName;
      dentist.ClinicID = data.ClinicID || dentist.ClinicID;

      await dentist.save();

      return { errCode: 0, message: "Dentist updated successfully" };
    } catch (error) {
      console.error("Error updating dentist:", error);
      throw error;
    }
  }
}

export default new DentistService();
