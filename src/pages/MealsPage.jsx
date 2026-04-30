import React from 'react';
import Sidebar from '../components/Sidebar';
import MealsComponent from '../components/MealsComponent';

const MealsPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 px-6 py-5">
        <MealsComponent />
      </div>
    </div>
  );
};

export default MealsPage;
