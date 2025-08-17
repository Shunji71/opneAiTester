// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ImgPage from '../features/img/ImgPage'
import InquiryPage from '../features/inquiry/InquiryPage'

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/img" element={<ImgPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
      </Routes>
    </Router>
  )
}
