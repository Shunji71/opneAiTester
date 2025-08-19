// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ImgPage from '../features/img/ImgPage'
import InquiryPage from '../features/inquiry/InquiryPage'
import TopPage from '../features/top/TopPage'
import TopPage2 from '../features/top/TopPage-ver2'
import TopPage3 from '../features/top/TopPage-ver3'

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/img" element={<ImgPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path="/top" element={<TopPage />} />
        <Route path="/top2" element={<TopPage2 />} />
        <Route path="/top3" element={<TopPage3 />} />
      </Routes>
    </Router>
  )
}
