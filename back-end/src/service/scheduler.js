import cron from "node-cron";
import moment from "moment";
import { sendReminderEmail } from "../config/email";
import bookingService from "./bookingService";

cron.schedule("0 0 * * *", async () => {
  const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
  const bookings = await bookingService.getAllBookingToSendEmail(tomorrow);
  try {
    bookings.forEach((booking) => {
      sendReminderEmail(booking.Booking.Customer.Account.Email, {
        date: booking.MedicalDay,
        time: booking.DentistSchedule.AvailableSlot.Time,
      });
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt chỗ:", error);
  }
});
