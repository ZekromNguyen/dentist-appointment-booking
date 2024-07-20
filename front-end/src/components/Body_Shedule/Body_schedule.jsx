import React from 'react';
import './body_schedule.scss';
import imgbacsi from '../../assets/picture/picture_body_schedule/img_bacsi.png';
import { useNavigate } from 'react-router';


export default function Body_schedule() {
    const navigate = useNavigate();

    const handleBookingClick = () => {
        navigate('/booking');
    };


    return (
        <div className='body_schedule'>
            <div className='schedule_header'>
                <div className='header-title'><h1>ĐIỀU TRỊ Y TẾ CHUYÊN NGHIỆP</h1></div>
                <div className='header-detail'><h4>Đặt niềm tin vào chúng tôi là sự lựa chọn đúng đắn</h4></div>
            </div>
            <div className='schedule_content'>
                <div className='content-left'>
                    <div className='content-header'>Chúng tôi sẽ chăm sóc</div>
                    <div className='content-title'>SỨC KHOẺ</div>
                    <div className='content-slogan'>bằng cả tấm lòng nhân ái</div>
                    <div className='content-detail'>Đội ngũ y tế chất lượng cao đến từ các nước trên thế giới</div>
                    <button className='btn-booking' onClick={() => handleBookingClick()}>
                        Đặt lịch
                    </button>
                </div>
                <div className='content-right'>
                    <div className='right'>
                        <div className='img' >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
