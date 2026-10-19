import React from 'react'
import CrudPage from './CrudPage'
import { getAdminProjects, createProject, updateProject, deleteProject } from '../api/admin'

const FIELDS = [
  { name: 'title',            label: 'Title',            required: true },
  { name: 'description',      label: 'Short Description', type: 'textarea' },
  { name: 'long_description', label: 'Long Description',  type: 'textarea' },
  { name: 'tech_stack',       label: 'Tech Stack (comma-separated)', placeholder: 'React, Node.js, ...' },
  { name: 'github_url',       label: 'GitHub URL',       type: 'url' },
  { name: 'live_url',         label: 'Live URL',          type: 'url' },
  { name: 'image',            label: 'Image Path (/uploads/...)' },
  { name: 'featured',         label: 'Featured',          type: 'checkbox', defaultValue: 0 },
  { name: 'published',        label: 'Published',         type: 'checkbox', defaultValue: 1 },
  { name: 'display_order',    label: 'Display Order',     type: 'number',   defaultValue: 0 },
]

const COLUMNS = [
  { header: 'Title',    render: i => i.title },
  { header: 'Tech',     render: i => <small style={{color:'var(--color-text-muted)'}}>{i.tech_stack}</small> },
  { header: 'Featured', render: i => i.featured ? '⭐' : '—' },
  { header: 'Status',   render: i => <span className={`badge ${i.published ? 'badge-success' : 'badge-warning'}`}>{i.published ? 'Published' : 'Draft'}</span> },
]

export default function AdminProjects() {
  return <CrudPage
    title="Projects"
    fetchFn={getAdminProjects}
    createFn={createProject}
    updateFn={updateProject}
    deleteFn={deleteProject}
    fields={FIELDS}
    columns={COLUMNS}
  />
}
