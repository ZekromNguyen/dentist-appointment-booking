import cron from "node-cron";
import moment from "moment";
import { sendReminderEmail } from "../config/email";
import bookingService from "./bookingService";
import dentistService from "./dentistService";

const sentBookingDetailIDs = new Set();

cron.schedule("1 * * * *", async () => {
  try {
    await dentistService.updateExpiredSlots();
  } catch (error) {
    console.error("Lỗi khi chạy tác vụ cập nhật khung giờ khám:", error);
  }
});
cron.schedule('*/30 * * * * *', async () => {
  try {
    await bookingService.cancelPendingBookings();
    console.log('Successfully updated pending bookings and slots');
  } catch (error) {
    console.error('Error updating pending bookings and slots:', error);
  }
});

cron.schedule("*/2 * * * *", async () => {
  try {
    // Lấy danh sách các đặt chỗ của hôm nay để gửi email
    const bookingDetailsToday =
      await bookingService.getAllBookingTodayToSendEmail();
    if (bookingDetailsToday) {
      // Duyệt qua danh sách các đặt chỗ và gửi email nhắc nhở nếu chưa được gửi
      for (const booking of bookingDetailsToday) {
        if (!sentBookingDetailIDs.has(booking.bookingDetailID)) {
          // Giả sử bạn có một hàm để gửi email
          sendReminderEmail(booking.Booking.Customer.Account.Email, {
            date: booking.MedicalDay,
            time: booking.DentistSchedule.AvailableSlot.Time,
          });

          // Thêm bookingDetailID vào mảng đã gửi
          sentBookingDetailIDs.add(booking.bookingDetailID);
        }
      }
      console.log(
        "Đã thực hiện kiểm tra và gửi email nhắc nhở cho các đặt chỗ hôm nay."
      );
    }
    else{
      console.log(
        "Danh sách booking ko có để gửi email."
      );
    }
  } catch (error) {
    console.error(
      "Lỗi khi chạy tác vụ kiểm tra và gửi email nhắc nhở cho các đặt chỗ hôm nay:",
      error
    );
  }
});

cron.schedule("0 0 * * *", async () => {
  const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");

  // Lấy danh sách các booking có ngày hẹn là ngày mai
  const bookingsTomorrow = await bookingService.getAllBookingToSendEmail(
    tomorrow
  );

  try {
    // Gửi email nhắc nhở cho các booking ngày mai
    bookingsTomorrow.forEach((booking) => {
      sendReminderEmail(booking.Booking.Customer.Account.Email, {
        date: booking.MedicalDay,
        time: booking.DentistSchedule.AvailableSlot.Time,
      });
    });
  } catch (error) {
    console.error("Lỗi khi gửi email nhắc nhở:", error);
  }
});
