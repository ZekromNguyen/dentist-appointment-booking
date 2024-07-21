import React from 'react';
import './body_infor.scss';
import { useNavigate } from 'react-router-dom';
import Info from "../Body_Youtube/Body_Youtube"
export default function Body_Infor() {
    let nav = useNavigate();

    return (
        <div className="information">
            <div className="infor-title">Dành cho bạn</div>
            <div className="infor-detail">
                <div className="detail_baiviet" onClick={() => nav("/Info")}>
                    <img className='img_baiviet' src='/img_baiviet.png' alt='Bài viết'></img>
                    <div className='text_baiviet'>Bài viết</div>
                </div>
                <div className="detail_coso">
                    <img className='img_coso' src='/img_coso.png' alt='Cơ sở'></img>
                    <div className='text_coso'>Cơ sở</div>
                </div>
            </div>
        </div>
    )
}
