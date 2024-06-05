import BookingService from "../service/bookingService";

class BookingController {
  async getAvailableSlot(req, res) {
    try {
      const slots = await BookingService.getAvailableSlot();
      console.log("Slots to be rendered:", slots); // Debugging: Log the slots being passed to the template
      res.render("slot", { bookings: slots });
    } catch (err) {
      console.error("Error fetching available slots:", err);
      res.status(500).send("Internal server error");
    }
  }
}
module.exports = new BookingController();
