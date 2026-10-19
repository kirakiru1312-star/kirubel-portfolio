import React from 'react'
import CrudPage from './CrudPage'
import { getAdminAchievements, createAchievement, updateAchievement, deleteAchievement } from '../api/admin'

const FIELDS = [
  { name: 'title',         label: 'Title',         required: true },
  { name: 'description',   label: 'Description',   type: 'textarea' },
  { name: 'date',          label: 'Date',           placeholder: '2023-11' },
  { name: 'icon',          label: 'Icon key',       placeholder: 'trophy, github, cloud...' },
  { name: 'published',     label: 'Published',      type: 'checkbox', defaultValue: 1 },
  { name: 'display_order', label: 'Display Order',  type: 'number',   defaultValue: 0 },
]

const COLUMNS = [
  { header: 'Title',  render: i => i.title },
  { header: 'Date',   render: i => i.date || '—' },
  { header: 'Status', render: i => <span className={`badge ${i.published ? 'badge-success' : 'badge-warning'}`}>{i.published ? 'Published' : 'Hidden'}</span> },
]

export default function AdminAchievements() {
  return <CrudPage
    title="Achievements"
    fetchFn={getAdminAchievements}
    createFn={createAchievement}
    updateFn={updateAchievement}
    deleteFn={deleteAchievement}
    fields={FIELDS}
    columns={COLUMNS}
  />
}
