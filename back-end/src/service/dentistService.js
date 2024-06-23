import { Sequelize } from "sequelize";

import { AvailableSlot, DentistSchedule, Dentist } from "../model/model";

class DentistService {
  async getAllDentist() {
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
      console.log(`Successfully updated ${id} schedules to Booked status.`);
    } catch (error) {
      console.error("Error in updateStatusDentistSchedule method: ", error);
      throw error;
    }
  }
}

export default new DentistService();
