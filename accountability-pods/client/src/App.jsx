import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PodsPage from "./pages/PodsPage";
import CreatePodPage from "./pages/CreatePodPage";
import PodDetailsPage from "./pages/PodDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppLayout from "./components/layout/AppLayout";
import useAuthStore from "./stores/authStore";

// Redirects to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isRestoring = useAuthStore((state) => state.isRestoring);

  if (isRestoring) return null; // Wait for auth restore from cookie

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

const App = () => {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);

  // Restore auth from cookie on every page load / refresh
  useEffect(() => {
    getCurrentUser().catch(() => {});
  }, [getCurrentUser]);

  return (
    <Routes>
      {/* All pages share the AppLayout (Navbar + main wrapper) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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
