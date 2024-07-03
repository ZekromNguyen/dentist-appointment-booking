// import React from 'react'
// import "./doctor.scss"
// import Header from '../Header/Header'

// export default function DoctorLoad() {
//     return (
//         <div className='DoctorLoad'>
//             <div className='header'>
//                 <Header />
//             </div>
//             <div className='doctor'>
//                 <div className='doctor-img'></div>
//                 <div className='doctor-detail'>
//                     <div className='doctor-name'>asdasd</div>
//                     <div className='doctor-infor'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita amet explicabo, voluptas porro praesentium fugit error saepe eos debitis reiciendis nisi soluta eaque, id nihil nesciunt quis delectus alias a.</div>
//                 </div>
//             </div>
//         </div>
//     )
// }

import React, { useEffect, useState } from 'react';
import './doctor.scss';
import Header from '../Header/Header';
import { useLocation } from 'react-router-dom';
import Footer from '../Footer/Footer';

export default function DoctorLoad() {
    const location = useLocation();
    const { state } = location;

    const [dentist, setDentist] = useState(null);

    useEffect(() => {
        if (state && state.dentist) {
            setDentist(state.dentist);
        }
    }, [state]);

    if (!dentist) {
        return null; // or handle the case where dentist data is not defined
    }

    console.log(dentist); // Debug: Check dentist object structure

    return (
        <div className='DoctorLoad'>
            <div className='header'>
                <Header />
            </div>
            <div className='doctor'>
                <div
                    className='doctor-img'
                    style={{ backgroundImage: `url(http://localhost:3000/${dentist.ImagePath})` }}
                ></div>
                <div className='doctor-detail'>
                    <div className='doctor-name'>{dentist.DentistName}</div>
                    <div className='doctor-description'>{dentist.Description}</div>
                    <div className='clinic-address'>{dentist['clinic.Address']}</div>
                    <div className='clinic-clinicName'>{dentist['clinic.ClinicName']}</div>
                </div>
            </div>
            <div className='clinic-time-schedule'>Lịch Khám</div>
            <div className='clinic-time'>
                {dentist['clinic.OpenTime']} - {dentist['clinic.CloseTime']}
            </div>
            <div className='footer'>
                <Footer />
            </div>
        </div>
    );
}



