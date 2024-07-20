import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalImage from 'react-modal-image';
import './bookingResult.scss';
import BASE_URL from '../../ServiceSystem/axios';

const BookingResult = () => {
    const [treatments, setTreatments] = useState([]);
    const [customerID, setCustomerID] = useState('');
    const [bookingID, setBookingID] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const account = JSON.parse(localStorage.getItem('account') || '{}');
        const parsedCustomerID = account.customerId;
        const parsedBookingID = localStorage.getItem('bookingID');
        setCustomerID(parsedCustomerID);
        setBookingID(parsedBookingID);
    }, []);

    useEffect(() => {
        const fetchTreatments = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${BASE_URL}/treatment`, {
                    params: {
                        customerId: customerID,
                        bookingId: bookingID
                    }
                });

                const allTreatments = Array.isArray(response.data.treatments) ? response.data.treatments : [];
                const filteredTreatments = allTreatments.filter(treatment =>
                    treatment.BookingDetailID && parseInt(customerID)
                );

                setTreatments(filteredTreatments);
            } catch (error) {
                console.error('Error fetching treatments:', error);
                setError('Error fetching treatments. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (customerID && bookingID) {
            fetchTreatments();
        }
    }, [customerID, bookingID]);

    if (loading) {
        return <p>Loading treatments...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="booking-result">
            <h2>Treatment Results</h2>
            <div className="treatment-table-container">
                <table className="treatment-table">
                    <thead>
                        <tr>
                            <th>Treatment ID</th>
                            <th>Booking Detail ID</th>
                            <th>Note</th>
                            <th>Treatment Date</th>
                            <th>Result Image</th>
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
                                    <ModalImage
                                        small={`${BASE_URL}${treatment.Result}`}
                                        large={`${BASE_URL}${treatment.Result}`}
                                        alt={`${treatment.TreatmentID}'s result`}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingResult;
