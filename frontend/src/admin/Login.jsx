import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin } from '../api/admin'
import styles from './Admin.module.css'

export default function AdminLogin() {
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }           = useAuth()
  const navigate            = useNavigate()

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiLogin(form)
      login(data.token, data.user)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <span className={styles.logoIcon}>K</span>
          <h1>Admin Login</h1>
          <p>Portfolio Management System</p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input id="username" name="username" type="text" className="form-input" value={form.username} onChange={onChange} required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="form-input" value={form.password} onChange={onChange} required />
          </div>
          {error && <p className="form-error" style={{marginBottom:'16px'}}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{width:'100%', justifyContent:'center'}}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        <p className={styles.backLink}><a href="/">← Back to Portfolio</a></p>
      </div>
    </div>
  )
}
