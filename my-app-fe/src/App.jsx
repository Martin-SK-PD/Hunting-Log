import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/layout";
import Registration from "./components/registration_page";
import Login_welcome_page from "./components/login_welcome_page"
import Visits_log from "./components/visits_log"
import Hunting_log from "./components/hunting_log"
import { AuthProvider } from "./components/AuthContext";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-center" autoClose={2000} />
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login_welcome_page />} />
          <Route path="navstevy" element={<Visits_log />} />
          <Route path="ulovky" element={<Hunting_log />} />
          <Route path="registracia" element={<Registration />} />
        </Route>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
