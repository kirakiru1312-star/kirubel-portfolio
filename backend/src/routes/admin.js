const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

// ─── PROFILE (single row, no delete) ────────────────────────────────────────

router.get('/profile', (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    res.json(profile || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', (req, res) => {
  const { name, tagline, bio, location, email, phone, profile_image, resume_file, years_experience, projects_count, clients_count } = req.body;
  try {
    const existing = db.prepare('SELECT id FROM profile WHERE id = 1').get();
    if (existing) {
      db.prepare(`
        UPDATE profile SET
          name = ?, tagline = ?, bio = ?, location = ?, email = ?, phone = ?,
          profile_image = ?, resume_file = ?, years_experience = ?, projects_count = ?,
          clients_count = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `).run(name, tagline, bio, location, email, phone, profile_image, resume_file, years_experience, projects_count, clients_count);
    } else {
      db.prepare(`
        INSERT INTO profile (id, name, tagline, bio, location, email, phone, profile_image, resume_file, years_experience, projects_count, clients_count)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, tagline, bio, location, email, phone, profile_image, resume_file, years_experience, projects_count, clients_count);
    }
    const updated = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ─── PROJECTS ────────────────────────────────────────────────────────────────

router.get('/projects', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY display_order ASC, created_at DESC').all();
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/projects', (req, res) => {
  const { title, description, long_description, tech_stack, github_url, live_url, image, featured, published, display_order } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  try {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO projects (id, title, description, long_description, tech_stack, github_url, live_url, image, featured, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, description, long_description, tech_stack, github_url, live_url, image, featured ?? 0, published ?? 1, display_order ?? 0);
    const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/projects/:id', (req, res) => {
  const { title, description, long_description, tech_stack, github_url, live_url, image, featured, published, display_order } = req.body;
  try {
    const existing = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Project not found' });
    db.prepare(`
      UPDATE projects SET
        title = ?, description = ?, long_description = ?, tech_stack = ?, github_url = ?,
        live_url = ?, image = ?, featured = ?, published = ?, display_order = ?
      WHERE id = ?
    `).run(title, description, long_description, tech_stack, github_url, live_url, image, featured, published, display_order, req.params.id);
    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/projects/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Project not found' });
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ─── SKILLS ──────────────────────────────────────────────────────────────────

router.get('/skills', (req, res) => {
  try {
    const skills = db.prepare('SELECT * FROM skills ORDER BY category ASC, display_order ASC').all();
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

router.post('/skills', (req, res) => {
  const { name, proficiency, category, icon, published, display_order } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO skills (id, name, proficiency, category, icon, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, proficiency ?? 80, category, icon, published ?? 1, display_order ?? 0);
    const created = db.prepare('SELECT * FROM skills WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

router.put('/skills/:id', (req, res) => {
  const { name, proficiency, category, icon, published, display_order } = req.body;
  try {
    const existing = db.prepare('SELECT id FROM skills WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Skill not found' });
    db.prepare(`
      UPDATE skills SET name = ?, proficiency = ?, category = ?, icon = ?, published = ?, display_order = ?
      WHERE id = ?
    `).run(name, proficiency, category, icon, published, display_order, req.params.id);
    const updated = db.prepare('SELECT * FROM skills WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

router.delete('/skills/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM skills WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Skill not found' });
    db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// ─── SERVICES ────────────────────────────────────────────────────────────────

router.get('/services', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services ORDER BY display_order ASC').all();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.post('/services', (req, res) => {
  const { title, description, icon, published, display_order } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  try {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO services (id, title, description, icon, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, title, description, icon, published ?? 1, display_order ?? 0);
    const created = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/services/:id', (req, res) => {
  const { title, description, icon, published, display_order } = req.body;
  try {
    const existing = db.prepare('SELECT id FROM services WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Service not found' });
    db.prepare(`
      UPDATE services SET title = ?, description = ?, icon = ?, published = ?, display_order = ?
      WHERE id = ?
    `).run(title, description, icon, published, display_order, req.params.id);
    const updated = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/services/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM services WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Service not found' });
    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────

router.get('/experience', (req, res) => {
  try {
    const experience = db.prepare('SELECT * FROM experience ORDER BY display_order ASC').all();
    res.json(experience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

router.post('/experience', (req, res) => {
  const { company, position, description, start_date, end_date, current_job, location, published, display_order } = req.body;
  if (!company || !position) return res.status(400).json({ error: 'Company and position are required' });
  try {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO experience (id, company, position, description, start_date, end_date, current_job, location, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, company, position, description, start_date, end_date, current_job ?? 0, location, published ?? 1, display_order ?? 0);
    const created = db.prepare('SELECT * FROM experience WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

router.put('/experience/:id', (req, res) => {
  const { company, position, description, start_date, end_date, current_job, location, published, display_order } = req.body;
  try {
    const existing = db.prepare('SELECT id FROM experience WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Experience not found' });
    db.prepare(`
      UPDATE experience SET
        company = ?, position = ?, description = ?, start_date = ?, end_date = ?,
        current_job = ?, location = ?, published = ?, display_order = ?
      WHERE id = ?
    `).run(company, position, description, start_date, end_date, current_job, location, published, display_order, req.params.id);
    const updated = db.prepare('SELECT * FROM experience WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/experience/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM experience WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Experience not found' });
    db.prepare('DELETE FROM experience WHERE id = ?').run(req.params.id);
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// ─── EDUCATION ───────────────────────────────────────────────────────────────

router.get('/education', (req, res) => {
  try {
    const education = db.prepare('SELECT * FROM education ORDER BY display_order ASC').all();
    res.json(education);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch education' });
  }
});

router.post('/education', (req, res) => {
  const { institution, degree, field, description, start_date, end_date, gpa, published, display_order } = req.body;
  if (!institution || !degree) return res.status(400).json({ error: 'Institution and degree are required' });
  try {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO education (id, institution, degree, field, description, start_date, end_date, gpa, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, institution, degree, field, description, start_date, end_date, gpa, published ?? 1, display_order ?? 0);
    const created = db.prepare('SELECT * FROM education WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create education' });
  }
});

router.put('/education/:id', (req, res) => {
  const { institution, degree, field, description, start_date, end_date, gpa, published, display_order } = req.body;
  try {
    const existing = db.prepare('SELECT id FROM education WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Education not found' });
    db.prepare(`
      UPDATE education SET
        institution = ?, degree = ?, field = ?, description = ?, start_date = ?,
        end_date = ?, gpa = ?, published = ?, display_order = ?
      WHERE id = ?
    `).run(institution, degree, field, description, start_date, end_date, gpa, published, display_order, req.params.id);
    const updated = db.prepare('SELECT * FROM education WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update education' });
  }
});

router.delete('/education/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM education WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Education not found' });
    db.prepare('DELETE FROM education WHERE id = ?').run(req.params.id);
    res.json({ message: 'Education deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete education' });
  }
});

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

router.get('/achievements', (req, res) => {
  try {
    const achievements = db.prepare('SELECT * FROM achievements ORDER BY display_order ASC').all();
    res.json(achievements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

router.post('/achievements', (req, res) => {
  const { title, description, date, icon, published, display_order } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  try {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO achievements (id, title, description, date, icon, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, description, date, icon, published ?? 1, display_order ?? 0);
    const created = db.prepare('SELECT * FROM achievements WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create achievement' });
  }
});

router.put('/achievements/:id', (req, res) => {
  const { title, description, date, icon, published, display_order } = req.body;
  try {
    const existing = db.prepare('SELECT id FROM achievements WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Achievement not found' });
    db.prepare(`
      UPDATE achievements SET title = ?, description = ?, date = ?, icon = ?, published = ?, display_order = ?
      WHERE id = ?
    `).run(title, description, date, icon, published, display_order, req.params.id);
    const updated = db.prepare('SELECT * FROM achievements WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update achievement' });
  }
});

router.delete('/achievements/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM achievements WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Achievement not found' });
    db.prepare('DELETE FROM achievements WHERE id = ?').run(req.params.id);
    res.json({ message: 'Achievement deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

// ─── SOCIAL LINKS ─────────────────────────────────────────────────────────────

router.get('/social_links', (req, res) => {
  try {
    const links = db.prepare('SELECT * FROM social_links ORDER BY display_order ASC').all();
    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch social links' });
  }
});

router.post('/social_links', (req, res) => {
  const { platform, url, icon, published, display_order } = req.body;
  if (!platform || !url) return res.status(400).json({ error: 'Platform and URL are required' });
  try {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO social_links (id, platform, url, icon, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, platform, url, icon, published ?? 1, display_order ?? 0);
    const created = db.prepare('SELECT * FROM social_links WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create social link' });
  }
});

router.put('/social_links/:id', (req, res) => {
  const { platform, url, icon, published, display_order } = req.body;
  try {
    const existing = db.prepare('SELECT id FROM social_links WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Social link not found' });
    db.prepare(`
      UPDATE social_links SET platform = ?, url = ?, icon = ?, published = ?, display_order = ?
      WHERE id = ?
    `).run(platform, url, icon, published, display_order, req.params.id);
    const updated = db.prepare('SELECT * FROM social_links WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update social link' });
  }
});

router.delete('/social_links/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM social_links WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Social link not found' });
    db.prepare('DELETE FROM social_links WHERE id = ?').run(req.params.id);
    res.json({ message: 'Social link deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete social link' });
  }
});

// ─── CONTACT ─────────────────────────────────────────────────────────────────

router.get('/contact', (req, res) => {
  try {
    const contact = db.prepare('SELECT * FROM contact WHERE id = 1').get();
    res.json(contact || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

router.put('/contact', (req, res) => {
  const { email, phone, address, working_hours } = req.body;
  try {
    const existing = db.prepare('SELECT id FROM contact WHERE id = 1').get();
    if (existing) {
      db.prepare(`
        UPDATE contact SET email = ?, phone = ?, address = ?, working_hours = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `).run(email, phone, address, working_hours);
    } else {
      db.prepare(`
        INSERT INTO contact (id, email, phone, address, working_hours)
        VALUES (1, ?, ?, ?, ?)
      `).run(email, phone, address, working_hours);
    }
    const updated = db.prepare('SELECT * FROM contact WHERE id = 1').get();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// ─── MESSAGES ────────────────────────────────────────────────────────────────

router.get('/messages', (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.get('/messages/:id', (req, res) => {
  try {
    const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

router.put('/messages/:id/read', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM messages WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Message not found' });
    db.prepare('UPDATE messages SET read = 1 WHERE id = ?').run(req.params.id);
    const updated = db.prepare('SELECT * FROM messages WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

router.delete('/messages/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM messages WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Message not found' });
    db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin-only endpoints (require Bearer JWT)
 *
 * /api/admin/profile:
 *   get:
 *     summary: Get profile (admin)
 *     tags: [Admin]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200: { description: Profile }
 *       401: { description: Unauthorized }
 *   put:
 *     summary: Update profile
 *     tags: [Admin]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200: { description: Updated profile }
 *
 * /api/admin/projects:
 *   get:
 *     summary: Get all projects (admin, includes drafts)
 *     tags: [Admin]
 *     security: [{bearerAuth: []}]
 *     responses:
 *       200: { description: Array of projects }
 *   post:
 *     summary: Create project
 *     tags: [Admin]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201: { description: Created project }
 *       400: { description: Validation error }
 *
 * /api/admin/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Admin]
 *     security: [{bearerAuth: []}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200: { description: Updated project }
 *       404: { description: Not found }
 *   delete:
 *     summary: Delete project
 *     tags: [Admin]
 *     security: [{bearerAuth: []}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 *
 * /api/admin/upload:
 *   post:
 *     summary: Upload a file (image or PDF)
 *     tags: [Admin]
 *     security: [{bearerAuth: []}]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url: { type: string }
 */
