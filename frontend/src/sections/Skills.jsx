import React, { useEffect, useState, useRef } from 'react'
import { getSkills } from '../api/public'
import styles from './Skills.module.css'

export default function Skills() {
  const [skills, setSkills]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .catch(() => setError('Failed to load skills'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    )
    ref.current?.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [loading])

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <section id="skills" className={`section ${styles.section}`} ref={ref}>
      <div className="container">
        <div className="section-header fade-in">
          <p className={styles.overline}>What I Know</p>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">Technologies and tools I use to bring ideas to life</p>
        </div>
        {loading && <div className="loading-center"><div className="spinner" /></div>}
        {error && <p style={{textAlign:'center', color:'var(--color-error)'}}>{error}</p>}
        {!loading && !error && (
          <div className={styles.categories}>
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className={`${styles.category} fade-in`}>
                <h3 className={styles.categoryTitle}>{category}</h3>
                <div className={styles.skillList}>
                  {items.map(skill => (
                    <div key={skill.id} className={styles.skillItem}>
                      <div className={styles.skillHeader}>
                        <span className={styles.skillName}>{skill.name}</span>
                        <span className={styles.skillPct}>{skill.proficiency}%</span>
                      </div>
                      <div className={styles.bar}>
                        <div
                          className={styles.fill}
                          style={{ '--width': `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
