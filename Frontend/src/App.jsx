import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import PrediosPage from "./pages/Predios/PrediosPage"
import ProduccionPage from "./pages/Produccion/ProduccionPage"
import EstadisticaPage from "./pages/Estadistica/EstadisticaPage"
import LoginPrediosPage from "./pages/Predios/LoginPrediosPage";
import Dashboard from "./pages/Predios/Dashboard";
import LoginProduccionPage from "./pages/Produccion/LoginProduccionPage"
import DashboardProduccion from "./pages/Produccion/DashboardProduccion"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/predios" element={<PrediosPage />} />
        <Route path="/produccion" element={<ProduccionPage />} />
        <Route path="/estadística-portalinfo" element={<EstadisticaPage />} />
        <Route path="/predios/login" element={<LoginPrediosPage />} />
        <Route path="/predios/Dashboard" element={<Dashboard />} />
        <Route path="/produccion/login" element={<LoginProduccionPage />} />
        <Route path="/produccion/DashboardP" element={<DashboardProduccion />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App