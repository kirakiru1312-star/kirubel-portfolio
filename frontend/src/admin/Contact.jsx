import React, { useEffect, useState } from 'react'
import {
  getAdminContact, updateAdminContact,
  getAdminSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink
} from '../api/admin'
import styles from './Admin.module.css'

export default function AdminContact() {
  const [contact, setContact]   = useState({})
  const [social, setSocial]     = useState([])
  const [saving, setSaving]     = useState(false)
  const [status, setStatus]     = useState(null)
  const [loading, setLoading]   = useState(true)
  // Social form
  const [showSocialForm, setShowSocialForm] = useState(false)
  const [editingSocial, setEditingSocial]   = useState(null)
  const [socialForm, setSocialForm]         = useState({ platform: '', url: '', icon: '', published: 1 })

  useEffect(() => {
    Promise.all([getAdminContact(), getAdminSocialLinks()])
      .then(([c, s]) => { setContact(c); setSocial(s) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const onContactChange = e => setContact(c => ({ ...c, [e.target.name]: e.target.value }))
  const onSocialChange  = e => setSocialForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const saveContact = async (e) => {
    e.preventDefault()
    setSaving(true); setStatus(null)
    try { await updateAdminContact(contact); setStatus('success') }
    catch { setStatus('error') }
    finally { setSaving(false) }
  }

  const openSocialCreate = () => { setSocialForm({ platform:'',url:'',icon:'',published:1 }); setEditingSocial(null); setShowSocialForm(true) }
  const openSocialEdit   = (l) => { setSocialForm({ platform:l.platform,url:l.url,icon:l.icon||'',published:l.published }); setEditingSocial(l); setShowSocialForm(true) }

  const saveSocial = async (e) => {
    e.preventDefault()
    try {
      if (editingSocial) {
        const updated = await updateSocialLink(editingSocial.id, socialForm)
        setSocial(s => s.map(l => l.id === updated.id ? updated : l))
      } else {
        const created = await createSocialLink(socialForm)
        setSocial(s => [...s, created])
      }
      setShowSocialForm(false)
    } catch { alert('Save failed') }
  }

  const removeSocial = async (id) => {
    if (!window.confirm('Remove this social link?')) return
    await deleteSocialLink(id)
    setSocial(s => s.filter(l => l.id !== id))
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <div className={styles.pageHeader}><h1 className={styles.pageTitle}>Contact Settings</h1></div>
      <form onSubmit={saveContact} className="card" style={{marginBottom:'24px'}}>
        <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'20px'}}>Contact Information</h2>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-input" value={contact.email||''} onChange={onContactChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input name="phone" className="form-input" value={contact.phone||''} onChange={onContactChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input name="address" className="form-input" value={contact.address||''} onChange={onContactChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Working Hours</label>
            <input name="working_hours" className="form-input" value={contact.working_hours||''} onChange={onContactChange} />
          </div>
        </div>
        {status==='success' && <p style={{color:'var(--color-success)',marginBottom:'12px'}}>✅ Saved!</p>}
        {status==='error'   && <p style={{color:'var(--color-error)',marginBottom:'12px'}}>❌ Save failed.</p>}
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Contact'}</button>
      </form>

      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
          <h2 style={{fontSize:'1.1rem',fontWeight:700}}>Social Links</h2>
          <button className="btn btn-primary" onClick={openSocialCreate}>+ Add Link</button>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>Platform</th><th>URL</th><th>Actions</th></tr></thead>
            <tbody>
              {social.length === 0
                ? <tr><td colSpan={3} style={{textAlign:'center',color:'var(--color-text-muted)',padding:'24px'}}>No social links yet.</td></tr>
                : social.map(link => (
                    <tr key={link.id}>
                      <td>{link.platform}</td>
                      <td><a href={link.url} target="_blank" rel="noreferrer" style={{color:'var(--color-accent)'}}>{link.url}</a></td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button className={styles.editBtn} onClick={() => openSocialEdit(link)}>✏️ Edit</button>
                          <button className={styles.deleteBtn} onClick={() => removeSocial(link.id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {showSocialForm && (
        <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && setShowSocialForm(false)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingSocial ? 'Edit Social Link' : 'Add Social Link'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowSocialForm(false)}>×</button>
            </div>
            <form onSubmit={saveSocial}>
              <div className="form-group"><label className="form-label">Platform *</label><input name="platform" className="form-input" value={socialForm.platform} onChange={onSocialChange} required placeholder="GitHub, LinkedIn..." /></div>
              <div className="form-group"><label className="form-label">URL *</label><input name="url" type="url" className="form-input" value={socialForm.url} onChange={onSocialChange} required /></div>
              <div className="form-group"><label className="form-label">Icon key</label><input name="icon" className="form-input" value={socialForm.icon} onChange={onSocialChange} placeholder="github, linkedin..." /></div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowSocialForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
