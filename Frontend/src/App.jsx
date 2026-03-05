import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import PrediosPage from "./pages/Predios/PrediosPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/predios" element={<PrediosPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App