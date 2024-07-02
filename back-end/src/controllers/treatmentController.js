import Treatment from '../model/treatment';
import multer from 'multer';
import path from 'path';

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

class TreatmentController {
    async createTreatment(req, res) {
        const { BookingDetailID, Note } = req.body;
        const Result = req.file ? `/uploads/images/${req.file.filename}` : null;
        const TreatmentDate = new Date(); // Or any appropriate date

        try {
            const newTreatment = await Treatment.create({ BookingDetailID, Note, Result, TreatmentDate });
            res.status(201).json({ message: 'Treatment created successfully', newTreatment });
        } catch (error) {
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
            // Assuming Result is the URL or path to the image
            res.status(200).sendFile(path.resolve(treatment.Result));
        } catch (error) {
            console.error('Error fetching treatment image:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getTreatmentById(req, res) {
        const { id } = req.params;
        try {
            const treatment = await Treatment.findByPk(id);
            if (!treatment) {
                return res.status(404).json({ message: 'Treatment not found' });
            }
            res.render('treatments/detail', { treatment });
        } catch (error) {
            console.error('Error fetching treatment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateTreatment(req, res) {
        const { id } = req.params;
        const { BookingDetailID, Note } = req.body;
        const Result = req.file ? req.file.path : null;

        try {
            const treatment = await Treatment.findByPk(id);
            if (!treatment) {
                return res.status(404).json({ message: 'Treatment not found' });
            }

            treatment.BookingDetailID = BookingDetailID;
            treatment.Note = Note;
            if (Result) {
                treatment.Result = Result;
            }

            await treatment.save();
            res.redirect(`/treatments/${id}`);
        } catch (error) {
            console.error('Error updating treatment:', error);
            res.status(500).json({ message: 'Internal server error' });
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
            res.redirect('/treatments');
        } catch (error) {
            console.error('Error deleting treatment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllTreatments(req, res) {
        try {
            const treatments = await Treatment.findAll(); // Lấy tất cả các bản ghi từ bảng Treatment
            res.status(200).json({ treatments }); // Trả về dữ liệu dưới dạng JSON
        } catch (error) {
            console.error('Error fetching treatments:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new TreatmentController();
export { upload };
