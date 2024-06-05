import Clinic from "../model/clinic";

class RegisterService {
  async createClinic({ clinicName, address, startTime, endTime, locationID }) {
    try {
      const newClinic = await Clinic.create({
        ClinicName: clinicName,
        Address: address,
        OpenTime: startTime,
        CloseTime: endTime,
        LocationID: locationID,
      });
      return newClinic;
    } catch (error) {
      console.error("Error inserting into the database:", error);
      throw error;
    }
  }
}

module.exports = new RegisterService();
