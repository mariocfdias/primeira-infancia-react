import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import MunicipioCanindePage from "./pages/MunicipioCanindePage"
import { ApiProvider } from "./api"

function App() {
  return (
    <ApiProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/municipio-caninde" element={<MunicipioCanindePage />} />
      </Routes>
    </ApiProvider>
  )
}

export default App

