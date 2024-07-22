import React from 'react';
import './body_service.scss';
import { FaTooth } from "react-icons/fa";
import { CiMedicalCase } from "react-icons/ci";
import { FaHandHoldingMedical } from "react-icons/fa";
import { GiMedicalDrip } from "react-icons/gi";
import { LiaNotesMedicalSolid } from "react-icons/lia";
import { PiToothFill } from "react-icons/pi";
import { LiaToothSolid } from "react-icons/lia";
import { LiaTeethSolid } from "react-icons/lia";

export default function Body_Service() {
    return (
        <div className='body_service'>
            <div className='service-header'>Comprehensive Services</div>
            <div className='service-detail-1'>
                <div className='service-detail-left'>
                    <FaTooth className='icon' />
                    <div className='text'>Dental Examination</div>
                </div>
                <div className='service-detail-right'>
                    <CiMedicalCase className='icon' />
                    <div className='text'>Quick Check-up</div>
                </div>
            </div>

            <div className='service-detail-2'>
                <div className='service-detail-left'>
                    <FaHandHoldingMedical className='icon' />
                    <div className='text'>General Check-up</div>
                </div>
                <div className='service-detail-right'>
                    <GiMedicalDrip className='icon' />
                    <div className='text'>Lab Testing</div>
                </div>
            </div>

            <div className='service-detail-3'>
                <div className='service-detail-left'>
                    <LiaNotesMedicalSolid className='icon' />
                    <div className='text'>Periodic Check-up</div>
                </div>
                <div className='service-detail-right'>
                    <PiToothFill className='icon' />
                    <div className='text'>Specialized Check-up</div>
                </div>
            </div>

            <div className='service-detail-4'>
                <div className='service-detail-left'>
                    <LiaToothSolid className='icon' />
                    <div className='text'>Cavity Examination</div>
                </div>
                <div className='service-detail-right'>
                    <LiaTeethSolid className='icon' />
                    <div className='text'>Dental Treatment</div>
                </div>
            </div>
        </div>
    )
}
