import React from 'react'
import './headerAdmin.scss'
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';

export default function HeaderAdmin({ OpenSidebar }) {
    return (

        <div className='headerr'>
            <div className='menu-icon'>
                <BsJustify className='icon' onClick={OpenSidebar} />
            </div>
            <div className='header-left'>
                <BsSearch />
            </div>
            <div className='header-right'>
                <BsFillBellFill className='icon' />
                <BsFillEnvelopeFill className='icon' />
                <BsPersonCircle className='icon' />
            </div>
        </div>


    )
}
