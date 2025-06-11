import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute, { BrandPartnerRoute } from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import LocationBasedCampaigns from './pages/LocationBasedCampaigns';
import Billing from './pages/Billing';
import Support from './pages/Support';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import UserCrudDemo from './pages/admin/UserCrudDemo';
import UserCrudPage from './pages/admin/UserCrudPage';
import IncidentReports from './pages/admin/IncidentReports';
import InsuranceCompanies from './pages/admin/InsuranceCompanies';
import SafeIdManagement from './pages/admin/SafeIdManagement';
import PromotionalOffers from './pages/admin/PromotionalOffers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import HeatmapAnalytics from './pages/admin/HeatmapAnalytics';
import SupportManagement from './pages/admin/SupportManagement';
import PushNotifications from './pages/admin/PushNotifications';
import LocationActivity from './pages/admin/LocationActivity';
import PrivacyCompliance from './pages/admin/PrivacyCompliance';

// Import dummy data utilities (makes them available in browser console)
import './utils/dummyData';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Brand Partner Routes - Admin users redirected to admin dashboard */}
          <Route
            path="/dashboard"
            element={
              <BrandPartnerRoute>
                <Dashboard />
              </BrandPartnerRoute>
            }
          />
          <Route
            path="/location-campaigns"
            element={
              <BrandPartnerRoute>
                <LocationBasedCampaigns />
              </BrandPartnerRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <BrandPartnerRoute>
                <Billing />
              </BrandPartnerRoute>
            }
          />
          <Route
            path="/support"
            element={
              <BrandPartnerRoute>
                <Support />
              </BrandPartnerRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          {/* Main user management route - clean production version */}
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserCrudPage />
              </AdminRoute>
            }
          />
          {/* Demo version with explanatory header */}
          <Route
            path="/admin/users/demo"
            element={
              <AdminRoute>
                <UserCrudDemo />
              </AdminRoute>
            }
          />
          {/* Keep the old user management as a legacy route */}
          <Route
            path="/admin/users/legacy"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/incidents"
            element={
              <AdminRoute>
                <IncidentReports />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/insurance-companies"
            element={
              <AdminRoute>
                <InsuranceCompanies />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/safe-id-management"
            element={
              <AdminRoute>
                <SafeIdManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/offers"
            element={
              <AdminRoute>
                <PromotionalOffers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/heatmap-analytics"
            element={
              <AdminRoute>
                <HeatmapAnalytics />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/support"
            element={
              <AdminRoute>
                <SupportManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <AdminRoute>
                <PushNotifications />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/location-activity"
            element={
              <AdminRoute>
                <LocationActivity />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/privacy"
            element={
              <AdminRoute>
                <PrivacyCompliance />
              </AdminRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
