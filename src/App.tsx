import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
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
import IncidentReports from './pages/admin/IncidentReports';

// Import dummy data utilities (makes them available in browser console)
import './utils/dummyData';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Brand Partner Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
                {/* <AdminDashboard /> */}
              </PrivateRoute>
            }
          />
          <Route
            path="/location-campaigns"
            element={
              <PrivateRoute>
                <LocationBasedCampaigns />
              </PrivateRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <PrivateRoute>
                <Billing />
              </PrivateRoute>
            }
          />
          <Route
            path="/support"
            element={
              <PrivateRoute>
                <Support />
              </PrivateRoute>
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
          <Route
            path="/admin/users"
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

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
