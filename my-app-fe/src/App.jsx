import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/layout";
import LoginWelcome from "./components/login_welcome_page";
import VisitsLog from "./components/visits_log";
import HuntingLog from "./components/hunting_log";
import Registration from "./components/registration_page";
import People_in_ground from "./components/people_in_ground";


import Protected_route from "./components/protected_route";
import { AuthProvider, useAuth } from "./components/AuthContext";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            isAuthenticated ? (
              <Navigate to="/navstevy" replace />
            ) : (
              <LoginWelcome />
            )
          }
        />

        <Route
          path="domov"
          element={
            <Protected_route allowedRoles={["Hunter", "Admin"]}>
              <div className="container p-4">Domov</div>
            </Protected_route>
          }
        />
        <Route
          path="navstevy"
          element={
            <Protected_route allowedRoles={["Hunter", "Admin"]}>
              <VisitsLog />
            </Protected_route>
          }
        />
        <Route
          path="ulovky"
          element={
            <Protected_route allowedRoles={["Hunter", "Admin"]}>
              <HuntingLog />
            </Protected_route>
          }
        />
        <Route
          path="sprava-reviru"
          element={
            <Protected_route allowedRoles={["Admin"]}>
              <div className="container p-4">Správa revíru</div>
            </Protected_route>
          }
        />
        <Route
          path="ludia"
          element={
            <Protected_route allowedRoles={["Admin"]}>
              <People_in_ground />
            </Protected_route>
          }
        />
        <Route path="registracia" element={<Registration />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-center" autoClose={2000} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
