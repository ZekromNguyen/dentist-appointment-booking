import BookingService from "../service/bookingService";
class BookingController {
  //Hàm lấy lịch dentist đã tạo cho customer book
  async getDentistSchedules(req, res) {
    try {
      res.render("booking", { schedules: [] });
    } catch (error) {
      console.error("Error fetching dentist schedules:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  //Hàm get các slot khám theo ngày
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
  //Hàm tạo booking
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
export default new BookingController();
