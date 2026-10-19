import React, { useEffect, useState, useRef } from 'react'
import { getEducation } from '../api/public'
import styles from './Timeline.module.css'

export default function Education() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    getEducation()
      .then(setItems)
      .catch(() => setError('Failed to load education'))
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

  return (
    <section id="education" className="section" ref={ref}>
      <div className="container">
        <div className="section-header fade-in">
          <p className={styles.overline}>Academic Background</p>
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">My academic qualifications and learning journey</p>
        </div>
        {loading && <div className="loading-center"><div className="spinner" /></div>}
        {error && <p style={{textAlign:'center',color:'var(--color-error)'}}>{error}</p>}
        {!loading && !error && (
          <div className={styles.timeline}>
            {items.map((item, i) => (
              <div key={item.id} className={`${styles.item} fade-in`} style={{animationDelay:`${i*0.1}s`}}>
                <div className={styles.dot} />
                <div className={styles.card}>
                  <div className={styles.header}>
                    <div>
                      <h3 className={styles.role}>{item.degree} {item.field ? `in ${item.field}` : ''}</h3>
                      <p className={styles.org}>{item.institution}</p>
                      {item.gpa && <p className={styles.loc}>GPA: {item.gpa}</p>}
                    </div>
                    <span className={styles.period}>{item.start_date} — {item.end_date || 'Present'}</span>
                  </div>
                  {item.description && <p className={styles.desc}>{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
