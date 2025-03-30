import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import MunicipioCanindePage from "./pages/MunicipioCanindePage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/municipio-caninde" element={<MunicipioCanindePage />} />
    </Routes>
  )
}

export default App

