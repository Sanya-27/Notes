import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCookieByName } from '../utils/cookie';

const Layout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCookieByName('token')) {
            navigate('/login');
        }
    }, []);

    if (!getCookieByName('token')) {
        return <></>;
    }

    return (
        <div className='flex w-full'>
            <Sidebar />
            <div className='flex flex-col gap-2 w-full'>
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
