import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomNavbar from '../custom-navbar';
import CustomFooter from '../custom-footer';

function Layout() {
    return (
        <div>
            <CustomNavbar />
            <div style={{ minHeight: '75vh' }}>
                <Outlet />
            </div>
            <CustomFooter />
        </div>
    );
}

export default Layout;
