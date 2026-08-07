import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/farmer/RegisterPage";

import FarmerLayout from "../layouts/farmer/FarmerLayout";

import Dashboard from "../pages/farmer/Dashboard";
import MyFarm from "../pages/farmer/MyFarm";
import LearningModules from "../pages/farmer/LearningModules";
import PracticeLogs from "../pages/farmer/PracticeLogs";
import PracticeAdd from "../pages/farmer/PracticeAdd";
import SustainabilityMetrics from "../pages/farmer/sustainabilityMetrics";
import Leaderboard from "../pages/farmer/Leaderboard";
import GovtSchemes from "../pages/farmer/GovtSchemes";
import AIAssistant from "../pages/farmer/AIAssistant";
import MarketBuyers from "../pages/farmer/MarketBuyers";
import ContactBuyer from "../pages/farmer/ContactBuyer";
import Notifications from "../pages/farmer/Notifications";
import Progress from "../pages/farmer/Progress";
import Settings from "../pages/farmer/Settings";
import EditFarm from "../pages/farmer/EditFarm";
import SchemeDetails from "../pages/farmer/SchemeDetails";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Farmer Routes */}
        <Route path="/farmer" element={<FarmerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-farm" element={<MyFarm />} />
          <Route path="edit-farm" element={<EditFarm />} />
          <Route path="learning-modules" element={<LearningModules />} />
          <Route path="practice-logs" element={<PracticeLogs />} />
          <Route path="practice/add" element={<PracticeAdd />} />
          <Route path="sustainability-metrics" element={<SustainabilityMetrics />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="govt-schemes" element={<GovtSchemes />} />
          <Route path="govt-schemes/:id" element={<SchemeDetails />} /> 
          <Route path="ai-assistant" element={<AIAssistant />} />

          <Route path="market-buyers" element={<MarketBuyers />} />
          <Route path="market-buyers/:id" element={<ContactBuyer />} />

          <Route path="notifications" element={<Notifications />} />
          <Route path="progress" element={<Progress />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Optional: 404 Page */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;