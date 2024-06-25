import DentistService from "../service/dentistService";

class DentistController {
  //Hàm lấy các slot ở phòng khám cho dentist tạo lịch
  async getAvailableSlot(req, res) {
    try {
      const slots = await DentistService.getAvailableSlot();
      const schedules = await DentistService.getDentistSchedules();
      const dentists = await DentistService.getAllDentist1();
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

  // Hàm get lịch của 1 dentist nếu có customer booking thì hiện cả tên customer
  async getDentistScheduleByDentistId(req, res) {
    const { dentistId } = req.query;
    console.log(dentistId);
    if (!dentistId) {
      res.status(400).json({ message: "DentistId is required" });
    }
    try {
      const newDentistScheduleByDentistId =
        await DentistService.getDentistScheduleByDentistId(dentistId);
      if (
        !newDentistScheduleByDentistId ||
        newDentistScheduleByDentistId.length === 0
      ) {
        return res.status(404).json({ message: "No dentist found" });
      }
      res
        .status(200)
        .json({ message: "Success", newDentistScheduleByDentistId });
    } catch (error) {
      console.error("Error fetching getDentistScheduleByDentistID", error);
      res.status(500).json({ message: "Internal server error" });
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
      const dentists = await DentistService.getAllDentist1();
      console.log(dentists);
      if (!dentists || dentists.length === 0) {
        return res.status(404).json({ message: "No dentists found" });
      }

      res.status(200).json({ message: "Success", dentists });
    } catch (error) {
      console.error("Error in handleGetAllDentists:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  //////////////////////////////////////
  async handleGetAllDentist(req, res) {
    let DentistID = req.query.DentistID;
    if (!DentistID) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameter",
        account: [],
      });
    }
    let account = await DentistService.getAllDentist(DentistID);
    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      account,
    });
  }

  async handleDeleteDentist(req, res) {
    const { DentistID } = req.body;
    if (!DentistID) {
      return res
        .status(400)
        .json({ errCode: 1, errMessage: "DentistID is required" });
    }
    try {
      const message = await DentistService.deleteDentist(DentistID);
      return res.status(200).json(message);
    } catch (error) {
      console.error("Error deleting dentist:", error);
      return res
        .status(500)
        .json({ errCode: 1, errMessage: "Error deleting dentist" });
    }
  }

  async handleEditDentist(req, res) {
    try {
      const data = req.body;
      if (!data.DentistID) {
        return res
          .status(400)
          .json({ errCode: 2, errMessage: "DentistID is required" });
      }
      const message = await DentistService.updateDentist(data);
      if (message.errCode !== 0) {
        return res.status(400).json(message);
      }
      return res.status(200).json(message);
    } catch (error) {
      console.error("Error updating dentist:", error);
      return res
        .status(500)
        .json({ errCode: 1, errMessage: "Error updating dentist" });
    }
  }
}
export default new DentistController();
