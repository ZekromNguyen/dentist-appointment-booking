import Location from "../model/Location";

class LocationService {
  async loadLocation() {
    try {
      const locations = await Location.findAll();
      const plainLocations = locations.map((location) => location.toJSON());
      return plainLocations;
    } catch (error) {
      console.error("Error fetching slots from database:", error);
      throw error;
    }
  }
}

module.exports = new LocationService();
