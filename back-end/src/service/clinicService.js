
import {
    Clinic, ClinicOwner, Location
} from "../model/model";

class ClinicService {
    async createClinic(ClinicOwnerID, ClinicName, Address, OpenTime, CloseTime, LocationID, Description, ImagePath) {
        try {
            // Tạo clinic mới
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

            // Lấy thông tin LocationName từ bảng Location
            const location = await Location.findOne({
                where: { LocationID: LocationID },
                attributes: ['LocationName']
            });

            // Trả về thông tin của clinic cùng với LocationName
            return {
                ...newClinic.toJSON(),
                LocationName: location ? location.LocationName : null
            };
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




    async getAllLocation(LocationID) {
        try {
            let clinics = "";
            if (LocationID === "ALL") {
                clinics = await Location.findAll({
                    raw: true,
                    attributes: [
                        "LocationID",
                        "LocationName",
                    ],
                });
            } else if (LocationID) {
                clinics = await Location.findOne({
                    where: { LocationID: LocationID },
                    raw: true,
                    attributes: [
                        "LocationID",
                        "LocationName",
                    ],
                });
            }
            if (!clinics) {
                console.log(`Clinic with ID ${LocationID} not found`);
            }
            return clinics;
        } catch (e) {
            console.error("Error in getAllClinicAdmin:", e);
            throw e;
        }
    }


}
export default new ClinicService();