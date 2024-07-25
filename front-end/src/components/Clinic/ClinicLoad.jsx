import React, { useEffect, useState } from 'react';
import './clinicLoad.scss';
import BASE_URL from '../../ServiceSystem/axios';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import axios from 'axios'; // Đảm bảo đã import axios
import { toast } from 'react-toastify'; // Đảm bảo đã import toast nếu cần thông báo lỗi

const ClinicLoad = () => {
    const location = useLocation();
    const { state } = location;
    const [clinic, setClinic] = useState(null);
    const [locations, setLocations] = useState([]); // Thêm trạng thái locations
    const [error, setError] = useState(null);

    useEffect(() => {
        if (state && state.clinic) {
            setClinic(state.clinic);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [state]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/handleGetAllLocation`, {
                    params: { LocationID: 'ALL' },
                });

                if (response.data && response.data.errCode === 0) {
                    setLocations(response.data.account); // Cập nhật trạng thái locations
                } else {
                    console.error('Error fetching locations:', response.data);
                    setError('Error fetching locations.');
                }
            } catch (error) {
                toast.error('Error fetching locations.');
                console.error('Error fetching locations:', error);
                setError('Error fetching locations.');
            }
        };

        fetchLocations();
    }, []);

    if (!clinic) {
        return <div>Loading...</div>;
    }

    // Tìm locationName từ danh sách locations
    const clinicLocation = locations.find(loc => loc.LocationID === clinic.LocationID);

    return (
        <div className='clinic'>
            <Header />
            <div className="clinic-load">
                <div className="clinic-info">
                    <h2>{clinic.ClinicName}</h2>
                </div>
                <div className='clinic-detail'>
                    <div className='Clinic-img' style={{ backgroundImage: `url(${BASE_URL}/${clinic.ImagePath})` }}></div>
                    <div>
                        <p><strong>Address:</strong> {clinic.Address}</p>
                        <p><strong>Operating-Time:</strong> {clinic.OpenTime} - {clinic.CloseTime}</p>
                        {clinicLocation && (
                            <p><strong>Vị trí:</strong> {clinicLocation.LocationName}</p>
                        )}
                    </div>
                </div>
                <div className="clinic-description">
                    <p>{clinic.Description}</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ClinicLoad;
