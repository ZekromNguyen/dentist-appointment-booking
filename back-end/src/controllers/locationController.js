import LocationService from "../service/LocationService";

class LocationController {
  async showLocation(req, res) {
    try {
      const locations = await LocationService.loadLocation();
      res.render("clinic", { locations: locations });
    } catch (err) {
      console.error("Error fetching available slots:", err);
      res.status(500).send("Internal server error");
    }
  }
}
module.exports = new LocationController();
