import { Booking, BookingDetail, Treatment } from "../model/model";
import sequelize from "../config/database";

class TreatmentService {
  async createTreatment(BookingDetailID, Note, TreatmentDate, imageResult) {
    try {
      const newTreatment = await Treatment.create({
        BookingDetailID: BookingDetailID,
        TreatmentDate: TreatmentDate,
        Note: Note,
        Result: imageResult,
      });
      if (newTreatment) {
        return newTreatment;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error creating treament:", error);
    }
  }

  async getTreatment(TreatmentID) {
    try {
      const treatment = await Treatment.findByPk(TreatmentID);
      if (treatment) {
        return treatment;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error get treament by Treament ID:", error);
    }
  }

  async updateTreatment(treatmentID, Note, imageResult, TreatmentDate) {
    const transaction = await sequelize.transaction();
    try {
      const treatment = await Treatment.findByPk(treatmentID);
      if (treatment) {
        if (Note !== undefined) {
          treatment.Note = Note;
        }
        if (imageResult !== undefined) {
          treatment.imageResult = imageResult;
        }
        if (TreatmentDate !== undefined) {
          treatment.TreatmentDate = TreatmentDate;
        }
        await treatment.save({ transaction });
        await transaction.commit();
        return treatment;
      } else {
        await transaction.rollback();
        console.error("Treatment not found with ID:", treatmentID);
        return null;
      }
    } catch (error) {
      await transaction.rollback();
      console.error("Error when updating Treatment:", error);
      throw error;
    }
  }

  async getTreatmentByBookingDetailID(bookingDetailId) {
    try {
      const treatments = await Treatment.findOne({
        where: {
          BookingDetailID: bookingDetailId,
        },
      });
      // const bookings = await Booking.findAll({
      //   where: {
      //     CustomerID: customerId,
      //   },
      //   include: {
      //     model: BookingDetail,
      //     include: {
      //       model: Treatment,
      //     },
      //   },
      // });

      // // Extract treatments from the bookings
      // const treatments = bookings.flatMap((booking) =>
      //   booking.BookingDetails.flatMap((detail) => detail.Treatments)
      // );

      return treatments;
    } catch (error) {
      console.error("Error fetching treatments by customer ID:", error);
      throw new Error("Error fetching treatments by customer ID");
    }
  }

  async getTreatmentsByBookingDetailID(bookingDetailID) {
    try {
      const treatment = await Treatment.findOne({
        where: {
          BookingDetailID: bookingDetailID,
        },
      });
      return treatment;
    } catch (error) {
      console.error("Error when get Treatment by Booking Detail ID:", error);
      throw new Error("Error when get treatment by Boooking Detail ID");
    }
  }
}
export default new TreatmentService();
