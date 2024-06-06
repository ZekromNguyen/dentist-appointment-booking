import Clinic from "../model/clinic";

class ClinicService {
  async loadClinic() {
    try {
      const clinics = await Clinic.findAll();
      const plainClinics = clinics.map((clinic) => clinic.toJSON());
      return plainClinics;
    } catch (error) {
      console.error("Error fetching slots from database:", error);
      throw error;
    }
  }
}
module.exports = new ClinicService();
