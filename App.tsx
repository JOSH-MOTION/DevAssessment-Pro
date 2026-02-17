import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssessmentView from './pages/AssessmentView';
import ResultsView from './pages/ResultsView';
import AdminSubmissions from './pages/AdminSubmissions';
import { auth } from './services/authService';

const ProtectedRoute = ({ children, role }: { children?: React.ReactNode, role?: 'student' | 'admin' }) => {
  const { user } = auth.getAuthState();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute role="student">
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/student/assessment/:testId" element={
          <ProtectedRoute role="student">
            <AssessmentView />
          </ProtectedRoute>
        } />
        <Route path="/student/results" element={
          <ProtectedRoute role="student">
            <Layout><ResultsView /></Layout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/submissions" element={
          <ProtectedRoute role="admin">
            <Layout><AdminSubmissions /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute role="admin">
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;