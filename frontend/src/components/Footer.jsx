import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.brand}>
            <span className={styles.logoIcon}>K</span>
            <span className={styles.name}>Kirubel Gelaw</span>
          </div>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Kirubel Gelaw.
          </p>
          <a href="#hero" className={styles.backTop} aria-label="Back to top">↑</a>
        </div>
      </div>
    </footer>
  )
}
