import React, { useEffect, useState } from 'react'
import styles from './Admin.module.css'

/**
 * Generic CRUD page component.
 * Props:
 *   title       - Page title
 *   fetchFn     - () => Promise<array>
 *   createFn    - (data) => Promise<item>
 *   updateFn    - (id, data) => Promise<item>
 *   deleteFn    - (id) => Promise<void>
 *   fields      - Array of { name, label, type, required, options (for select), multiline }
 *   columns     - Array of { header, render: (item) => ReactNode }
 */
export default function CrudPage({ title, fetchFn, createFn, updateFn, deleteFn, fields, columns }) {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]   = useState(null) // null = create, object = edit
  const [formData, setFormData] = useState({})
  const [saving, setSaving]     = useState(false)
  const [formError, setFormError] = useState('')

  const load = () => {
    setLoading(true)
    fetchFn()
      .then(setItems)
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    const empty = {}
    fields.forEach(f => { empty[f.name] = f.defaultValue ?? '' })
    setEditing(null)
    setFormData(empty)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (item) => {
    const data = {}
    fields.forEach(f => { data[f.name] = item[f.name] ?? f.defaultValue ?? '' })
    setEditing(item)
    setFormData(data)
    setFormError('')
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      if (editing) {
        const updated = await updateFn(editing.id, formData)
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
      } else {
        const created = await createFn(formData)
        setItems(prev => [...prev, created])
      }
      closeModal()
    } catch (err) {
      setFormError(err.response?.data?.error || 'Save failed. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title || item.name || item.company || item.institution || 'this item'}"?`)) return
    try {
      await deleteFn(item.id)
      setItems(prev => prev.filter(i => i.id !== item.id))
    } catch {
      alert('Delete failed.')
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add New</button>
      </div>

      {loading && <div className="loading-center"><div className="spinner" /></div>}
      {error && <p style={{color:'var(--color-error)'}}>{error}</p>}

      {!loading && !error && (
        <div className={`card ${styles.tableWrap}`} style={{padding:0}}>
          <table>
            <thead>
              <tr>
                {columns.map(col => <th key={col.header}>{col.header}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0
                ? <tr><td colSpan={columns.length + 1} style={{textAlign:'center',color:'var(--color-text-muted)',padding:'32px'}}>No items yet. Add your first one!</td></tr>
                : items.map(item => (
                    <tr key={item.id}>
                      {columns.map(col => <td key={col.header}>{col.render(item)}</td>)}
                      <td>
                        <div className={styles.actionBtns}>
                          <button className={styles.editBtn} onClick={() => openEdit(item)}>✏️ Edit</button>
                          <button className={styles.deleteBtn} onClick={() => onDelete(item)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editing ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}</h2>
              <button className={styles.closeBtn} onClick={closeModal}>×</button>
            </div>
            <form onSubmit={onSubmit}>
              {fields.map(field => (
                <div key={field.name} className="form-group">
                  <label className="form-label" htmlFor={`field-${field.name}`}>
                    {field.label}{field.required && ' *'}
                  </label>
                  {field.type === 'textarea'
                    ? <textarea id={`field-${field.name}`} name={field.name} className="form-textarea" value={formData[field.name] ?? ''} onChange={onChange} required={field.required} rows={4} />
                    : field.type === 'select'
                    ? <select id={`field-${field.name}`} name={field.name} className="form-select" value={formData[field.name] ?? ''} onChange={onChange}>
                        {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    : field.type === 'checkbox'
                    ? <label className={styles.toggle}>
                        <input type="checkbox" name={field.name} checked={!!formData[field.name]} onChange={onChange} />
                        <span className={styles.toggleSlider} />
                      </label>
                    : <input id={`field-${field.name}`} type={field.type || 'text'} name={field.name} className="form-input" value={formData[field.name] ?? ''} onChange={onChange} required={field.required} placeholder={field.placeholder} min={field.min} max={field.max} />
                  }
                </div>
              ))}
              {formError && <p className="form-error" style={{marginBottom:'12px'}}>{formError}</p>}
              <div className={styles.modalFooter}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
