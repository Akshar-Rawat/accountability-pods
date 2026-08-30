import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PodsPage from "./pages/PodsPage";
import CreatePodPage from "./pages/CreatePodPage";
import PodDetailsPage from "./pages/PodDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/pods" element={<PodsPage />} />

      <Route path="/pods/create" element={<CreatePodPage />} />

      <Route path="/pods/:id" element={<PodDetailsPage />} />
    </Routes>
  );
};

export default App;
