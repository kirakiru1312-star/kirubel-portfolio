import React, { useEffect, useState, useRef } from 'react'
import { getExperience } from '../api/public'
import styles from './Timeline.module.css'

export default function Experience() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    getExperience()
      .then(setItems)
      .catch(() => setError('Failed to load experience'))
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

  const fmt = (d) => {
    if (!d) return ''
    const [year, month] = d.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return month ? `${months[parseInt(month, 10) - 1]} ${year}` : year
  }

  return (
    <section id="experience" className={`section ${styles.bg}`} ref={ref}>
      <div className="container">
        <div className="section-header fade-in">
          <p className={styles.overline}>My Journey</p>
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">My professional path and the teams I've been part of</p>
        </div>
        {loading && <div className="loading-center"><div className="spinner" /></div>}
        {error && <p style={{textAlign:'center',color:'var(--color-error)'}}>{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p style={{textAlign:'center',color:'var(--color-text-muted)'}}>No experience listed yet.</p>
        )}
        {!loading && !error && (
          <div className={styles.timeline}>
            {items.map((item, i) => (
              <div key={item.id} className={`${styles.item} fade-in`} style={{animationDelay:`${i*0.1}s`}}>
                <div className={styles.dot} />
                <div className={styles.card}>
                  <div className={styles.header}>
                    <div>
                      <h3 className={styles.role}>{item.position}</h3>
                      <p className={styles.org}>{item.company}</p>
                      {item.location && <p className={styles.loc}>📍 {item.location}</p>}
                    </div>
                    <span className={styles.period}>
                      {fmt(item.start_date)} — {item.current_job ? 'Present' : fmt(item.end_date)}
                      {item.current_job === 1 && <span className="badge badge-success" style={{marginLeft:8}}>Current</span>}
                    </span>
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
