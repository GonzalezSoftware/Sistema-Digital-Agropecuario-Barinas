import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Productores from "./pages/Productores/Productores" 
import PrediosPage from "./pages/Predios/PrediosProduccion"
import LoginPrediosPage from "./pages/Predios/PrediosProduccionLogin";
import Dashboard from "./pages/Predios/Dashboard";
import AdminConfigPage from "./pages/Predios/AdminConfigPage";
import AdminPrediosDashboard from "./pages/Predios/AdminPrediosDashboard";
import Empleados from "./pages/Predios/Empleados"

import EmpleadoDashboard from "./components/EmpleadoDashboard";
import NoticiasDashboard from "./components/NoticiasDashboard"; // 📰 SIN llaves porque usa export default

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productores" element={<Productores />} />
        <Route path="/predios" element={<PrediosPage />} />
        <Route path="/predios/login" element={<LoginPrediosPage />} />
        <Route path="/predios/Dashboard" element={<Dashboard />} />
        <Route path="/predios/admin-secreto" element={<AdminConfigPage />} />
        <Route path="/admin/dashboard" element={<AdminPrediosDashboard />} />
        <Route path="/predios/Empleados" element={<Empleados />} />
        <Route path="/predios/EmpleadoDashboard" element={<EmpleadoDashboard />} />
        
        {/* 📰 Ruta para el panel del empleado de noticias */}
        <Route path="/predios/noticias-dashboard" element={<NoticiasDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App