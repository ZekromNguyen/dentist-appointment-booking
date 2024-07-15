import React, { useEffect, useState } from 'react';
import './clinicLoad.scss';
import BASE_URL from '../../ServiceSystem/axios';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const ClinicLoad = () => {
    const location = useLocation();
    const { state } = location;
    const [clinic, setClinic] = useState(null);

    useEffect(() => {
        if (state && state.clinic) {
            setClinic(state.clinic);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [state]);

    if (!clinic) {
        return <div>Loading...</div>;
    }

    console.log('clinic:', clinic);
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
                        <p><strong>Địa chỉ:</strong> {clinic.Address}</p>
                        <p><strong>Giờ mở cửa:</strong> {clinic.OpenTime} - {clinic.CloseTime}</p>
                        {clinic.location && clinic.location.LocationName && ( // Check if location and LocationName exist
                            <p><strong>Vị trí:</strong> {clinic.location.LocationName}</p>
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
