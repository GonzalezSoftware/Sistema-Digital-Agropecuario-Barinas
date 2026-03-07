import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import PrediosPage from "./pages/Predios/PrediosPage"
import ProduccionPage from "./pages/Produccion/ProduccionPage"
import HomeEstadistica from "./pages/Estadistica-info/homeEstadistica"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/predios" element={<PrediosPage />} />
        <Route path="/produccion" element={<ProduccionPage />} />
        <Route path="/estadistica-portalinfo" element={<HomeEstadistica />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App