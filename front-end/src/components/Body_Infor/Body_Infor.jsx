import React from 'react';
import './body_infor.scss';
import { useNavigate } from 'react-router-dom';
import Info from "../Body_Youtube/Body_Youtube";
import Clinic from "../Body_Slider/Body_Slider";

export default function Body_Infor() {
    let nav = useNavigate();

    return (
        <div className="information">
            <div className="infor-title">For You</div>
            <div className="infor-detail">
                <div className="detail_baiviet" onClick={() => nav("/Info")}>
                    <img className='img_baiviet' src='/img_baiviet.png' alt='Article'></img>
                    <div className='text_baiviet'>Article</div>
                </div>
                <div className="detail_coso" onClick={() => nav("/Clinic")}>
                    <img className='img_coso' src='/img_coso.png' alt='Clinic'></img>
                    <div className='text_coso'>Clinic</div>
                </div>
            </div>
        </div>
    )
}
