import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getAdminProjects, getAdminSkills, getAdminServices,
  getAdminExperience, getAdminEducation, getAdminAchievements, getMessages
} from '../api/admin'
import styles from './Dashboard.module.css'

const CARDS = [
  { label: 'Projects',     icon: '💼', to: '/admin/projects',     key: 'projects' },
  { label: 'Skills',       icon: '⚡', to: '/admin/skills',       key: 'skills' },
  { label: 'Services',     icon: '🛠️', to: '/admin/services',     key: 'services' },
  { label: 'Experience',   icon: '🏢', to: '/admin/experience',   key: 'experience' },
  { label: 'Education',    icon: '🎓', to: '/admin/education',    key: 'education' },
  { label: 'Achievements', icon: '🏆', to: '/admin/achievements', key: 'achievements' },
  { label: 'Messages',     icon: '✉️', to: '/admin/messages',     key: 'messages' },
]

export default function Dashboard() {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      getAdminProjects(), getAdminSkills(), getAdminServices(),
      getAdminExperience(), getAdminEducation(), getAdminAchievements(), getMessages()
    ]).then(results => {
      const keys = ['projects','skills','services','experience','education','achievements','messages']
      const c = {}
      results.forEach((r, i) => { c[keys[i]] = r.status === 'fulfilled' ? r.value.length : 0 })
      setCounts(c)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Manage your portfolio content</p>
      </div>
      {loading
        ? <div className="loading-center"><div className="spinner" /></div>
        : (
          <div className={styles.grid}>
            {CARDS.map(card => (
              <Link key={card.key} to={card.to} className={styles.card}>
                <div className={styles.cardIcon}>{card.icon}</div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardCount}>{counts[card.key] ?? 0}</span>
                  <span className={styles.cardLabel}>{card.label}</span>
                </div>
                <span className={styles.cardArrow}>→</span>
              </Link>
            ))}
          </div>
        )
      }
      <div className={styles.quickLinks}>
        <h2 className={styles.qlTitle}>Quick Actions</h2>
        <div className={styles.qlGrid}>
          <Link to="/admin/profile" className="btn btn-outline">✏️ Edit Profile</Link>
          <Link to="/admin/projects" className="btn btn-outline">➕ Add Project</Link>
          <Link to="/admin/contact" className="btn btn-outline">📞 Update Contact</Link>
          <a href="/" target="_blank" className="btn btn-ghost">🌐 View Portfolio</a>
        </div>
      </div>
    </div>
  )
}
