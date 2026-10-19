import React from 'react'
import CrudPage from './CrudPage'
import { getAdminEducation, createEducation, updateEducation, deleteEducation } from '../api/admin'

const FIELDS = [
  { name: 'institution',   label: 'Institution',   required: true },
  { name: 'degree',        label: 'Degree',        required: true, placeholder: 'Bachelor of Science' },
  { name: 'field',         label: 'Field of Study', placeholder: 'Computer Science' },
  { name: 'gpa',           label: 'GPA' },
  { name: 'start_date',    label: 'Start Year',    placeholder: '2020' },
  { name: 'end_date',      label: 'End Year',      placeholder: '2024' },
  { name: 'description',   label: 'Description',   type: 'textarea' },
  { name: 'published',     label: 'Published',     type: 'checkbox', defaultValue: 1 },
  { name: 'display_order', label: 'Display Order', type: 'number',   defaultValue: 0 },
]

const COLUMNS = [
  { header: 'Degree',      render: i => `${i.degree}${i.field ? ' in ' + i.field : ''}` },
  { header: 'Institution', render: i => i.institution },
  { header: 'Period',      render: i => `${i.start_date || ''} — ${i.end_date || 'Present'}` },
  { header: 'Status',      render: i => <span className={`badge ${i.published ? 'badge-success' : 'badge-warning'}`}>{i.published ? 'Published' : 'Hidden'}</span> },
]

export default function AdminEducation() {
  return <CrudPage
    title="Education"
    fetchFn={getAdminEducation}
    createFn={createEducation}
    updateFn={updateEducation}
    deleteFn={deleteEducation}
    fields={FIELDS}
    columns={COLUMNS}
  />
}
