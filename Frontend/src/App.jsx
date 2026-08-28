import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
// Importa el nuevo componente
import Productores from "./pages/Productores/Productores" 
import PrediosPage from "./pages/Predios/PrediosPage"
import ProduccionPage from "./pages/Produccion/ProduccionPage"
import EstadisticaPage from "./pages/Estadistica/EstadisticaPage"
import LoginPrediosPage from "./pages/Predios/LoginPrediosPage";
import Dashboard from "./pages/Predios/Dashboard";
import LoginProduccionPage from "./pages/Produccion/LoginProduccionPage"
import DashboardProduccion from "./pages/Produccion/DashboardProduccion"
import AdminConfigPage from "./pages/Predios/AdminConfigPage";
import AdminPrediosDashboard from "./pages/Predios/AdminPrediosDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Agrega esta línea */}
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
      </Routes>
    </BrowserRouter>
  )
}

export default App