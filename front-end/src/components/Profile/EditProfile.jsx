import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../../ServiceSystem/axios';
import './editProfile.scss'; // Assuming you have defined styles in profile.scss

const EditProfile = () => {
    const { accountId } = useParams();
    const [profile, setProfile] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        customerName: '',
        dentistName: '',
        clinicOwnerName: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/profile/${accountId}`);
                setProfile(response.data);
                setFormData({
                    email: response.data.Email || '',
                    phone: response.data.Phone || '',
                    customerName: response.data.CustomerName || '',
                    dentistName: response.data.DentistName || '',
                    clinicOwnerName: response.data.ClinicOwnerName || ''
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [accountId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/profile/${accountId}`, formData); // Use PUT for updating profile
            navigate(`/profile/${accountId}`); // Redirect to profile page after update
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="profile">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly // Make the input readonly

                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <input
                        type="text"
                        name="role"
                        value={profile.Role || ''}
                        readOnly // Make the input readonly
                    />
                </div>
                {profile.CustomerName && (
                    <div>
                        <label>Customer Name:</label>
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                        />
                    </div>
                )}
                {profile.DentistName && (
                    <div>
                        <label>Dentist Name:</label>
                        <input
                            type="text"
                            name="dentistName"
                            value={formData.dentistName}
                            onChange={handleChange}
                        />
                    </div>
                )}
                {profile.ClinicOwnerName && (
                    <div>
                        <label>Clinic Owner Name:</label>
                        <input
                            type="text"
                            name="clinicOwnerName"
                            value={formData.clinicOwnerName}
                            onChange={handleChange}
                        />
                    </div>
                )}
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
