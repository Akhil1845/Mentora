import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PracticePage from "./pages/PracticePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Register Page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Practice Page */}
        <Route path="/practice" element={<PracticePage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;