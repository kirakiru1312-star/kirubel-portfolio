import React from 'react'
import CrudPage from './CrudPage'
import { getAdminExperience, createExperience, updateExperience, deleteExperience } from '../api/admin'

const FIELDS = [
  { name: 'company',       label: 'Company',       required: true },
  { name: 'position',      label: 'Position/Role', required: true },
  { name: 'location',      label: 'Location' },
  { name: 'start_date',    label: 'Start Date',    placeholder: '2023-01' },
  { name: 'end_date',      label: 'End Date',      placeholder: '2024-12 (leave blank if current)' },
  { name: 'current_job',   label: 'Current Job',   type: 'checkbox', defaultValue: 0 },
  { name: 'description',   label: 'Description',   type: 'textarea' },
  { name: 'published',     label: 'Published',     type: 'checkbox', defaultValue: 1 },
  { name: 'display_order', label: 'Display Order', type: 'number',   defaultValue: 0 },
]

const COLUMNS = [
  { header: 'Position', render: i => i.position },
  { header: 'Company',  render: i => i.company },
  { header: 'Period',   render: i => `${i.start_date || ''} — ${i.current_job ? 'Present' : (i.end_date || '')}` },
  { header: 'Status',   render: i => <span className={`badge ${i.published ? 'badge-success' : 'badge-warning'}`}>{i.published ? 'Published' : 'Hidden'}</span> },
]

export default function AdminExperience() {
  return <CrudPage
    title="Experience"
    fetchFn={getAdminExperience}
    createFn={createExperience}
    updateFn={updateExperience}
    deleteFn={deleteExperience}
    fields={FIELDS}
    columns={COLUMNS}
  />
}
