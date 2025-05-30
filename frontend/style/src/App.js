import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import CategoryProfiles from './pages/CategoryProfiles';
import ProfileDetails from './pages/ProfileDetails';

import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import RoleSelectRegister from './pages/RoleSelectRegister';
import TailorRegister from './pages/TailorRegister';
import DesignerRegister from './pages/DesignerRegister';
import ResellerRegister from './pages/ResellerRegister';
import UserRegister from './pages/UserRegister';

import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Listings & Profiles
import Tailors from './pages/Tailors';
import TailorProfile from './pages/TailorProfile';
import Designers from './pages/Designers';
import DesignerProfile from './pages/DesignerProfile';
import Resellers from './pages/Resellers';
import ResellerProfile from './pages/ResellerProfile';

// User Pages
import MyAccount from './pages/MyAccount';  
import Messages from './pages/Messages';    

function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar isAuthenticated={!!user} handleLogout={logout} />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/category/:role" element={<CategoryProfiles />} />
        <Route path="/profile/:id" element={<ProfileDetails />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Registration Routes */}
        <Route path="/register" element={<RoleSelectRegister />} />
        <Route path="/register/tailor" element={<TailorRegister />} />
        <Route path="/register/designer" element={<DesignerRegister />} />
        <Route path="/register/reseller" element={<ResellerRegister />} />
        <Route path="/register/user" element={<UserRegister />} />

        {/* Listings */}
        <Route path="/tailors" element={<Tailors />} />
        <Route path="/designers" element={<Designers />} />
        <Route path="/resellers" element={<Resellers />} />

        {/* Individual Profiles */}
        <Route path="/tailor/:id" element={<TailorProfile />} />
        <Route path="/designer/:id" element={<DesignerProfile />} />
        <Route path="/reseller/:id" element={<ResellerProfile />} />

        {/* User Pages */}
        <Route path="/account" element={<MyAccount />} />
        <Route path="/messages" element={<Messages />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Legal Pages */}
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
