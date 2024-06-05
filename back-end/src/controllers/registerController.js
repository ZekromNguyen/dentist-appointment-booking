import RegisterService from "../service/RegisterService";

class RegisterController {
  async registerClinic(req, res) {
    const { clinicName, address, startTime, endTime, locationID } = req.body;
    if (!clinicName || !address || !startTime || !endTime || !locationID) {
      return res.status(400).send("All fields are required");
    }
    console.log(req.body);
    try {
      const newClinic = await RegisterService.createClinic({
        clinicName,
        address,
        startTime,
        endTime,
        locationID,
      });
      console.log(newClinic);
      res.json(newClinic);
    } catch (err) {
      //console.error("Error fetching available slots:", err);
      res.status(500).send("Internal server error");
    }
  }
  async registerDentist(req, res) {
    const {} = req.body;
  }
}
module.exports = new RegisterController();
