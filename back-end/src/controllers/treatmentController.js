import express from 'express';
import Treatment from '../model/treatment';
import booking from '../model/booking';
import BookingDetail from '../model/bookingDetail';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Booking from '../model/booking';
import Customer from '../model/customer';

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images'); // Destination directory for uploaded images
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get file extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate unique filename
        cb(null, uniqueSuffix + ext); // Set filename format
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

const deleteFile = (filePath) => {
    try {
        fs.unlinkSync(filePath); // Synchronously delete the file
        console.log(`Deleted file: ${filePath}`);
    } catch (error) {
        console.error(`Error deleting file: ${filePath}`, error);
    }
};

class TreatmentController {
    async createTreatment(req, res) {
        const { BookingDetailID, Note, TreatmentDate } = req.body;
        const Result = req.file ? `/uploads/images/${req.file.filename}` : null;

        try {
            const newTreatment = await Treatment.create({ BookingDetailID, Note, TreatmentDate, Result });
            res.status(201).json({ message: 'Treatment created successfully', newTreatment });
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                console.error('Foreign key constraint error:', error);
                return res.status(400).json({ message: 'Invalid BookingDetailID provided' });
            }
            console.error('Error creating treatment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getTreatmentImage(req, res) {
        const { TreatmentID } = req.params;

        try {
            const treatment = await Treatment.findByPk(TreatmentID);
            if (!treatment || !treatment.Result) {
                return res.status(404).json({ message: 'Treatment or image not found' });
            }
            res.status(200).sendFile(path.resolve(treatment.Result));
        } catch (error) {
            console.error('Error fetching treatment image:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getTreatmentByID(req, res) {
        try {
            const treatmentID = req.params.id;
            const treatment = await Treatment.findByPk(treatmentID);
            const treatments = await Treatment.findAll();
            if (!treatment) {
                return res.status(404).send('Treatment not found');
            }
            res.render('treatment', { treatment: treatment, treatments: treatments });
        } catch (error) {
            console.error('Error fetching treatment:', error);
            res.status(500).send('Server Error');
        }
    }

    // async updateTreatment(req, res) {
    //     const treatmentId = req.params.id; // Extract treatment ID from URL params
    //     const { BookingDetailID, TreatmentDate, Note } = req.body; // Extract updated treatment data
    //     let Result = null;

    //     // Check if a new image file is uploaded
    //     if (req.file) {
    //         Result = `/uploads/images/${req.file.filename}`; // Set new image URL
    //     }

    //     try {
    //         // Find the treatment record by ID
    //         const treatment = await Treatment.findByPk(treatmentId);

    //         if (!treatment) {
    //             return res.status(404).json({ message: 'Treatment not found' });
    //         }

    //         // Update treatment fields
    //         treatment.BookingDetailID = BookingDetailID;
    //         treatment.TreatmentDate = TreatmentDate;
    //         treatment.Note = Note;

    //         // Update Result field only if a new image is uploaded
    //         if (Result) {
    //             const currentResultFilePath = treatment.Result; // Get current image file path

    //             // Delete current image file
    //             if (currentResultFilePath) {
    //                 deleteFile(path.resolve(currentResultFilePath));
    //                 console.log(`Deleted old file: ${currentResultFilePath}`);
    //             }

    //             treatment.Result = Result; // Set new image URL to treatment record
    //         }

    //         // Save updated treatment record to database
    //         await treatment.save();

    //         // Return success response
    //         return res.status(200).json({ message: 'Treatment updated successfully', treatment });
    //     } catch (error) {
    //         console.error('Error updating treatment:', error);
    //         return res.status(500).json({ message: 'Internal server error' });
    //     }
    // }

    async updateTreatment(req, res) {
        const treatmentId = req.params.id; // Extract treatment ID from URL params
        const { TreatmentDate, Note } = req.body; // Extract updated treatment data
        let Result = null;
        console.log('Treatment ID:', treatmentId);
        console.log('Request body:', req.body);

        // Check if a new image file is uploaded
        if (req.file) {
            Result = `/uploads/images/${req.file.filename}`; // Set new image URL
        }

        try {
            // Find the treatment record by ID
            const treatment = await Treatment.findByPk(treatmentId);

            if (!treatment) {
                return res.status(404).json({ message: 'Treatment not found' });
            }

            // Update treatment fields
            treatment.TreatmentDate = TreatmentDate;
            treatment.Note = Note;

            // Update Result field only if a new image is uploaded
            if (Result) {
                const currentResultFilePath = treatment.Result; // Get current image file path

                // Delete current image file
                if (currentResultFilePath) {
                    deleteFile(path.resolve(currentResultFilePath));
                    console.log(`Deleted old file: ${currentResultFilePath}`);
                }

                treatment.Result = Result; // Set new image URL to treatment record
            }

            // Save updated treatment record to database
            await treatment.save();

            // Return success response
            return res.status(200).json({ message: 'Treatment updated successfully', treatment });
        } catch (error) {
            console.error('Error updating treatment:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteTreatment(req, res) {
        const { id } = req.params;

        try {
            const treatment = await Treatment.findByPk(id);
            if (!treatment) {
                return res.status(404).json({ message: 'Treatment not found' });
            }

            await treatment.destroy();
            return res.status(200).json({ message: 'Treatment deleted successfully' });
        } catch (error) {
            console.error('Error deleting treatment:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllTreatments(req, res) {
        try {
            const { customerId, bookingId } = req.query;

            // Truy vấn liên bảng để lấy các kết quả điều trị dựa trên customerID và bookingID
            const treatments = await Treatment.findAll({
                include: {
                    model: BookingDetail,
                    include: {
                        model: booking,
                        where: {
                            CustomerID: customerId,
                            BookingID: bookingId
                        }
                    }
                }
            });

            res.json({ treatments });
        } catch (error) {
            console.error('Error fetching treatments:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    // New method to get treatments by BookingDetailID
    async getTreatmentsByBookingDetailID(req, res) {
        const { bookingDetailID } = req.params;

        try {
            const treatments = await Treatment.findAll({
                where: { BookingDetailID: bookingDetailID }
            });
            if (!treatments.length) {
                return res.status(404).json({ message: 'No treatments found for this BookingDetailID' });
            }
            res.status(200).json({ treatments });
        } catch (error) {
            console.error('Error fetching treatments:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    getAllCustomerTreatments = async (req, res) => {
        try {
            // Ensure req.user is defined and has CustomerId
            if (!req.user || !req.user.CustomerId) {
                return res.status(400).json({ error: 'User information not found or invalid' });
            }

            // Now you can safely use req.user.CustomerId
            const customerId = req.user.CustomerId;

            // Fetch treatments for the customer
            const treatments = await Treatment.findAll({
                where: { CustomerID: customerId }, // Ensure correct casing of CustomerID
                include: [
                    { model: Booking, include: [{ model: Dentist }] },
                ],
            });

            // Return the treatments
            res.status(200).json(treatments);
        } catch (error) {
            console.error('Error fetching treatments:', error);
            res.status(500).json({ error: 'Failed to fetch treatments' });
        }
    };






    async getCustomerTreatments(customerId) {
        try {
            const bookings = await Booking.findAll({
                where: { CustomerID: customerId },
                include: [
                    {
                        model: BookingDetail,
                        include: {
                            model: Treatment
                        }
                    }
                ]
            });

            let treatments = [];
            bookings.forEach(booking => {
                booking.BookingDetails.forEach(bookingDetail => {
                    treatments = treatments.concat(bookingDetail.Treatments);
                });
            });

            return treatments;
        } catch (error) {
            console.error('Error fetching customer treatments:', error);
            throw error;
        }
    }

}

export default new TreatmentController();
export { upload, deleteFile };