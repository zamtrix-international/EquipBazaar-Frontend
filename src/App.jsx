// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToAnchor from './components/ScrollToAnchor/ScrollToAnchor';
import Home from './pages/Module/Home/Home';
import Login from './pages/Module/Login/Login';
import Signup from './pages/Module/Signup/Signup';
import EquipmentList from './pages/Module/EquipmentList/EquipmentList';
import EquipmentDetail from './pages/Module/EquipmentDetail/EquipmentDetail';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard/CustomerDashboard';
import MyBookings from './pages/customer/MyBookings/MyBookings';
import Payment from './pages/customer/Payment/Payment';
import Support from './pages/customer/Support/Support';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard/VendorDashboard';
import AddEquipment from './pages/vendor/AddEquipment/AddEquipment';
import MyEquipment from './pages/vendor/MyEquipment/MyEquipment';
import Earnings from './pages/vendor/Earnings/Earnings';
import KYC from './pages/vendor/KYC/KYC';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import ManageVendors from './pages/admin/ManageVendors/ManageVendors';
import ManageUsers from './pages/admin/ManageUsers/ManageUsers';
import Reports from './pages/admin/Reports/Reports';
import CommissionSettings from './pages/admin/CommissionSettings/CommissionSettings';
import Analytics from './pages/admin/Analytics/Analytics';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToAnchor />
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/equipment" element={<EquipmentList />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            
            {/* Customer Routes */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/bookings" element={<MyBookings />} />
            <Route path="/customer/payment/:id" element={<Payment />} />
            <Route path="/customer/support" element={<Support />} />
            
            {/* Vendor Routes */}
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/add-equipment" element={<AddEquipment />} />
            <Route path="/vendor/my-equipment" element={<MyEquipment />} />
            <Route path="/vendor/earnings" element={<Earnings />} />
            <Route path="/vendor/kyc" element={<KYC />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/vendors" element={<ManageVendors />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/commission" element={<CommissionSettings />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;