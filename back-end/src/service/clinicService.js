
import {
    Clinic, ClinicOwner, Location
} from "../model/model";

class ClinicService {
    async createClinic(ClinicOwnerID, ClinicName, Address, OpenTime, CloseTime, LocationID, Description, ImagePath) {
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

    ///////////////admin
    async getAllClinicAdmin(ClinicID) {
        try {
            let clinics = "";
            if (ClinicID === "ALL") {
                clinics = await Clinic.findAll({
                    raw: true,
                    attributes: [
                        "ClinicID",
                        "ClinicName",
                        "Address",
                        "OpenTime",
                        "CloseTime",
                        "LocationID",
                        "ClinicOwnerID",
                        "Description",
                        "ImagePath"
                    ],
                    include: [{
                        model: Location,
                        attributes: ["LocationName", "LocationID"],
                        as: "location"
                    }]
                });
            } else if (ClinicID) {
                clinics = await Clinic.findOne({
                    where: { ClinicID: ClinicID },
                    raw: true,
                    attributes: [
                        "ClinicID",
                        "ClinicName",
                        "Address",
                        "OpenTime",
                        "CloseTime",
                        "LocationID",
                        "ClinicOwnerID",
                        "Description",
                        "ImagePath"
                    ],
                    include: [{
                        model: Location,
                        attributes: ["LocationName", "LocationID"],
                        as: "location",
                    }]
                });
            }
            if (!clinics) {
                console.log(`Clinic with ID ${ClinicID} not found`);
            }
            return clinics;
        } catch (e) {
            console.error("Error in getAllClinicAdmin:", e);
            throw e;
        }
    }




    async getAllClinicOwner(ClinicOwnerID) {
        try {
            let clinics = "";
            if (ClinicOwnerID === "ALL") {
                clinics = await ClinicOwner.findAll({
                    raw: true,
                    attributes: [
                        "ClinicOwnerID",
                        "ClinicOwnerName",
                    ],
                });
            } else if (ClinicOwnerID) {
                clinics = await ClinicOwner.findOne({
                    where: { ClinicOwnerID: ClinicOwnerID },
                    raw: true,
                    attributes: [
                        "ClinicOwnerID",
                        "ClinicOwnerName",
                    ],
                });
            }
            if (!clinics) {
                console.log(`Clinic with ID ${ClinicOwnerID} not found`);
            }
            return clinics;
        } catch (e) {
            console.error("Error in getAllClinicAdmin:", e);
            throw e;
        }
    }
}
export default new ClinicService();