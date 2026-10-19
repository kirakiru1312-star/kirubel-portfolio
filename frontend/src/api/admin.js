import client from './client'

// Auth
export const login = (credentials) => client.post('/api/auth/login', credentials).then(r => r.data)

// Profile
export const getAdminProfile    = ()     => client.get('/api/admin/profile').then(r => r.data)
export const updateAdminProfile = (data) => client.put('/api/admin/profile', data).then(r => r.data)

// Projects
export const getAdminProjects    = ()          => client.get('/api/admin/projects').then(r => r.data)
export const createProject       = (data)      => client.post('/api/admin/projects', data).then(r => r.data)
export const updateProject       = (id, data)  => client.put(`/api/admin/projects/${id}`, data).then(r => r.data)
export const deleteProject       = (id)        => client.delete(`/api/admin/projects/${id}`).then(r => r.data)

// Skills
export const getAdminSkills  = ()         => client.get('/api/admin/skills').then(r => r.data)
export const createSkill     = (data)     => client.post('/api/admin/skills', data).then(r => r.data)
export const updateSkill     = (id, data) => client.put(`/api/admin/skills/${id}`, data).then(r => r.data)
export const deleteSkill     = (id)       => client.delete(`/api/admin/skills/${id}`).then(r => r.data)

// Services
export const getAdminServices  = ()         => client.get('/api/admin/services').then(r => r.data)
export const createService     = (data)     => client.post('/api/admin/services', data).then(r => r.data)
export const updateService     = (id, data) => client.put(`/api/admin/services/${id}`, data).then(r => r.data)
export const deleteService     = (id)       => client.delete(`/api/admin/services/${id}`).then(r => r.data)

// Experience
export const getAdminExperience  = ()         => client.get('/api/admin/experience').then(r => r.data)
export const createExperience    = (data)     => client.post('/api/admin/experience', data).then(r => r.data)
export const updateExperience    = (id, data) => client.put(`/api/admin/experience/${id}`, data).then(r => r.data)
export const deleteExperience    = (id)       => client.delete(`/api/admin/experience/${id}`).then(r => r.data)

// Education
export const getAdminEducation  = ()         => client.get('/api/admin/education').then(r => r.data)
export const createEducation    = (data)     => client.post('/api/admin/education', data).then(r => r.data)
export const updateEducation    = (id, data) => client.put(`/api/admin/education/${id}`, data).then(r => r.data)
export const deleteEducation    = (id)       => client.delete(`/api/admin/education/${id}`).then(r => r.data)

// Achievements
export const getAdminAchievements  = ()         => client.get('/api/admin/achievements').then(r => r.data)
export const createAchievement     = (data)     => client.post('/api/admin/achievements', data).then(r => r.data)
export const updateAchievement     = (id, data) => client.put(`/api/admin/achievements/${id}`, data).then(r => r.data)
export const deleteAchievement     = (id)       => client.delete(`/api/admin/achievements/${id}`).then(r => r.data)

// Social Links
export const getAdminSocialLinks  = ()         => client.get('/api/admin/social_links').then(r => r.data)
export const createSocialLink     = (data)     => client.post('/api/admin/social_links', data).then(r => r.data)
export const updateSocialLink     = (id, data) => client.put(`/api/admin/social_links/${id}`, data).then(r => r.data)
export const deleteSocialLink     = (id)       => client.delete(`/api/admin/social_links/${id}`).then(r => r.data)

// Contact
export const getAdminContact    = ()     => client.get('/api/admin/contact').then(r => r.data)
export const updateAdminContact = (data) => client.put('/api/admin/contact', data).then(r => r.data)

// Messages
export const getMessages    = ()   => client.get('/api/admin/messages').then(r => r.data)
export const markMessageRead = (id) => client.put(`/api/admin/messages/${id}/read`).then(r => r.data)
export const deleteMessage  = (id) => client.delete(`/api/admin/messages/${id}`).then(r => r.data)

// Upload
export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return client.post('/api/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data)
}
