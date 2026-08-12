import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import ScrollToHash from "./components/ScrollToHash.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";

import OverviewPage from "./pages/dashboard/OverviewPage.jsx";
import ProjectsPage from "./pages/dashboard/ProjectsPage.jsx";
import ProjectDetailPage from "./pages/dashboard/ProjectDetailPage.jsx";
import MyTasksPage from "./pages/dashboard/MyTasksPage.jsx";
import ProfilePage from "./pages/dashboard/ProfilePage.jsx";
import SettingsPage from "./pages/dashboard/SettingsPage.jsx";

import AdminUsersPage from "./pages/dashboard/admin/AdminUsersPage.jsx";
import AdminProjectsPage from "./pages/dashboard/admin/AdminProjectsPage.jsx";
import AdminAnalyticsPage from "./pages/dashboard/admin/AdminAnalyticsPage.jsx";
import AdminReportsPage from "./pages/dashboard/admin/AdminReportsPage.jsx";

const NotFoundPage = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
    <h1 className="text-3xl font-bold">404</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400">This page doesn't exist.</p>
  </div>
);

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToHash />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="tasks" element={<MyTasksPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />

            <Route path="admin/users" element={<ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute>} />
            <Route path="admin/projects" element={<ProtectedRoute adminOnly><AdminProjectsPage /></ProtectedRoute>} />
            <Route path="admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalyticsPage /></ProtectedRoute>} />
            <Route path="admin/reports" element={<ProtectedRoute adminOnly><AdminReportsPage /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
