import React, { useEffect, useState } from 'react'
import { getAdminProfile, updateAdminProfile, uploadFile } from '../api/admin'
import styles from './Admin.module.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function AdminProfile() {
  const [form, setForm]       = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [status, setStatus]   = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    getAdminProfile()
      .then(setForm)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const data = await uploadFile(file)
      setForm(f => ({ ...f, [field]: data.url }))
    } catch { alert('Upload failed') }
    finally { setUploading(false) }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      await updateAdminProfile(form)
      setStatus('success')
    } catch { setStatus('error') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Profile</h1>
      </div>
      <form onSubmit={onSubmit} className="card">
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" className="form-input" value={form.name || ''} onChange={onChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-input" value={form.email || ''} onChange={onChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input name="phone" className="form-input" value={form.phone || ''} onChange={onChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input name="location" className="form-input" value={form.location || ''} onChange={onChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Tagline</label>
          <input name="tagline" className="form-input" value={form.tagline || ''} onChange={onChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea name="bio" className="form-textarea" value={form.bio || ''} onChange={onChange} rows={5} />
        </div>
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Years Experience</label>
            <input name="years_experience" type="number" className="form-input" value={form.years_experience || ''} onChange={onChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Projects Count</label>
            <input name="projects_count" type="number" className="form-input" value={form.projects_count || ''} onChange={onChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Clients Count</label>
            <input name="clients_count" type="number" className="form-input" value={form.clients_count || ''} onChange={onChange} />
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Profile Image</label>
            <div className={styles.uploadArea}>
              <input type="file" accept="image/*" onChange={e => onUpload(e, 'profile_image')} disabled={uploading} />
              <p style={{color:'var(--color-text-muted)',fontSize:'0.85rem',marginTop:'8px'}}>
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </p>
              {form.profile_image && (
                <img src={`${BASE_URL}${form.profile_image}`} alt="Profile" className={styles.uploadPreview} />
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Resume / CV (PDF)</label>
            <div className={styles.uploadArea}>
              <input type="file" accept=".pdf" onChange={e => onUpload(e, 'resume_file')} disabled={uploading} />
              <p style={{color:'var(--color-text-muted)',fontSize:'0.85rem',marginTop:'8px'}}>
                {uploading ? 'Uploading...' : 'Click to upload PDF'}
              </p>
              {form.resume_file && (
                <p style={{fontSize:'0.85rem',marginTop:'8px',color:'var(--color-success)'}}>✅ CV uploaded: {form.resume_file}</p>
              )}
            </div>
          </div>
        </div>
        {status === 'success' && <p style={{color:'var(--color-success)',marginBottom:'16px'}}>✅ Profile saved!</p>}
        {status === 'error'   && <p style={{color:'var(--color-error)',marginBottom:'16px'}}>❌ Save failed.</p>}
        <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
