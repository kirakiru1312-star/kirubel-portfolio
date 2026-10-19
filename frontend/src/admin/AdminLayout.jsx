import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './AdminLayout.module.css'

const NAV = [
  { to: '/admin',              label: 'Dashboard',    icon: '📊', end: true },
  { to: '/admin/profile',      label: 'Profile',      icon: '👤' },
  { to: '/admin/projects',     label: 'Projects',     icon: '💼' },
  { to: '/admin/skills',       label: 'Skills',       icon: '⚡' },
  { to: '/admin/services',     label: 'Services',     icon: '🛠️' },
  { to: '/admin/experience',   label: 'Experience',   icon: '🏢' },
  { to: '/admin/education',    label: 'Education',    icon: '🎓' },
  { to: '/admin/achievements', label: 'Achievements', icon: '🏆' },
  { to: '/admin/contact',      label: 'Contact',      icon: '📞' },
  { to: '/admin/messages',     label: 'Messages',     icon: '✉️' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/admin/login') }

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>K</span>
            <div>
              <p className={styles.brandName}>Admin Panel</p>
              <p className={styles.brandUser}>{user?.username}</p>
            </div>
          </div>
        </div>
        <nav className={styles.nav}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <a href="/" target="_blank" className={styles.viewSite}>
            <span>🌐</span> View Portfolio
          </a>
          <button className={styles.logout} onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle sidebar">☰</button>
          <div className={styles.topbarRight}>
            <span className={styles.topbarUser}>Hello, {user?.username}</span>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
