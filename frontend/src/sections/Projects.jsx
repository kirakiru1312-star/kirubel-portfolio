import React, { useEffect, useState, useRef } from 'react'
import { getProjects } from '../api/public'
import styles from './Projects.module.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [filter, setFilter]     = useState('all')
  const ref = useRef(null)

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setError('Failed to load projects'))
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

  const displayed = filter === 'featured'
    ? projects.filter(p => p.featured)
    : projects

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <div className="section-header fade-in">
          <p className={styles.overline}>My Work</p>
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">A selection of projects I've built and shipped</p>
          <div className={styles.filters}>
            <button className={`${styles.filterBtn} ${filter==='all' ? styles.active : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`${styles.filterBtn} ${filter==='featured' ? styles.active : ''}`} onClick={() => setFilter('featured')}>Featured</button>
          </div>
        </div>
        {loading && <div className="loading-center"><div className="spinner" /></div>}
        {error && <p style={{textAlign:'center',color:'var(--color-error)'}}>{error}</p>}
        {!loading && !error && displayed.length === 0 && (
          <p style={{textAlign:'center',color:'var(--color-text-muted)'}}>No projects found.</p>
        )}
        {!loading && !error && (
          <div className={styles.grid}>
            {displayed.map(project => (
              <div key={project.id} className={`${styles.card} fade-in`}>
                <div className={styles.imgWrap}>
                  {project.image
                    ? <img src={`${BASE_URL}${project.image}`} alt={project.title} className={styles.img} />
                    : <div className={styles.imgPlaceholder}><span>{'</>'}</span></div>
                  }
                  {project.featured === 1 && <span className={styles.featuredBadge}>Featured</span>}
                </div>
                <div className={styles.body}>
                  <h3 className={styles.title}>{project.title}</h3>
                  <p className={styles.desc}>{project.description}</p>
                  {project.tech_stack && (
                    <div className={styles.tags}>
                      {project.tech_stack.split(',').map(t => (
                        <span key={t} className="tag">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div className={styles.links}>
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className={`btn btn-ghost ${styles.linkBtn}`}>
                        GitHub →
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className={`btn btn-primary ${styles.linkBtn}`}>
                        Live Demo →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
