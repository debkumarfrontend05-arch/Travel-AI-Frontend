import React from 'react';
import Sidebar from '../components/Sidebar';
import HotelsComponent from '../components/HotelsComponent';

const HotelsPage = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 px-6 py-5">
                <HotelsComponent />
            </div>
        </div>
    );
};

export default HotelsPage;