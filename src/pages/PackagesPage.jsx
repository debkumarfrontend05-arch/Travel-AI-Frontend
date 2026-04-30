import React from "react";
import Sidebar from "../components/Sidebar";
import PackagesComponent from "../components/PackagesComponent";

const PackagesPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 px-6 py-5">
        <PackagesComponent />
      </div>
    </div>
  );
};

export default PackagesPage;
