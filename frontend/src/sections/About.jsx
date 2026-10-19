import React, { useEffect, useState, useRef } from 'react'
import { getProfile } from '../api/public'
import styles from './About.module.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function About() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading]  = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    getProfile().then(setProfile).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    )
    ref.current?.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [loading])

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <div className={styles.layout}>
          <div className={`${styles.imageWrap} fade-in`}>
            {profile?.profile_image
              ? <img src={`${BASE_URL}${profile.profile_image}`} alt={profile.name} className={styles.img} />
              : <div className={styles.imgPlaceholder}><span>{(profile?.name || 'K').charAt(0)}</span></div>
            }
            <div className={styles.card1}>
              <span className={styles.cardNum}>{profile?.years_experience || 3}+</span>
              <span className={styles.cardLabel}>Years of Experience</span>
            </div>
            <div className={styles.card2}>
              <span className={styles.cardNum}>{profile?.projects_count || 20}+</span>
              <span className={styles.cardLabel}>Projects Completed</span>
            </div>
          </div>
          <div className={styles.text}>
            <div className="fade-in">
              <p className={styles.overline}>About Me</p>
              <h2 className="section-title" style={{textAlign:'left', marginBottom: '20px'}}>
                Passionate Developer<br />Based in {profile?.location || 'Ethiopia'}
              </h2>
            </div>
            <p className={`${styles.bio} fade-in`}>
              {loading ? 'Loading...' : (profile?.bio || '')}
            </p>
            <div className={`${styles.details} fade-in`}>
              {profile?.email && (
                <div className={styles.detail}>
                  <span className={styles.detailIcon}>✉</span>
                  <span>{profile.email}</span>
                </div>
              )}
              {profile?.phone && (
                <div className={styles.detail}>
                  <span className={styles.detailIcon}>📞</span>
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile?.location && (
                <div className={styles.detail}>
                  <span className={styles.detailIcon}>📍</span>
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
            <div className="fade-in">
              <a href="#contact" className="btn btn-primary">Let's Talk</a>
              {profile?.resume_file && (
                <a href={`${BASE_URL}${profile.resume_file}`} download className="btn btn-ghost" style={{marginLeft:'12px'}}>
                  Download CV
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
