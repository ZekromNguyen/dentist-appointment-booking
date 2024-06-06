import ClinicService from "../service/clinicService";
class ClinicController {
  async showDentist(req, res) {
    try {
      const clinics = await ClinicService.loadClinic();
      res.render("dentist", { clinics: clinics });
    } catch (err) {
      console.error("Error fetching available slots:", err);
      res.status(500).send("Internal server error");
    }
  }
}
module.exports = new ClinicController();
