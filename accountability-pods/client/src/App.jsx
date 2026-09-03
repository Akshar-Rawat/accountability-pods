import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PodsPage from "./pages/PodsPage";
import CreatePodPage from "./pages/CreatePodPage";
import PodDetailsPage from "./pages/PodDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LegalPage from "./pages/LegalPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import NotificationsPage from "./pages/NotificationsPage";
import AppLayout from "./components/layout/AppLayout";
import useAuthStore from "./stores/authStore";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isRestoring = useAuthStore((state) => state.isRestoring);

  if (isRestoring) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

const App = () => {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);

  useEffect(() => {
    getCurrentUser().catch(() => {});
  }, [getCurrentUser]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy" element={<LegalPage type="privacy" />} />
        <Route path="/terms" element={<LegalPage type="terms" />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />

        <Route
          path="/pods"
          element={
            <ProtectedRoute>
              <PodsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pods/create"
          element={
            <ProtectedRoute>
              <CreatePodPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>}
        />

        <Route
          path="/pods/:id"
          element={
            <ProtectedRoute>
              <PodDetailsPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
