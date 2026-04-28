import React from 'react';
import Sidebar from '../components/Sidebar';
import TransfersComponent from '../components/TransfersComponent';

const TransfersPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 px-6 py-5">
        <TransfersComponent />
      </div>
    </div>
  );
};

export default TransfersPage;