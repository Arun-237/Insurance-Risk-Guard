import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import RiskAssessment from "./pages/RiskAssessment";
import PolicyManagement from "./pages/PolicyManagement";
import UnderwritingDecisions from "./pages/UnderwritingDecisions";
import UnderwriterDashboard from "./pages/UnderwriterDashboard";
import PremiumPayment from "./pages/PremiumPayment";
import Analytics from "./pages/Analytics";
import "./App.css";

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container-fluid mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/underwriting-decisions" />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/underwriter" element={<UnderwriterDashboard />} />
          <Route path="/customers" element={<CustomerProfile />} />
          <Route path="/risk-assessment" element={<RiskAssessment />} />
          <Route path="/policies" element={<PolicyManagement />} />
          <Route
            path="/underwriting-decisions"
            element={<UnderwritingDecisions />}
          />
          <Route path="/premium-payments" element={<PremiumPayment />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
