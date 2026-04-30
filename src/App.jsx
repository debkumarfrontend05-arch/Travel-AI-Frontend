import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import PackagesPage from './pages/PackagesPage';
import HotelsPage from './pages/HotelsPage';
import TransfersPage from './pages/TransfersPage';
import SightseeingPage from './pages/SightseeingPage';
import MealsPage from './pages/MealsPage';
import LoginPage from './pages/LoginPage';
import SmoothScroll from './components/SmoothScroll';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <SmoothScroll />
      <Toaster position="top-right" toastOptions={{ duration: 2800 }} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/transfers" element={<TransfersPage />} />
        <Route path="/sightseeing" element={<SightseeingPage />} />
        <Route path="/meals" element={<MealsPage />} />
      </Routes>
    </>
  )
}

export default App;
