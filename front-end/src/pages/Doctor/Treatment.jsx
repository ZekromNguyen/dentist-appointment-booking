import './treatment.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TreatmentUpload = () => {
    const [bookingDetailId, setBookingDetailId] = useState('');
    const [note, setNote] = useState('');
    const [treatmentDate, setTreatmentDate] = useState('');
    const [resultImage, setResultImage] = useState(null);
    const [treatments, setTreatments] = useState([]);
    const [editingTreatmentId, setEditingTreatmentId] = useState(null);

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const response = await axios.get('http://localhost:3000/treatment');
                console.log('Response Data:', response.data); // Debug: log response data
                setTreatments(Array.isArray(response.data.treatments) ? response.data.treatments : []);
            } catch (error) {
                console.error('Error fetching treatments:', error);
            }
        };

        fetchTreatments();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('BookingDetailID', bookingDetailId);
        formData.append('Note', note);
        formData.append('TreatmentDate', treatmentDate);
        formData.append('Result', resultImage);

        try {
            if (editingTreatmentId) {
                await axios.patch(`http://localhost:3000/treatments/${editingTreatmentId}`, formData); // Chỉnh lại endpoint PATCH thành '/treatments/:id'
                alert('Treatment updated successfully');
            } else {
                await axios.post('http://localhost:3000/treatment', formData);
                alert('Treatment uploaded successfully');
            }

            // Fetch the updated list of treatments
            const response = await axios.get('http://localhost:3000/treatment');
            setTreatments(Array.isArray(response.data.treatments) ? response.data.treatments : []);
            // Clear the form
            setBookingDetailId('');
            setNote('');
            setTreatmentDate('');
            setResultImage(null);
            setEditingTreatmentId(null);
        } catch (error) {
            console.error('Error uploading treatment:', error);
        }
    };

    const handleDelete = async (treatmentId) => {
        try {
            await axios.delete(`http://localhost:3000/treatments/${treatmentId}`);
            alert('Treatment deleted successfully');

            // Fetch the updated list of treatments
            const response = await axios.get('http://localhost:3000/treatment');
            setTreatments(Array.isArray(response.data.treatments) ? response.data.treatments : []);
        } catch (error) {
            console.error('Error deleting treatment:', error);
        }
    };

    const handleEdit = (treatment) => {
        setEditingTreatmentId(treatment.TreatmentID);
        setBookingDetailId(treatment.BookingDetailID);
        setNote(treatment.Note);
        setTreatmentDate(new Date(treatment.TreatmentDate).toISOString().split('T')[0]);
        // Scroll to top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className='body-treatment'>
            <div className="treatment-upload-container">
                <h1>{editingTreatmentId ? 'Update Treatment Result Image' : 'Upload Treatment Result Image'}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="treatment-form-group">
                        <label htmlFor="bookingDetailId">Booking Detail ID:</label>
                        <input
                            type="text"
                            id="bookingDetailId"
                            name="bookingDetailId"
                            value={bookingDetailId}
                            onChange={(e) => setBookingDetailId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="treatment-form-group">
                        <label htmlFor="note">Note:</label>
                        <input
                            type="text"
                            id="note"
                            name="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                    <div className="treatment-form-group">
                        <label htmlFor="treatmentDate">Treatment Date:</label>
                        <input
                            type="date"
                            id="treatmentDate"
                            name="treatmentDate"
                            value={treatmentDate}
                            onChange={(e) => setTreatmentDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="treatment-form-group">
                        <label htmlFor="resultImage">Result Image:</label>
                        <input
                            type="file"
                            id="resultImage"
                            name="resultImage"
                            onChange={(e) => setResultImage(e.target.files[0])}
                            required={!editingTreatmentId}
                        />
                    </div>
                    <button type="submit">{editingTreatmentId ? 'Update' : 'Upload'}</button>
                </form>

                <div className="treatment-message">
                    <p>Please fill in all required fields and upload a valid image for the result.</p>
                </div>

                <h2>List of Treatments</h2>
                <div className='body-treatment'>
                    <div className="treatment-table mt-30 mx-10">
                        <table id="treatments">
                            <thead>
                                <tr>
                                    <th>Treatment ID</th>
                                    <th>Booking Detail ID</th>
                                    <th>Note</th>
                                    <th>Treatment Date</th>
                                    <th>Result Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {treatments.map((treatment) => (
                                    <tr key={treatment.TreatmentID}>
                                        <td>{treatment.TreatmentID}</td>
                                        <td>{treatment.BookingDetailID}</td>
                                        <td>{treatment.Note}</td>
                                        <td>{new Date(treatment.TreatmentDate).toLocaleDateString()}</td>

                                        <td>
                                            <img
                                                src={`http://localhost:3000/${treatment.Result}`} // Đảm bảo rằng đường dẫn URL là đúng
                                                alt={`${treatment.TreatmentID}'s profile`}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(treatment.TreatmentID)}>Delete</button>
                                            <button onClick={() => handleEdit(treatment)}>Update</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreatmentUpload;
