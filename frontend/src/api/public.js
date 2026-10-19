import client from './client'

export const getProfile      = () => client.get('/api/public/profile').then(r => r.data)
export const getProjects     = () => client.get('/api/public/projects').then(r => r.data)
export const getSkills       = () => client.get('/api/public/skills').then(r => r.data)
export const getServices     = () => client.get('/api/public/services').then(r => r.data)
export const getExperience   = () => client.get('/api/public/experience').then(r => r.data)
export const getEducation    = () => client.get('/api/public/education').then(r => r.data)
export const getAchievements = () => client.get('/api/public/achievements').then(r => r.data)
export const getContact      = () => client.get('/api/public/contact').then(r => r.data)
export const sendMessage     = (data) => client.post('/api/public/messages', data).then(r => r.data)
