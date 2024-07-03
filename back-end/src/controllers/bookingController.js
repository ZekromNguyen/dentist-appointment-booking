import BookingService from "../service/bookingService";
import DentistService from "../service/dentistService";
class BookingController {
  //Hàm lấy lịch dentist đã tạo cho customer book
  async getDentistSchedules(req, res) {
    try {
      const dentists = await DentistService.getAllDentist1();
      res.render("booking", { dentists, schedules: [] });
    } catch (error) {
      console.error("Error fetching dentist schedules:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  //Hàm get các slot khám theo ngày
  async getSlotsByDateByDentistService(req, res) {
    try {
      const { dentistID, date } = req.query;
      console.log(dentistID);
      console.log(date);
      const slots = await BookingService.getSlotsByDateByDentistService(
        date,
        dentistID
      );
      console.log(slots);
      res.json(slots);
    } catch (error) {
      console.error("Error fetching1 slots by date:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  //Ham get all booking by customerId
  async getAllBookingByCustomerId(req, res) {
    try {
      const { customerId } = req.query;
      console.log(customerId);
      const bookings = await BookingService.getAllBookingByCustomerId(
        customerId
      );
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "Success, not found" });
      }
      res.status(200).json({ message: "Success", bookings });
    } catch (error) {
      console.error("Error fetching all booking by customerId:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  //Hàm tạo booking
  async createBooking(req, res) {
    try {
      const bookings = req.body.bookings;
      if (!Array.isArray(bookings)) {
        return res.status(400).json({ message: "Invalid data format" });
      }

      const results = [];
      for (const booking of bookings) {
        const { customerId, price, status, typeBook, date, scheduleId } =
          booking;
        const currentDateTime = new Date(); // Lấy thời gian hiện tại
        const currentDateTimeGMT7 = new Date(
          currentDateTime.getTime() + 7 * 60 * 60 * 1000
        );
        console.log(booking);

        const newBooking = await BookingService.createBooking(
          customerId,
          status,
          price
        );
        if (!newBooking) {
          return res.status(400).json({ message: "Failed to create Booking" });
        }

        const newBookingDetail = await BookingService.createBookingDetail(
          currentDateTimeGMT7,
          typeBook,
          status,
          price,
          date,
          newBooking.BookingID,
          scheduleId
        );
        if (!newBookingDetail) {
          return res
            .status(400)
            .json({ message: "Failed to create BookingDetail" });
        }

        results.push({
          booking: newBooking,
          bookingDetail: newBookingDetail,
        });
      }

      res.status(200).json({
        message: "All bookings created successfully",
        results: results,
      });
    } catch (error) {
      console.error("Error creating bookings in controller:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  // async createBooking(req, res) {
  //   try {
  //     const { customerId, price, status, typeBook, date, scheduleId } =
  //       req.body;
  //     const currentDateTime = new Date(); // Lấy thời gian hiện tại
  //     const currentDateTimeGMT7 = new Date(
  //       currentDateTime.getTime() + 7 * 60 * 60 * 1000
  //     );
  //     console.log(req.body);

  //     const newBooking = await BookingService.createBooking(
  //       customerId,
  //       status,
  //       price
  //     );
  //     if (!newBooking) {
  //       res.status(400).json({ message: "No create Booking" });
  //     }
  //     const newBookingDetail = await BookingService.createBookingDetail(
  //       currentDateTimeGMT7,
  //       typeBook,
  //       status,
  //       price,
  //       date,
  //       newBooking.BookingID,
  //       scheduleId
  //     );
  //     if (!newBookingDetail) {
  //       res.status(400).json({ message: "No create BookingDetail" });
  //     }
  //     res.status(200).json({ message: "Create booking successfully" });
  //   } catch (error) {
  //     console.error("Error creating booking in controller:", error);
  //     res.status(500).send("Internal Server Error");
  //   }
  // }
  //Hàm get dentistName với Slot time của bookingDetail
  async getDentistNameByBookingDetail(req, res) {
    const { BookingDetailID } = req.query;
    console.log(BookingDetailID);
    if (!BookingDetailID) {
      res.status(400).json({ message: "BookingDetailID is required" });
    }
    try {
      const newBookingDetailByBookingDetailID =
        await BookingService.getDentistNameByBookingDetail(BookingDetailID);
      if (
        !newBookingDetailByBookingDetailID ||
        newBookingDetailByBookingDetailID.length === 0
      ) {
        return res.status(404).json({ message: "No dentist found" });
      }
      res
        .status(200)
        .json({ message: "Success", newBookingDetailByBookingDetailID });
    } catch (error) {
      console.error("Error fetching getDentistNameByBookingDetail", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllBooking(req, res) {
    try {
      const bookings = await BookingService.getAllBooking();
      if (!bookings || bookings.length === 0) {
        res.status(404).json({ message: "Success, Not found" });
      }
      res.status(200).json({ message: "Success", bookings });
    } catch (error) {
      console.error("Error get all booking in controller:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async showAllBooking(req, res) {
    try {
      // Gọi service để lấy thông tin đặt chỗ
      const bookings = await BookingService.getAllBookingInfo();

      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "Bookings not found" });
      }

      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async showAllBookingDetails(req, res) {
    try {
      const { bookingId } = req.params;
      
      // Gọi service để lấy thông tin chi tiết đặt chỗ
      const bookingDetails = await BookingService.getAllBookingDetails(bookingId);

      if (!bookingDetails || bookingDetails.length === 0) {
        return res.status(404).json({ message: "Booking details not found" });
      }

      res.status(200).json(bookingDetails);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async showPaymentPage(req, res) {
    try {
      const { bookingId } = req.params;
      const booking = await BookingService.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).send("Booking not found");
      }
      res.render("payment", { booking });
    } catch (error) {
      console.error("Error displaying payment page:", error);
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
      const payment = await BookingService.createPayment(
        bookingId,
        paymentMethod,
        true
      );
      const updatedBooking = await BookingService.updateBookingStatus(
        bookingId,
        "Completed"
      );

      res
        .status(200)
        .json({ message: "Payment processed successfully", payment });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}
export default new BookingController();
