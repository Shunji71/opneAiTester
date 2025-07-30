// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ImgPage from '../features/img/ImgPage'

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/img" element={<ImgPage />} />
      </Routes>
    </Router>
  )
}
