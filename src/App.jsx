import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import MunicipioPage from "./pages/MunicipioPage"
import { ApiProvider } from "./api"

function App() {
  return (
    <ApiProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/municipio-caninde" element={<MunicipioPage />} />
      </Routes>
    </ApiProvider>
  )
}

export default App

