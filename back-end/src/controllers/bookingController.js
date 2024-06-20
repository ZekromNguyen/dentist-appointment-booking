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

  async getSlotsByDate(req, res) {
    try {
      const { date } = req.query;
      const slots = await BookingService.getSlotsByDateService(date);
      res.json(slots);
    } catch (error) {
      console.error("Error fetching slots by date:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  async createBooking(req, res) {
    try {
      const { customerId, price, status, typeBook, date, slotId } = req.body;
      const currentDateTime = new Date();
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

  // Hàm hiển thị trang thanh toán
  async showPaymentPage(req, res) {
    try {
      const { bookingId } = req.params;
      const booking = await BookingService.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).send("Booking not found");
      }
      res.render("payment", { booking });
    } catch (error) {
      console.error("Error showing payment page:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  async processPayment(req, res) {
    try {
      const { bookingId, paymentMethod } = req.body;
      const booking = await BookingService.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).send("Booking not found");
      }

      // Tạo bản ghi thanh toán và cập nhật trạng thái booking
      const payment = await BookingService.createPayment(bookingId, paymentMethod, true);
      const updatedBooking = await BookingService.updateBookingStatus(bookingId, "Completed");

      res.status(200).json({ message: "Payment processed successfully", payment });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default new BookingController();
