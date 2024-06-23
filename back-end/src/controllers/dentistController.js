import DentistService from "../service/dentistService";

class DentistController {
  //Hàm lấy các slot ở phòng khám cho dentist tạo lịch
  async getAvailableSlot(req, res) {
    try {
      const slots = await DentistService.getAvailableSlot();
      const schedules = await DentistService.getDentistSchedules();
      const dentists = await DentistService.getAllDentist();
      console.log(slots);
      console.log(schedules);
      console.log(dentists);
      res.render("schedule", {
        slots,
        schedules,
        dentists,
      });
    } catch (err) {
      console.error("Error fetching available slots:", err);
      res.status(500).send("Internal server error");
    }
  }

  //Hàm tạo lịch làm việc cho dentist
  async createScheduleForDentist(req, res) {
    const { date, slotId, dentistId } = req.body; // Đảm bảo rằng dentistId được lấy từ req.body
    const DentistID = req.session.userID || dentistId; // Sử dụng dentistId từ request body hoặc session
    if (!DentistID) {
      return res.status(400).send("DentistID is required");
    }
    try {
      const newSchedule = await DentistService.createScheduleForDentist(
        DentistID,
        date,
        slotId
      );
      res
        .status(200)
        .json({ message: "Schedule added successfully", newSchedule });
    } catch (error) {
      res.status(500).send("Error adding schedule: " + error.message);
    }
  }
  //**************************** ADD New API***********************************************/

  async getAvailableSlotN(req, res) {
    try {
      const slots = await DentistService.getAvailableSlot();
      res.json(slots); // Hoặc res.render nếu bạn muốn render vào một template
    } catch (err) {
      console.error("Error fetching available slots:", err);
      res.status(500).send("Internal server error");
    }
  }

  async getDentistSchedules(req, res) {
    try {
      const schedules = await DentistService.getDentistSchedules();
      res.json(schedules); // Hoặc res.render nếu bạn muốn render vào một template
    } catch (err) {
      console.error("Error fetching dentist schedules:", err);
      res.status(500).send("Internal server error");
    }
  }
  async getAllDentist(req, res) {
    try {
      const dentists = await DentistService.getAllDentist();

      if (!dentists || dentists.length === 0) {
        return res.status(404).json({ message: "No dentists found" });
      }

      res.status(200).json({ message: "Success", dentists });
    } catch (error) {
      console.error("Error in handleGetAllDentists:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
export default new DentistController();
