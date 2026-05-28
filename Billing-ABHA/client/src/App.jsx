import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./Common/context/AuthContext";
import { ThemeProvider } from "./Common/context/ThemeContext";
import ProtectedRoute from "./Common/Auth/ProtectedRoute";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


/* Public Pages */
import Home from "./User/pages/Home";
import Landing from "./Common/pages/landing";
import Login from "./User/pages/Login";
import Register from "./User/pages/Register";
import Features from "./User/pages/Features";
import Solutions from "./User/pages/Solutions";
import Pricing from "./User/pages/Pricing";
import Testimonials from "./User/pages/Testimonials";
import Resources from "./User/pages/Resources";
import Contact from "./User/pages/Contact";
import ForgotPassword from "./SubAdmin/pages/Auth/ForgotPassword";
import TermsOfService from "./Common/components/TermsOfService";
import PrivacyPolicy from "./Common/components/PrivacyPolicy";

/* Admin Login */
import AdminLogin from "./Admin/pages/Auth/AdminLogin";

/* SubAdmin Layout & Pages */
import SubAdminLayout from "./SubAdmin/components/SubAdminLayout";
import Dashboard from "./SubAdmin/pages/Dashboard";
import Billing from "./SubAdmin/pages/Billing";
import Reports from "./SubAdmin/pages/Reports";
import Settings from "./SubAdmin/pages/Settings";

/* Admin Layout & Pages */
import AdminLayout from "./Admin/components/AdminLayout";
import AdminDashboard from "./Admin/pages/AdminDashboard";
import UserManagement from "./Admin/pages/UserManagement";
import ContentManagement from "./Admin/pages/ContentManagement";
import Analytics from "./Admin/pages/Analytics";
import Financial from "./Admin/pages/Financial";
import SystemSettings from "./Admin/pages/SystemSettings";
import Support from "./Admin/pages/Support";

/* SubAdmin Pages */
import Profile from "./SubAdmin/pages/Profile";
import ProfileCreation from "./SubAdmin/components/Profile/ProfileCreation";
import HospitalDetails from "./Admin/components/HospitalProfile/HospitalDetails";

/* Reception Pages */
import OPDReception from "./SubAdmin/pages/Reception/OPD";
import RegisterPatient from "./SubAdmin/components/OPD/RegisterPatient";
import ManageServices from "./SubAdmin/components/OPD/ManageServices";
import CreateBill from "./SubAdmin/components/OPD/CreateBill";
import PrintBill from "./SubAdmin/components/OPD/PrintBill";
import BillList from "./SubAdmin/components/OPD/BillList";
import PatientsDashboard from "./SubAdmin/components/OPD/PatientsDashboard";
import PatientDetails from "./SubAdmin/components/OPD/PatientDetails";
import OpdBillingDashboard from "./SubAdmin/components/OPD/OpdBillingDashboard";
import BillingSettings from "./SubAdmin/components/Settings/BillingSettings";
import IPDReception from "./SubAdmin/pages/Reception/IPD";
import IpdDashboard from "./SubAdmin/components/IPD/IpdDashboard";
import AdmitPatient from "./SubAdmin/components/IPD/AdmitPatient";
import StayManagement from "./SubAdmin/components/IPD/StayManagement";
import DischargeBilling from "./SubAdmin/components/IPD/DischargeBilling";
import WalkingReception from "./SubAdmin/pages/Reception/WalkIn";
import ReceptionSetup from "./SubAdmin/pages/Reception/Setup";
import DoctorProfile from "./Admin/pages/OPD/Setup/DoctorProfile"
import HospitalDoctors from "./Admin/components/HospitalProfile/HospitalDoctors";
import LabDashboard from "./SubAdmin/components/Laboratory/LabDashboard";
import PatientLabPortal from "./SubAdmin/components/Laboratory/PatientLabPortal";
import StaffLogin from "./Common/pages/StaffLogin";
import StaffManagement from "./SubAdmin/components/Settings/StaffManagement";
import StaffDashboard from "./Common/pages/StaffDashboard";
import StaffLabDashboard from "./SubAdmin/components/Staff/StaffLabDashboard";
import DoctorDashboard from "./SubAdmin/components/Doctor/DoctorDashboard";


