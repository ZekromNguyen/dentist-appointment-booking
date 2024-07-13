import clinicService from "../service/clinicService";
import upload from "../config/multer";

class ClinicController {
    createNewClinic = async (req, res) => {
        console.log('Request received');

        // Handle file upload asynchronously
        upload(req, res, async (err) => {
            if (err) {
                console.error("Error uploading image:", err);
                return res.status(500).json({ message: "Failed to upload image" });
            }

            // File upload successful, now handle form data
            console.log('Request body:', req.body);
            console.log('Request file:', req.file);

            const { ClinicName, Address, OpenTime, CloseTime, LocationID, Description, ClinicOwnerID } = req.body;

            if (!ClinicName || !Address || !OpenTime || !CloseTime || !LocationID || !ClinicOwnerID) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const imagePath = req.file ? `uploads/${req.file.filename}` : null;

            try {
                const newClinic = await clinicService.createClinic(ClinicOwnerID, ClinicName, Address, OpenTime, CloseTime, LocationID, Description, imagePath);
                if (newClinic) {
                    return res.status(200).json({ message: "Create clinic success", clinic: newClinic });
                }
            } catch (error) {
                return res.status(500).send("Error adding clinic: " + error.message);
            }
        });
    }

    async updateClinic(req, res) {
        const { id } = req.params;
        const {
            ClinicName,
            Address,
            OpenTime,
            CloseTime,
            LocationID,
            Description,
        } = req.body;
        console.log(id);
        console.log(req.body);
        try {
            const updateClinic = await clinicService.updateClinic(id, ClinicName, Address, OpenTime, CloseTime, LocationID, Description);
            if (!updateClinic) {
                return res.status(404).json({ message: 'Clinic not found' });
            }
            res.status(200).json(updateClinic);
        } catch (error) {
            res.status(500).json({ message: 'Error updating clinic' });
        }
    }

}
export default new ClinicController();