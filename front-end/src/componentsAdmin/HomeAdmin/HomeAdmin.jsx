import React, { useEffect, useState } from 'react';
import './homeAdmin.scss';
import { FaUserDoctor } from "react-icons/fa6";
import { FaClinicMedical } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { MdManageAccounts } from "react-icons/md";
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getAllDentist, getAllCustomer, getAllUSer } from '../../Service/userService';
import axios from 'axios';
import BASE_URL from "../../ServiceSystem/axios";
import { getAllClinic, getAllClinicOwner } from '../../Service/clinicService'

export default function HomgetAllCliniceAdmin() {
    const [arrDentists, setArrDentists] = useState([]);
    const [arrCus, setArrCus] = useState([]);
    const [arrClinic, setClinic] = useState([]);
    const [arrUser, setUser] = useState([]);
    const [arrClinicOwner, setClinicOwner] = useState([]);
    useEffect(() => {
        handleGetAllDentists();
        handleGetAllCustomers();
        handleGetAllClinic();
        handleGetUser();
        handleGetClinicOwer();
    }, []);

    const handleGetAllDentists = async () => {
        try {
            const response = await getAllDentist('ALL');
            if (response && response.errCode === 0) {
                setArrDentists(response.account);
            } else {
                console.error('Error fetching dentists:', response);
            }
        } catch (error) {
            console.error('Error fetching dentists:', error);
        }
    };

    const handleGetAllCustomers = async () => {
        let response = await getAllCustomer('ALL');
        if (response && response.errCode === 0) {
            setArrCus(response.account);
        } else {
            console.error('Error fetching customer:', response);
        }
        console.log('get cus from back-end', response);
    };



    const handleGetAllClinic = async () => {
        let response = await getAllClinic('ALL');
        if (response && response.errCode === 0) {
            setClinic(response.account);
        } else {
            console.error('Error fetching Clinic:', response);
        }
        console.log('get Clinic from back-end', response);
    };
    const handleGetUser = async () => {
        let response = await getAllUSer('ALL');
        if (response && response.errCode === 0) {
            setUser(response.account);
        } else {
            console.error('Error fetching User:', response);
        }
        console.log('get cus from back-end', response);
    };

    const handleGetClinicOwer = async () => {
        let response = await getAllClinicOwner('ALL');
        if (response && response.errCode === 0) {
            setClinicOwner(response.account);
        } else {
            console.error('Error fetching User:', response);
        }
        console.log('get ClinicOwner from back-end', response);
    };


    const data = [
        { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
        { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
        { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
        { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
        { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
    ];
    return (
        <main className='main-container'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Dentist</h3>
                    <FaUserDoctor className='card_icon' />
                </div>
                <h1>{arrDentists.length}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>ClinicOwner</h3>
                    <MdManageAccounts className='card_icon' />
                </div>
                <h1>{arrClinicOwner.length}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>CUSTOMERS</h3>
                    <BsPeopleFill className='card_icon' />
                </div>
                <h1>{arrCus.length}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Clinic</h3>
                    <FaClinicMedical className='card_icon' />
                </div>
                <h1>{arrClinic.length}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>User</h3>
                    <CiUser className='card_icon' />
                </div>
                <h1>{arrUser.length}</h1>
            </div>

            <div className='charts'>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pv" fill="#8884d8" />
                        <Bar dataKey="uv" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </main>
    );
}
