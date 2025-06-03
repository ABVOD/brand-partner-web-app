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
import SafeIdManagement from './pages/admin/SafeIdManagement';

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
            path="/admin/safe-id-management"
            element={
              <AdminRoute>
                <SafeIdManagement />
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
