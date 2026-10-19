import React from 'react'
import CrudPage from './CrudPage'
import { getAdminServices, createService, updateService, deleteService } from '../api/admin'

const FIELDS = [
  { name: 'title',         label: 'Service Title', required: true },
  { name: 'description',   label: 'Description',   type: 'textarea' },
  { name: 'icon',          label: 'Icon key',       placeholder: 'code, server, palette...' },
  { name: 'published',     label: 'Published',      type: 'checkbox', defaultValue: 1 },
  { name: 'display_order', label: 'Display Order',  type: 'number',   defaultValue: 0 },
]

const COLUMNS = [
  { header: 'Title',  render: i => i.title },
  { header: 'Icon',   render: i => i.icon || '—' },
  { header: 'Status', render: i => <span className={`badge ${i.published ? 'badge-success' : 'badge-warning'}`}>{i.published ? 'Published' : 'Hidden'}</span> },
]

export default function AdminServices() {
  return <CrudPage
    title="Services"
    fetchFn={getAdminServices}
    createFn={createService}
    updateFn={updateService}
    deleteFn={deleteService}
    fields={FIELDS}
    columns={COLUMNS}
  />
}
