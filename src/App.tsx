import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import OfflineIndicator from './components/OfflineIndicator';
import LandingPage from './pages/LandingPage';
import RegistrationChoice from './pages/RegistrationChoice';
import WorkerLogin from './pages/WorkerLogin';
import EstablishmentLogin from './pages/EstablishmentLogin';
import DepartmentLogin from './pages/DepartmentLogin';
import WorkerRegistration from './pages/WorkerRegistration';
import EstablishmentRegistration from './pages/EstablishmentRegistration';
import WorkerDashboard from './pages/WorkerDashboard';
import EstablishmentDashboard from './pages/EstablishmentDashboard';
import DepartmentDashboard from './pages/DepartmentDashboard';
import WorkerProfile from './pages/WorkerProfile';
import EstablishmentProfile from './pages/EstablishmentProfile';
import DepartmentProfile from './pages/DepartmentProfile';
import AttendanceHistory from './pages/AttendanceHistory';
import WorkerManagement from './pages/WorkerManagement';
import EstablishmentManagement from './pages/EstablishmentManagement';
import ApplicationReview from './pages/ApplicationReview';
import DocumentVerification from './pages/DocumentVerification';
import ComplianceMonitoring from './pages/ComplianceMonitoring';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Help from './pages/Help';
import About from './pages/About';
import Contact from './pages/Contact';
import MobileDownload from './pages/MobileDownload';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import InstallPrompt from './components/InstallPrompt';
import MobileNavigation from './components/MobileNavigation';
import NetworkStatus from './components/NetworkStatus';
import MobileAppPrompt from './components/MobileAppPrompt';
import WorkerCardLogin from './pages/WorkerCardLogin';
import SamlLoading from './pages/SamlLoading';
import WorkerDynamicDashboard from './pages/WorkerDynamicDashboard';
import Logout from './pages/Logout';
import { LoaderProvider } from './contexts/LoaderContext';
import DashboardAuthGuard from './components/DashboardAuthGuard';

function App() {
  return (
    <LoaderProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 safe-area-top safe-area-bottom">
              <NetworkStatus />
              <OfflineIndicator />
              <Header />
              <main className="pb-16 md:pb-0">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/register" element={<RegistrationChoice />} />
                  <Route path="/register/worker" element={<WorkerRegistration />} />
                  <Route path="/register/establishment" element={<EstablishmentRegistration />} />

                  {/* Authentication Routes */}
                  <Route path="/login/worker" element={<WorkerLogin />} />
                  <Route path="/login/card" element={<WorkerCardLogin />} />
                  <Route path="/login/establishment" element={<EstablishmentLogin />} />
                  <Route path="/login/department" element={<DepartmentLogin />} />
                  <Route path="/loading" element={<SamlLoading />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Worker Protected Routes */}
                  <Route path="/dashboard/worker" element={
                    <ProtectedRoute userType="worker">
                      <DashboardAuthGuard allowedRole="worker">
                        <WorkerDashboard />
                      </DashboardAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/dynamic" element={
                    <ProtectedRoute userType="worker">
                      <DashboardAuthGuard allowedRole="worker">
                        <WorkerDynamicDashboard />
                      </DashboardAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile/worker" element={
                    <ProtectedRoute userType="worker">
                      <DashboardAuthGuard allowedRole="worker">
                        <WorkerProfile />
                      </DashboardAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/attendance/history" element={
                    <ProtectedRoute userType="worker">
                      <DashboardAuthGuard allowedRole="worker">
                        <AttendanceHistory />
                      </DashboardAuthGuard>
                    </ProtectedRoute>
                  } />

                  {/* Establishment Protected Routes */}
                  <Route path="/dashboard/establishment" element={
                    <ProtectedRoute userType="establishment">
                      <DashboardAuthGuard allowedRole="establishment">
                        <EstablishmentDashboard />
                      </DashboardAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile/establishment" element={
                    <ProtectedRoute userType="establishment">
                      <DashboardAuthGuard allowedRole="establishment">
                        <EstablishmentProfile />
                      </DashboardAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/workers/management" element={
                    <ProtectedRoute userType="establishment">
                      <DashboardAuthGuard allowedRole="establishment">
                        <WorkerManagement />
                      </DashboardAuthGuard>
                    </ProtectedRoute>
                  } />

                  {/* Department Protected Routes */}
                  <Route path="/dashboard/department" element={
                    <ProtectedRoute userType="department">
                      <DashboardAuthGuard allowedRole="department">
                        <DepartmentDashboard />
                      </DashboardAuthGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile/department" element={
                    <ProtectedRoute userType="department">
                      <DepartmentProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/establishments/management" element={
                    <ProtectedRoute userType="department">
                      <EstablishmentManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/review" element={
                    <ProtectedRoute userType="department">
                      <ApplicationReview />
                    </ProtectedRoute>
                  } />
                  <Route path="/documents/verification" element={
                    <ProtectedRoute userType="department">
                      <DocumentVerification />
                    </ProtectedRoute>
                  } />
                  <Route path="/compliance/monitoring" element={
                    <ProtectedRoute userType="department">
                      <ComplianceMonitoring />
                    </ProtectedRoute>
                  } />

                  {/* Shared Protected Routes */}
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />

                  {/* General Routes */}
                  <Route path="/help" element={<Help />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/mobile" element={<MobileDownload />} />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <MobileNavigation />
              <InstallPrompt />
              <MobileAppPrompt />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </LoaderProvider>
  );
}

export default App;