const App = () => {
  

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/billing-software" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/features" element={<Features />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />

          {/* Staff Module Routes */}
          <Route path="/staff/laboratory" element={<StaffLabDashboard />} />
          <Route path="/staff/laboratory/patient/:id" element={<PatientLabPortal />} />
          <Route path="/staff/patients" element={<PatientsDashboard />} />
          <Route path="/staff/patients/view/:id" element={<PatientDetails />} />
          <Route path="/staff/opd" element={<OpdBillingDashboard />} />
          <Route path="/staff/opd/billing/create" element={<CreateBill />} />
          <Route path="/staff/doctor" element={<DoctorDashboard />} />
          <Route path="/staff/opd/billing/view/:id" element={<PrintBill />} />
          <Route path="/staff/opd/billing/history" element={<BillList />} />
          <Route path="/staff/ipd" element={<IpdDashboard />} />

          {/* Catch-all fallback for unmatched /staff/* */}
          <Route path="/staff/*" element={<StaffDashboard />} />
          
          {/* ================= ADMIN PUBLIC ROUTES ================= */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ================= SUBADMIN ROUTES ================= */}
          <Route
            path="/subadmin"
            element={
              <ProtectedRoute>
                <SubAdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            
            {/* ================= PATIENT ROUTES (Phase 3) ================= */}
            <Route path="patients">
              <Route index element={<PatientsDashboard />} />
              <Route path="register" element={<RegisterPatient />} />
              <Route path="edit/:id" element={<RegisterPatient />} />
              <Route path="view/:id" element={<PatientDetails />} />
            </Route>

            {/* ================= RECEPTION ROUTES ================= */}
            <Route path="reception">
              {/* Main reception routes */}
              <Route path="opd">
                <Route index element={<OpdBillingDashboard />} />
                <Route path="services" element={<ManageServices />} />
                <Route path="billing/create" element={<CreateBill />} />
                <Route path="billing/view/:id" element={<PrintBill />} />
                <Route path="billing/history" element={<BillList />} />
              </Route>
              <Route path="ipd">
                <Route index element={<IpdDashboard />} />
                <Route path="admit" element={<AdmitPatient />} />
                <Route path="stay/:id" element={<StayManagement />} />
                <Route path="billing/view/:id" element={<DischargeBilling />} />
              </Route>
              <Route path="walking" element={<WalkingReception />} />
              <Route path="setup" element={<ReceptionSetup />} />
              <Route path="laboratory">
                <Route index element={<LabDashboard />} />
                <Route path="patient/:id" element={<PatientLabPortal />} />
              </Route>
              <Route path="doctor" element={<DoctorDashboard />} />
            </Route>
            
            
            {/* ================= SETTINGS ================= */}
            <Route path="settings/billing" element={<BillingSettings />} />
            <Route path="settings/billing/template" element={<BillingSettings defaultTab="template" />} />
            <Route path="settings/staff" element={<StaffManagement />} />
            <Route path="billing" element={<Billing />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile-completion" element={<ProfileCreation />} />
          </Route>

          {/* ================= ADMIN PROTECTED ROUTES ================= */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="hospital/:tenantId" element={<HospitalDetails/>} />
            <Route path="hospital/:tenantId/doctors" element={<HospitalDoctors />} />
            {/* User Management Routes */}
            <Route path="users" element={<UserManagement />} />
            <Route path="users/admins" element={<UserManagement tab="admins" />} />
            <Route path="users/subadmins" element={<UserManagement tab="subadmins" />} />
            <Route path="users/active" element={<UserManagement tab="active" />} />
            <Route path="users/banned" element={<UserManagement tab="banned" />} />

            {/* OPD Management Routes */}
            <Route path="doctors" element={<ContentManagement />} />
            <Route path="doctors/approval" element={<DoctorProfile />} />

            {/* Analytics Routes */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="analytics/users" element={<Analytics tab="users" />} />
            <Route path="analytics/revenue" element={<Analytics tab="revenue" />} />
            <Route path="analytics/traffic" element={<Analytics tab="traffic" />} />
            
            {/* Financial Routes */}
            <Route path="financial/transactions" element={<Financial tab="transactions" />} />
            <Route path="financial/subscriptions" element={<Financial tab="subscriptions" />} />
            <Route path="financial/invoices" element={<Financial tab="invoices" />} />
            <Route path="financial/refunds" element={<Financial tab="refunds" />} />
            
            {/* System Settings Routes */}
            <Route path="settings/general" element={<SystemSettings tab="general" />} />
            <Route path="settings/security" element={<SystemSettings tab="security" />} />
            <Route path="settings/api" element={<SystemSettings tab="api" />} />
            <Route path="settings/backup" element={<SystemSettings tab="backup" />} />
            
            {/* Support Routes */}
            <Route path="support/tickets" element={<Support tab="tickets" />} />
            <Route path="support/faqs" element={<Support tab="faqs" />} />
            <Route path="support/contacts" element={<Support tab="contacts" />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;