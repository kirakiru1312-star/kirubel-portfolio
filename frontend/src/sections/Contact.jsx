import React, { useEffect, useState, useRef } from 'react'
import { getContact, sendMessage } from '../api/public'
import styles from './Contact.module.css'

export default function Contact() {
  const [contactData, setContactData] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'success' | 'error'
  const ref = useRef(null)

  useEffect(() => {
    getContact().then(setContactData).catch(console.error)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
      { threshold: 0.1 }
    )
    ref.current?.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [contactData])

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendMessage(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const social = contactData?.social_links || []
  const contact = contactData?.contact || {}

  const SOCIAL_ICONS = {
    github: '⚡', linkedin: '💼', twitter: '🐦', instagram: '📸',
    facebook: '📘', youtube: '▶️', default: '🔗'
  }

  return (
    <section id="contact" className={`section ${styles.bg}`} ref={ref}>
      <div className="container">
        <div className="section-header fade-in">
          <p className={styles.overline}>Get in Touch</p>
          <h2 className="section-title">Contact Me</h2>
          <p className="section-subtitle">Have a project in mind? I'd love to hear from you.</p>
        </div>
        <div className={styles.layout}>
          <div className={`${styles.info} fade-in`}>
            <h3 className={styles.infoTitle}>Let's work together</h3>
            <p className={styles.infoDesc}>I'm always open to new opportunities, collaborations, and interesting projects.</p>
            <div className={styles.details}>
              {contact.email && (
                <a href={`mailto:${contact.email}`} className={styles.detail}>
                  <span className={styles.detailIcon}>✉</span>
                  <div><span className={styles.detailLabel}>Email</span><span className={styles.detailValue}>{contact.email}</span></div>
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className={styles.detail}>
                  <span className={styles.detailIcon}>📞</span>
                  <div><span className={styles.detailLabel}>Phone</span><span className={styles.detailValue}>{contact.phone}</span></div>
                </a>
              )}
              {contact.address && (
                <div className={styles.detail}>
                  <span className={styles.detailIcon}>📍</span>
                  <div><span className={styles.detailLabel}>Location</span><span className={styles.detailValue}>{contact.address}</span></div>
                </div>
              )}
              {contact.working_hours && (
                <div className={styles.detail}>
                  <span className={styles.detailIcon}>🕐</span>
                  <div><span className={styles.detailLabel}>Working Hours</span><span className={styles.detailValue}>{contact.working_hours}</span></div>
                </div>
              )}
            </div>
            {social.length > 0 && (
              <div className={styles.social}>
                <p className={styles.socialTitle}>Follow me</p>
                <div className={styles.socialLinks}>
                  {social.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className={styles.socialLink} aria-label={link.platform}>
                      {SOCIAL_ICONS[link.platform?.toLowerCase()] || SOCIAL_ICONS.default}
                      <span>{link.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <form className={`${styles.form} fade-in`} onSubmit={onSubmit} noValidate>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Name *</label>
                <input id="contact-name" name="name" type="text" className="form-input" value={form.name} onChange={onChange} required placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email *</label>
                <input id="contact-email" name="email" type="email" className="form-input" value={form.email} onChange={onChange} required placeholder="your@email.com" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-subject">Subject</label>
              <input id="contact-subject" name="subject" type="text" className="form-input" value={form.subject} onChange={onChange} placeholder="Project idea, collaboration..." />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">Message *</label>
              <textarea id="contact-message" name="message" className="form-textarea" value={form.message} onChange={onChange} required placeholder="Tell me about your project..." rows={6} />
            </div>
            {status === 'success' && <p className={styles.successMsg}>✅ Message sent! I'll get back to you soon.</p>}
            {status === 'error' && <p className={styles.errorMsg}>❌ Something went wrong. Please try again.</p>}
            <button type="submit" className="btn btn-primary" disabled={status === 'sending'} style={{width:'100%', justifyContent:'center'}}>
              {status === 'sending' ? 'Sending...' : 'Send Message →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
