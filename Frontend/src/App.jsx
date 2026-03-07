import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EstadisticasPage from "./pages/Estadistica-info/home-estadistica";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/estadisticas" element={<EstadisticasPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;