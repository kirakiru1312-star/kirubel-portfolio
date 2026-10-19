const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../database');

const router = express.Router();

// GET /api/public/profile
router.get('/profile', (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
    res.json(profile || {});
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// GET /api/public/projects
router.get('/projects', (req, res) => {
  try {
    const projects = db.prepare(
      'SELECT * FROM projects WHERE published = 1 ORDER BY display_order ASC, created_at DESC'
    ).all();
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/public/skills
router.get('/skills', (req, res) => {
  try {
    const skills = db.prepare(
      'SELECT * FROM skills WHERE published = 1 ORDER BY category ASC, display_order ASC'
    ).all();
    res.json(skills);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// GET /api/public/services
router.get('/services', (req, res) => {
  try {
    const services = db.prepare(
      'SELECT * FROM services WHERE published = 1 ORDER BY display_order ASC'
    ).all();
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET /api/public/experience
router.get('/experience', (req, res) => {
  try {
    const experience = db.prepare(
      'SELECT * FROM experience WHERE published = 1 ORDER BY display_order ASC'
    ).all();
    res.json(experience);
  } catch (err) {
    console.error('Error fetching experience:', err);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// GET /api/public/education
router.get('/education', (req, res) => {
  try {
    const education = db.prepare(
      'SELECT * FROM education WHERE published = 1 ORDER BY display_order ASC'
    ).all();
    res.json(education);
  } catch (err) {
    console.error('Error fetching education:', err);
    res.status(500).json({ error: 'Failed to fetch education' });
  }
});

// GET /api/public/achievements
router.get('/achievements', (req, res) => {
  try {
    const achievements = db.prepare(
      'SELECT * FROM achievements WHERE published = 1 ORDER BY display_order ASC'
    ).all();
    res.json(achievements);
  } catch (err) {
    console.error('Error fetching achievements:', err);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// GET /api/public/contact
router.get('/contact', (req, res) => {
  try {
    const contact = db.prepare('SELECT * FROM contact WHERE id = 1').get();
    const socialLinks = db.prepare(
      'SELECT * FROM social_links WHERE published = 1 ORDER BY display_order ASC'
    ).all();
    res.json({ contact: contact || {}, social_links: socialLinks });
  } catch (err) {
    console.error('Error fetching contact:', err);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// POST /api/public/messages
router.post('/messages', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const id = uuidv4();
    db.prepare(
      'INSERT INTO messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)'
    ).run(id, name.trim(), email.trim(), subject ? subject.trim() : null, message.trim());

    res.status(201).json({ message: 'Message sent successfully', id });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Public
 *     description: Public portfolio endpoints (no auth required)
 *
 * /api/public/profile:
 *   get:
 *     summary: Get portfolio owner profile
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Profile object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *
 * /api/public/projects:
 *   get:
 *     summary: Get all published projects
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Array of projects
 *
 * /api/public/skills:
 *   get:
 *     summary: Get all published skills
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Array of skills
 *
 * /api/public/services:
 *   get:
 *     summary: Get all published services
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Array of services
 *
 * /api/public/experience:
 *   get:
 *     summary: Get work experience
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Array of experience entries
 *
 * /api/public/education:
 *   get:
 *     summary: Get education history
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Array of education entries
 *
 * /api/public/achievements:
 *   get:
 *     summary: Get achievements
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Array of achievements
 *
 * /api/public/contact:
 *   get:
 *     summary: Get contact info and social links
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Contact and social_links object
 *
 * /api/public/messages:
 *   post:
 *     summary: Send a contact message
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:    { type: string }
 *               email:   { type: string, format: email }
 *               subject: { type: string }
 *               message: { type: string }
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 */
