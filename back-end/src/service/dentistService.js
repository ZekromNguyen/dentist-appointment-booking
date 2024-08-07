import { Sequelize } from "sequelize";
import moment from "moment";
import { Op } from 'sequelize';

import {
  AvailableSlot,
  DentistSchedule,
  Booking,
  BookingDetail,
  Customer,
  Dentist,
  Clinic,
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
  async getDentistSchedules(OwnerId) {
    try {
      const allDentist = await this.getAllDentistByOwner(OwnerId);
    const allDentistIds = allDentist.map((dentist) => dentist.DentistID);
      const schedules = await DentistSchedule.findAll({
        where: {
          DentistID: {
            [Sequelize.Op.in] : allDentistIds
          }
        },
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
        order: [
          ["Date", "DESC"],
          ["SlotID", "ASC"],
        ],
      });
      const plainSchedules = schedules.map((schedule) => schedule.toJSON());
      return plainSchedules;
    } catch (error) {
      console.error("Error in createSchedule method: ", error);
      throw error;
    }
  }

  async getDentistSchedulesForCustomer() {
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
        order: [
          ["Date", "DESC"],
          ["SlotID", "ASC"],
        ],
      });
      const plainSchedules = schedules.map((schedule) => schedule.toJSON());
      return plainSchedules;
    } catch (error) {
      console.error("Error in createSchedule method: ", error);
      throw error;
    }
  }

  async getAllDentistByOwner(OwnerId) {
    try {
      // Fetch all clinics owned by the specified owner
      const allClinic = await Clinic.findAll({
        where: {
          ClinicOwnerID: OwnerId,
        },
        attributes: ["ClinicID"],
      });
  
      // Map the results to an array of ClinicID values
      const clinicIds = allClinic.map((clinic) => clinic.ClinicID);
  
      // If no clinics are found, return an empty array or handle accordingly
      if (clinicIds.length === 0) {
        return [];
      }
  
      // Fetch all dentists associated with the clinics found
      const allDentist = await Dentist.findAll({
        where: {
          ClinicID: {
            [Sequelize.Op.in]: clinicIds,
          },
        },
        include: {
          model: Clinic,
          attributes: ["ClinicName"],
        },
      });
      const allDentists = allDentist.map((dentist) => dentist.toJSON());
      return allDentists;
    } catch (error) {
      console.error("Error in getAllDentistByOwner:", error);
      throw error;
    }
  }

  async getOwnerIdByClinicId(DentistId) {
    try {
      // Find the dentist by primary key
      const dentist = await Dentist.findByPk(DentistId);
  
      // Ensure dentist is found
      if (!dentist) {
        throw new Error(`Dentist with ID ${DentistId} not found`);
      }
  
      // Get the ClinicID from the dentist
      const clinicId = dentist.ClinicID;
  
      // Find the clinic by primary key
      const clinic = await Clinic.findByPk(clinicId);
  
      // Ensure clinic is found
      if (!clinic) {
        throw new Error(`Clinic with ID ${clinicId} not found`);
      }
  
      // Return the OwnerId
      return clinic;
    } catch (error) {
      console.error("Error in getOwnerIdByClinicId:", error);
      throw error;
    }
  }
  

  async deleteUnbookedSchedules() {
    try {
      const now = new Date();
      const result = await DentistSchedule.destroy({
        where: {
          Status: 'Available',
          Date: { [Op.gt]: now },
        },
      });
      return result;
    } catch (error) {
      console.error('Error deleting unbooked schedules:', error);
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
            attributes: [
              "ClinicID",
              "ClinicName",
              "Address",
              "OpenTime",
              "CloseTime",
            ],
            as: "clinic",
          },
          {
            model: DentistSchedule,
            attributes: ["ScheduleID", "Date", "DayOfWeek", "Status", "SlotID"],
            as: "DentistSchedules",
            include: [
              {
                model: AvailableSlot,
                attributes: ["SlotID", "Time"],
                as: "AvailableSlot",
              },
            ],
          },
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
  async getDetailDentistSchedule(scheduleId) {
    try {
      const detailDentistSchedule = await DentistSchedule.findByPk(scheduleId);
      if (!detailDentistSchedule) {
        console.log(`Not Found Detail Schedule By ScheduleID:${scheduleId}`);
        return null;
      }
      return detailDentistSchedule;
    } catch (error) {
      console.log("Error getDetailDentistSchedule: ", error);
    }
  }

  async updateExpiredSlots() {
    const dateNow = moment().format("YYYY-MM-DD");
    const hourNow = moment().format("HH:mm");
    try {
      // Lấy tất cả các slot
      const slots = await AvailableSlot.findAll();
      const expiredSlotIDs = [];

      // Kiểm tra nếu giờ khám đã qua thì thêm SlotID vào mảng expiredSlotIDs
      slots.forEach((slot) => {
        const slotTime = moment(slot.Time, "HH:mm"); // Chuyển đổi Time từ string sang moment object
        if (slotTime.isBefore(moment(hourNow, "HH:mm"))) {
          expiredSlotIDs.push(slot.SlotID);
        }
      });
      console.log(expiredSlotIDs);
      if (expiredSlotIDs.length > 0) {
        // Cập nhật trạng thái các DentistSchedule có SlotID nằm trong expiredSlotIDs
        await DentistSchedule.update(
          { Status: "Expired" },
          {
            where: {
              SlotID: {
                [Sequelize.Op.in]: expiredSlotIDs,
              },
              Date: {
                [Sequelize.Op.lte]: dateNow,
              },
              Status: "Available",
            },
          }
        );
      }
      console.log("Update Expired Slot success");
    } catch (error) {
      console.error("Error updating ExpiredSlots:", error);
    }
  }
}

export default new DentistService();
