import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../../ServiceSystem/axios';

const Profile = () => {
    const { accountId } = useParams();
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/profile/${accountId}`);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        if (accountId) {
            fetchProfile();
        }
    }, [accountId]);

    const handleEditProfile = () => {
        if (profile && profile.AccountID) {
            navigate(`/editprofile/${profile.AccountID}`);
        }
    };

    if (!profile) {
        return <div>Loading Profile...</div>;
    }
    console.log('Profile Role:', profile.Role);

    return (
        <div className="container">
            <h1>Profile of {profile.UserName || 'No name provided'}</h1>
            <div className="section">
                <h2>Account Details</h2>
                <p><strong>Email:</strong> {profile.Email || 'No email provided'}</p>
                <p><strong>Phone:</strong> {profile.Phone || 'No phone provided'}</p>
                {profile.Role && (
                    <p><strong>Role:</strong> {profile.Role}</p>
                )}
            </div>
            <p><strong>Customer Name:</strong> {profile.CustomerName || 'No Name provided'}</p>
            {/* {profile.CustomerName && (
                <div className="section">
                    <p><strong>Customer Name:</strong> {profile.CustomerName || 'No Name provided'}</p>
                </div>
            )} */}
            {profile.DentistName && (
                <div className="section">
                    <p><strong>Dentist Name:</strong> {profile.DentistName || 'No Name provided'}</p>
                </div>
            )}
            {profile.ClinicOwnerName && (
                <div className="section">
                    <p><strong>Clinic Owner Name:</strong> {profile.ClinicOwnerName || 'No Name provided'}</p>
                </div>
            )}
            <div>
                <button className="link-button" onClick={handleEditProfile}>Edit Profile</button>
                <button className="link-button" onClick={() => navigate('/')}>Back to home</button>
            </div>
        </div>
    );
};

export default Profile;
