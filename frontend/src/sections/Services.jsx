import React, { useEffect, useState, useRef } from 'react'
import { getServices } from '../api/public'
import styles from './Services.module.css'

const ICONS = {
  code:    '💻',
  server:  '🖥️',
  palette: '🎨',
  mobile:  '📱',
  cloud:   '☁️',
  data:    '📊',
  security:'🔒',
  default: '⚡',
}

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => setError('Failed to load services'))
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
    <section id="services" className={`section ${styles.bg}`} ref={ref}>
      <div className="container">
        <div className="section-header fade-in">
          <p className={styles.overline}>What I Offer</p>
          <h2 className="section-title">Services</h2>
          <p className="section-subtitle">Ways I can help you build great products</p>
        </div>
        {loading && <div className="loading-center"><div className="spinner" /></div>}
        {error && <p style={{textAlign:'center',color:'var(--color-error)'}}>{error}</p>}
        {!loading && !error && (
          <div className="grid-3">
            {services.map((service, i) => (
              <div key={service.id} className={`card ${styles.card} fade-in`} style={{animationDelay:`${i*0.1}s`}}>
                <div className={styles.icon}>{ICONS[service.icon] || ICONS.default}</div>
                <h3 className={styles.title}>{service.title}</h3>
                <p className={styles.desc}>{service.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
