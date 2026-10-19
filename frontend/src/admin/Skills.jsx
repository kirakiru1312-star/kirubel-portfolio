import React from 'react'
import CrudPage from './CrudPage'
import { getAdminSkills, createSkill, updateSkill, deleteSkill } from '../api/admin'

const FIELDS = [
  { name: 'name',          label: 'Skill Name',  required: true },
  { name: 'category',      label: 'Category',    placeholder: 'Frontend, Backend, Tools...' },
  { name: 'proficiency',   label: 'Proficiency (0-100)', type: 'number', min: 0, max: 100, defaultValue: 80 },
  { name: 'icon',          label: 'Icon key',    placeholder: 'react, nodejs, python...' },
  { name: 'published',     label: 'Published',   type: 'checkbox', defaultValue: 1 },
  { name: 'display_order', label: 'Display Order', type: 'number', defaultValue: 0 },
]

const COLUMNS = [
  { header: 'Name',        render: i => i.name },
  { header: 'Category',    render: i => i.category || '—' },
  { header: 'Proficiency', render: i => `${i.proficiency}%` },
  { header: 'Status',      render: i => <span className={`badge ${i.published ? 'badge-success' : 'badge-warning'}`}>{i.published ? 'Published' : 'Hidden'}</span> },
]

export default function AdminSkills() {
  return <CrudPage
    title="Skills"
    fetchFn={getAdminSkills}
    createFn={createSkill}
    updateFn={updateSkill}
    deleteFn={deleteSkill}
    fields={FIELDS}
    columns={COLUMNS}
  />
}
