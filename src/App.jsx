import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/common/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MembersPage from './pages/MembersPage';
import MemberProfilePage from './pages/MemberProfilePage';
import PlansPage from './pages/PlansPage';
import AttendancePage from './pages/AttendancePage';
import PaymentsPage from './pages/PaymentsPage';
import TrainersPage from './pages/TrainersPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route element={<ProtectedRoute allowedRoles={['admin', 'trainer']} />}>
                  <Route path="/members" element={<MembersPage />} />
                  <Route path="/members/:id" element={<MemberProfilePage />} />
                  <Route path="/trainers" element={<TrainersPage />} />
                </Route>
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/payments" element={<PaymentsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
