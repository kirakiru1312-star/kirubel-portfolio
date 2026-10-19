import React, { useEffect, useState } from 'react'
import { getMessages, markMessageRead, deleteMessage } from '../api/admin'
import styles from './Admin.module.css'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getMessages()
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const open = async (msg) => {
    setSelected(msg)
    if (!msg.read) {
      try {
        const updated = await markMessageRead(msg.id)
        setMessages(m => m.map(x => x.id === updated.id ? updated : x))
        setSelected(updated)
      } catch (e) { console.error(e) }
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return
    await deleteMessage(id)
    setMessages(m => m.filter(x => x.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Messages {unread > 0 && <span className="badge badge-warning" style={{marginLeft:8}}>{unread} unread</span>}</h1>
      </div>
      {loading && <div className="loading-center"><div className="spinner" /></div>}
      {!loading && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:'24px',alignItems:'start'}}>
          <div className="card" style={{padding:0}}>
            <table>
              <thead><tr><th>From</th><th>Subject</th><th>Date</th></tr></thead>
              <tbody>
                {messages.length === 0
                  ? <tr><td colSpan={3} style={{textAlign:'center',padding:'32px',color:'var(--color-text-muted)'}}>No messages yet.</td></tr>
                  : messages.map(msg => (
                      <tr key={msg.id} style={{cursor:'pointer',background: selected?.id===msg.id ? 'rgba(79,142,247,0.07)':''}} onClick={() => open(msg)}>
                        <td>
                          {!msg.read && <span style={{color:'var(--color-accent)',marginRight:6,fontWeight:700}}>●</span>}
                          <span style={{fontWeight: msg.read ? 400 : 600}}>{msg.name}</span>
                        </td>
                        <td style={{color:'var(--color-text-muted)',fontSize:'0.85rem'}}>{msg.subject || '(no subject)'}</td>
                        <td style={{color:'var(--color-text-dim)',fontSize:'0.8rem'}}>{new Date(msg.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
          {selected
            ? <div className="card">
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px'}}>
                  <div>
                    <h3 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'4px'}}>{selected.subject || '(no subject)'}</h3>
                    <p style={{color:'var(--color-text-muted)',fontSize:'0.9rem'}}>From: <strong>{selected.name}</strong> &lt;{selected.email}&gt;</p>
                    <p style={{color:'var(--color-text-dim)',fontSize:'0.8rem'}}>{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <button className={styles.deleteBtn} onClick={() => remove(selected.id)}>🗑️ Delete</button>
                </div>
                <div style={{borderTop:'1px solid var(--color-border)',paddingTop:'16px',color:'var(--color-text-muted)',lineHeight:1.8}}>
                  {selected.message}
                </div>
                <div style={{marginTop:'16px'}}>
                  <a href={`mailto:${selected.email}`} className="btn btn-outline" style={{fontSize:'0.85rem'}}>Reply via Email →</a>
                </div>
              </div>
            : <div className="card" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'200px'}}>
                <p style={{color:'var(--color-text-muted)'}}>Select a message to read it</p>
              </div>
          }
        </div>
      )}
    </div>
  )
}
