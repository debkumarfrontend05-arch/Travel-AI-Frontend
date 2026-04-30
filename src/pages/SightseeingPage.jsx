import React from 'react';
import Sidebar from '../components/Sidebar';
import SightseeingComponent from '../components/SightseeingComponent';

const SightseeingPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 px-6 py-5">
        <SightseeingComponent />
      </div>
    </div>
  );
};

export default SightseeingPage;
