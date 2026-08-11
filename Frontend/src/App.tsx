import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PracticePage from "./pages/PracticePage";
import ProblemWorkspacePage from "./pages/ProblemWorkspacePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Register Page */}
        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* Dashboard Page */}
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        {/* Practice Library */}
        <Route
          path="/practice"
          element={<PracticePage />}
        />

        {/* Individual Problem + Compiler */}
        <Route
          path="/practice/:id"
          element={<ProblemWorkspacePage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;