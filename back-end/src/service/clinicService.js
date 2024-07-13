
import {
    Clinic
} from "../model/model";

class ClinicService {
    async createClinic(ClinicOwnerID, ClinicName, Address, OpenTime, CloseTime, LocationID, Description, ImagePath){
        try {
            const newClinic = await Clinic.create({
                ClinicName: ClinicName,
                Address: Address,
                OpenTime: OpenTime,
                CloseTime: CloseTime,
                LocationID: LocationID,
                ClinicOwnerID: ClinicOwnerID,
                Description: Description,
                ImagePath: ImagePath,
            });
            return newClinic;
        } catch (error) {
            console.error("Error creating clinic in service:", error);
        }
    }
    async updateClinic(ClinicID, ClinicName, Address, OpenTime, CloseTime, LocationID, Description) {
        try {
            const clinic = await Clinic.findByPk(ClinicID);
            if (!clinic) {
                return null;
            }
            await clinic.update({
                ClinicName,
                Address,
                OpenTime,
                CloseTime,
                LocationID,
                Description,
            });
            return clinic;
        } catch (error) {
            console.error("Error updating clinic in service:", error);
            throw error;
        }
    }

}
export default new ClinicService();