import React, { useEffect, useState } from 'react'
import { getProfile } from '../api/public'
import styles from './Hero.module.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function Hero() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.grid} />
      </div>
      <div className={`container ${styles.content}`}>
        <div className={styles.text}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            Available for work
          </div>
          <h1 className={styles.title}>
            Hi, I'm <span className={styles.accent}>{loading ? '...' : (profile?.name || 'Kirubel Gelaw')}</span>
          </h1>
          <p className={styles.tagline}>{loading ? '' : (profile?.tagline || 'Full-Stack Developer & Software Engineer')}</p>
          <p className={styles.desc}>{loading ? '' : (profile?.bio || '')}</p>
          <div className={styles.actions}>
            <a href="#projects" className="btn btn-primary">View My Work</a>
            {profile?.resume_file && (
              <a href={`${BASE_URL}${profile.resume_file}`} target="_blank" rel="noreferrer" className="btn btn-outline" download>
                Download CV
              </a>
            )}
            {!profile?.resume_file && (
              <a href="#contact" className="btn btn-outline">Get in Touch</a>
            )}
          </div>
          {profile && (
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{profile.years_experience}+</span>
                <span className={styles.statLabel}>Years Exp.</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>{profile.projects_count}+</span>
                <span className={styles.statLabel}>Projects</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>{profile.clients_count}+</span>
                <span className={styles.statLabel}>Clients</span>
              </div>
            </div>
          )}
        </div>
        <div className={styles.avatar}>
          {profile?.profile_image
            ? <img src={`${BASE_URL}${profile.profile_image}`} alt={profile.name} className={styles.avatarImg} />
            : <div className={styles.avatarPlaceholder}>
                <span>{(profile?.name || 'K').charAt(0)}</span>
              </div>
          }
          <div className={styles.avatarRing} aria-hidden="true" />
          <div className={styles.avatarDot1} aria-hidden="true" />
          <div className={styles.avatarDot2} aria-hidden="true" />
        </div>
      </div>
      <a href="#about" className={styles.scroll} aria-label="Scroll down">
        <span className={styles.scrollLine} />
      </a>
    </section>
  )
}
