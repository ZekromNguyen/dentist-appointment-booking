import DentistService from "../service/dentistService";

class DentistController {
  //Hàm lấy các slot ở phòng khám cho dentist tạo lịch
  async getAvailableSlot(req, res) {
    try {
      const slots = await DentistService.getAvailableSlot();
      const schedules = await DentistService.getDentistSchedules();
      console.log(slots);
      console.log(schedules);
      res.render("schedule", {
        slots,
        schedules,
      });
    } catch (err) {
      console.error("Error fetching available slots:", err);
      res.status(500).send("Internal server error");
    }
  }

  //Hàm tạo lịch làm việc cho dentist
  async createScheduleForDentist(req, res) {
    const { date, slotId, dentistId } = req.body; // Đảm bảo rằng dentistId được lấy từ req.body
    console.log(date);
    console.log(slotId);
    console.log(dentistId);
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
}
export default new DentistController();
