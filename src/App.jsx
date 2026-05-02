import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { StudentDashboard } from './pages/student/Dashboard';
import { StudentUploadSheet } from './pages/student/UploadSheet';
import { TeacherDashboard } from './pages/teacher/Dashboard';
import { TeacherEvaluation } from './pages/teacher/Evaluation';
import { TeacherUploadExam } from './pages/teacher/UploadExam';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Settings } from './pages/shared/Settings';

import { StudentResults } from './pages/student/Results';

// Placeholder components for routing
const DashboardPlaceholder = ({ role }) => <div className="text-2xl font-bold dark:text-white">{role} Dashboard</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<MainLayout role="student" />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="upload" element={<StudentUploadSheet />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="settings" element={<Settings role="student" />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<MainLayout role="teacher" />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="upload" element={<TeacherUploadExam />} />
          <Route path="evaluation" element={<TeacherEvaluation />} />
          <Route path="settings" element={<Settings role="teacher" />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<MainLayout role="admin" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<div className="text-2xl font-bold dark:text-white">User Management</div>} />
          <Route path="settings" element={<Settings role="admin" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
