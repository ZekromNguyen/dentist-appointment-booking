import BookingService from "../service/dentistService";
class DentistController {
  async getAvailableSlot(req, res) {
    try {
      const slots = await BookingService.getAvailableSlot();
      const schedules = await BookingService.getDentistSchedules();
      console.log(slots);
      console.log(schedules);
      res.render("schedule1", {
        slots,
        schedules,
      });
    } catch (err) {
      console.error("Error fetching available slots:", err);
      res.status(500).send("Internal server error");
    }
  }
  async schedule(req, res) {
    const { date, slotId, dentistId } = req.body; // Đảm bảo rằng dentistId được lấy từ req.body
    console.log(date);
    console.log(slotId);
    console.log(dentistId);
    const DentistID = req.session.userID || dentistId; // Sử dụng dentistId từ request body hoặc session
    if (!DentistID) {
      return res.status(400).send("DentistID is required");
    }
    try {
      const newSchedule = await BookingService.createScheduleForDentist({
        DentistID,
        date,
        slotId,
      });
      res
        .status(200)
        .json({ message: "Schedule added successfully", newSchedule });
    } catch (error) {
      res.status(500).send("Error adding schedule: " + error.message);
    }
  }
  async getDentistSchedules(req, res) {
    try {
      res.render("booking", { schedules: [] });
    } catch (error) {
      console.error("Error fetching dentist schedules:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  async getSlotsByDate(req, res) {
    try {
      const { date } = req.query;
      const slots = await BookingService.getSlotsByDateService(date);
      res.json(slots);
    } catch (error) {
      console.error("Error fetching1 slots by date:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  async createBooking(req, res) {
    try {
      const { customerId, price, status, typeBook, date, slotId } = req.body;
      const currentDateTime = new Date(); // Lấy thời gian hiện tại
      const currentDateTimeGMT7 = new Date(
        currentDateTime.getTime() + 7 * 60 * 60 * 1000
      );
      console.log(req.body);

      const newBooking = await BookingService.createBooking(
        customerId,
        status,
        price
      );
      if (!newBooking) {
        res.status(400).json({ message: "No create Booking" });
      }
      const newBookingDetail = await BookingService.createBookingDetail(
        currentDateTimeGMT7,
        typeBook,
        status,
        price,
        date,
        newBooking.BookingID,
        slotId
      );
      if (!newBookingDetail) {
        res.status(400).json({ message: "No create BookingDetail" });
      }
      res.status(200).json({ message: "Create booking successfully" });
    } catch (error) {
      console.error("Error creating booking in controller:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}
export default new DentistController();
