import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AdminLogin from './admin/Login'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/Dashboard'
import AdminProjects from './admin/Projects'
import AdminSkills from './admin/Skills'
import AdminServices from './admin/Services'
import AdminExperience from './admin/Experience'
import AdminEducation from './admin/Education'
import AdminAchievements from './admin/Achievements'
import AdminContact from './admin/Contact'
import AdminProfile from './admin/Profile'
import AdminMessages from './admin/Messages'
import ProtectedRoute from './admin/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile"      element={<AdminProfile />} />
          <Route path="projects"     element={<AdminProjects />} />
          <Route path="skills"       element={<AdminSkills />} />
          <Route path="services"     element={<AdminServices />} />
          <Route path="experience"   element={<AdminExperience />} />
          <Route path="education"    element={<AdminEducation />} />
          <Route path="achievements" element={<AdminAchievements />} />
          <Route path="contact"      element={<AdminContact />} />
          <Route path="messages"     element={<AdminMessages />} />
        </Route>
      </Routes>
      <Footer />
    </AuthProvider>
  )
}
