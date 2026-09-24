import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Productores from "./pages/Productores/Productores" 
import PrediosPage from "./pages/Predios/PrediosProduccion"
import ProduccionPage from "./pages/Produccion/ProduccionPage"
import EstadisticaPage from "./pages/Estadistica/EstadisticaPage"
import LoginPrediosPage from "./pages/Predios/PrediosProduccionLogin";
import Dashboard from "./pages/Predios/Dashboard";
import LoginProduccionPage from "./pages/Produccion/LoginProduccionPage"
import DashboardProduccion from "./pages/Produccion/DashboardProduccion"
import AdminConfigPage from "./pages/Predios/AdminConfigPage";
import AdminPrediosDashboard from "./pages/Predios/AdminPrediosDashboard";
import Empleados from "./pages/Predios/Empleados"

import EmpleadoDashboard from "./components/EmpleadoDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productores" element={<Productores />} />
        <Route path="/predios" element={<PrediosPage />} />
        <Route path="/produccion" element={<ProduccionPage />} />
        <Route path="/estadística-portalinfo" element={<EstadisticaPage />} />
        <Route path="/predios/login" element={<LoginPrediosPage />} />
        <Route path="/predios/Dashboard" element={<Dashboard />} />
        <Route path="/produccion/login" element={<LoginProduccionPage />} />
        <Route path="/produccion/DashboardP" element={<DashboardProduccion />} />
        <Route path="/predios/admin-secreto" element={<AdminConfigPage />} />
        <Route path="/admin/dashboard" element={<AdminPrediosDashboard />} />
        <Route path="/predios/Empleados" element={<Empleados />} />

        {/* 2. Agrega la ruta que te está dando error */}
        <Route path="/predios/EmpleadoDashboard" element={<EmpleadoDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App