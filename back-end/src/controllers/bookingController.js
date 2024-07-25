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
      const { dentistID, date, isNotCustomer } = req.query;
      console.log(dentistID);
      console.log(date);
      console.log(isNotCustomer);
      const slots = await BookingService.getSlotsByDateByDentistService(
        date,
        dentistID,
        isNotCustomer
      );
      console.log(slots);
      if (!slots) {
        return res.status(404).json({ message: "Success, Not found" });
      }
      res.status(200).json({ message: "Success", slots });
    } catch (error) {
      console.error("Error fetching1 slots by date:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  //Ham get all booking by customerId
  async getAllBookingByCustomerId(req, res) {
    try {
      const { customerId } = req.query;
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
      const booking = req.body.booking;
      if (!Array.isArray(bookings) || !booking) {
        return res.status(400).json({ message: "Invalid data format" });
      }
      const { customerId, status, totalPrice } = booking;
      const newBooking = await BookingService.createBooking(
        customerId,
        status,
        totalPrice
      );
      console.log(booking);
      if (!newBooking) {
        return res.status(400).json({ message: "Failed to create Booking" });
      }
      const results = [];
      for (const booking of bookings) {
        const {
          priceBooking,
          status,
          typeBook,
          date,
          scheduleId,
          recurringType,
          recurringEndDate,
        } = booking;
        const currentDateTime = new Date(); // Lấy thời gian hiện tại
        const currentDateTimeGMT7 = new Date(
          currentDateTime.getTime() + 7 * 60 * 60 * 1000
        );

        const newBookingDetail = await BookingService.createBookingDetail(
          currentDateTimeGMT7,
          typeBook,
          status,
          priceBooking,
          date,
          newBooking.BookingID,
          scheduleId,
          recurringType,
          recurringEndDate
        );
        if (!newBookingDetail) {
          return res
            .status(400)
            .json({ message: "Failed to create BookingDetail" });
        }

        results.push({
          bookingDetail: newBookingDetail,
        });
      }

      res.status(200).json({
        message: "All bookings created successfully",
        results: results,
        booking: newBooking,
      });
    } catch (error) {
      console.error("Error creating bookings in controller:", error);
      res.status(500).send("Internal Server Error");
    }
  }

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
    const { OwnerId } = req.query;
    if (!OwnerId) {
      return res.status(400).json({ message: "Parameter required" });
    }
    try {
      const bookings = await BookingService.getAllBooking(OwnerId);
      if (!bookings || bookings.length === 0) {
        res.status(404).json({ message: "Success, Not found" });
      }
      res.status(200).json({ message: "Success", bookings });
    } catch (error) {
      console.error("Error get all booking in controller:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getAllBookingByDentist(req, res) {
    const { DentistId } = req.query;
    if (!DentistId) {
      return res.status(400).json({ message: "Parameter required" });
    }
    try {
      const bookings = await BookingService.getAllBookingByDentist(DentistId);
      if (!bookings || bookings.length === 0) {
        res.status(404).json({ message: "Success, Not found" });
      }
      res.status(200).json({ message: "Success", bookings });
    } catch (error) {
      console.error("Error get all booking by dentistId in controller:", error);
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
      const bookingDetails = await BookingService.getAllBookingDetails(
        bookingId
      );

      if (!bookingDetails || bookingDetails.length === 0) {
        return res.status(404).json({ message: "Booking details not found" });
      }

      res.status(200).json(bookingDetails);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async updateBookingStatusFromOwner(req, res) {
    try {
      const updateStatus = req.body;
      console.log(updateStatus);
      const { DetailID, Status } = updateStatus;
      const updateBooking = await BookingService.updateBookingStatusFromOwner(
        DetailID,
        Status
      );
      if (!updateBooking) {
        res.status(400).json({ message: "Failed" });
      }
      res.status(200).json({ message: "Success", updateBooking });
    } catch (error) {
      console.error("Error update Booking status:", error);
      res.status(500).json({ error: "Error update Booking status from Owner" });
    }
  }
  async updateBookingStatus(req, res) {
    try {
      const updateStatus = req.body;
      console.log(updateStatus);
      const { BookingID, Status } = updateStatus;
      const updateBooking = await BookingService.updateBookingStatus(
        BookingID,
        Status
      );
      if (!updateBooking) {
        res.status(400).json({ message: "Failed" });
      }
      res.status(200).json({ message: "Success", updateBooking });
    } catch (error) {
      console.error("Error update Booking status:", error);
      res.status(500).json({ error: "Error update Booking status" });
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

  checkTreatmentExistence = async (req, res) => {
    const { bookingDetailId } = req.params;
    try {
      const exists = await BookingService.checkIfTreatmentExists(
        bookingDetailId
      );
      res.json({ exists });
    } catch (error) {
      console.error("Error checking treatment existence in controller:", error);
      res.status(500).json({ error: "Error checking treatment existence" });
    }
  };
}
export default new BookingController();
