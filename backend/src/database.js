const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '../../portfolio.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

function initializeDatabase() {
  createTables();
  seedDatabase();
}

function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name TEXT,
      tagline TEXT,
      bio TEXT,
      location TEXT,
      email TEXT,
      phone TEXT,
      profile_image TEXT,
      resume_file TEXT,
      years_experience INTEGER,
      projects_count INTEGER,
      clients_count INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      long_description TEXT,
      tech_stack TEXT,
      github_url TEXT,
      live_url TEXT,
      image TEXT,
      featured INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      proficiency INTEGER DEFAULT 80,
      category TEXT,
      icon TEXT,
      published INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      published INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS experience (
      id TEXT PRIMARY KEY,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      description TEXT,
      start_date TEXT,
      end_date TEXT,
      current_job INTEGER DEFAULT 0,
      location TEXT,
      published INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS education (
      id TEXT PRIMARY KEY,
      institution TEXT NOT NULL,
      degree TEXT NOT NULL,
      field TEXT,
      description TEXT,
      start_date TEXT,
      end_date TEXT,
      gpa TEXT,
      published INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      icon TEXT,
      published INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contact (
      id INTEGER PRIMARY KEY DEFAULT 1,
      email TEXT,
      phone TEXT,
      address TEXT,
      working_hours TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT,
      published INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function seedDatabase() {
  // Seed admin user (reads from env vars or defaults to admin/admin123)
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
  if (adminCount.count === 0) {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    db.prepare(
      'INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)'
    ).run(uuidv4(), adminUsername, passwordHash);
  }

  // Seed profile
  const profileCount = db.prepare('SELECT COUNT(*) as count FROM profile').get();
  if (profileCount.count === 0) {
    db.prepare(`
      INSERT INTO profile (id, name, tagline, bio, location, email, phone, years_experience, projects_count, clients_count)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Kirubel Gelaw',
      'Full-Stack Developer & Information Technology',
      'Passionate full-stack developer with expertise in building modern web applications. I love turning complex problems into elegant, user-friendly solutions.',
      'Addis Ababa, Ethiopia',
      'kirubel@example.com',
      '+251 91 234 5678',
      3,
      20,
      15
    );
  }

  // Seed projects
  const projectsCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  if (projectsCount.count === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (id, title, description, long_description, tech_stack, github_url, live_url, featured, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform with product management, cart, and payment processing.',
        long_description: 'Built a complete e-commerce solution with user authentication, product catalog, shopping cart, and Stripe payment integration. Features include real-time inventory management and order tracking.',
        tech_stack: 'React, Node.js, MongoDB, Stripe',
        github_url: 'https://github.com/kirubel/ecommerce-platform',
        live_url: 'https://ecommerce.example.com',
        featured: 1,
        published: 1,
        display_order: 1
      },
      {
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates and team features.',
        long_description: 'Developed a real-time collaborative task management app with drag-and-drop boards, team workspaces, notifications, and progress tracking using WebSockets.',
        tech_stack: 'React, Express, PostgreSQL, Socket.io',
        github_url: 'https://github.com/kirubel/task-manager',
        live_url: 'https://tasks.example.com',
        featured: 1,
        published: 1,
        display_order: 2
      },
      {
        title: 'AI Chat Application',
        description: 'An intelligent chat application powered by OpenAI API with a modern React frontend.',
        long_description: 'Created an AI-powered chat interface that integrates with OpenAI API, supporting multiple conversation threads, message history, and custom system prompts.',
        tech_stack: 'Python, FastAPI, OpenAI API, React',
        github_url: 'https://github.com/kirubel/ai-chat',
        live_url: 'https://chat.example.com',
        featured: 1,
        published: 1,
        display_order: 3
      },
      {
        title: 'Portfolio CMS',
        description: 'A custom content management system for portfolio websites with admin dashboard.',
        long_description: 'Built a full-stack portfolio CMS with a secure admin dashboard for managing projects, skills, and content. Features JWT authentication and dynamic content updates.',
        tech_stack: 'React, Node.js, SQLite, JWT',
        github_url: 'https://github.com/kirubel/portfolio-cms',
        live_url: 'https://portfolio-cms.example.com',
        featured: 0,
        published: 1,
        display_order: 4
      }
    ];
    for (const p of projects) {
      insertProject.run(uuidv4(), p.title, p.description, p.long_description, p.tech_stack, p.github_url, p.live_url, p.featured, p.published, p.display_order);
    }
  }

  // Seed skills
  const skillsCount = db.prepare('SELECT COUNT(*) as count FROM skills').get();
  if (skillsCount.count === 0) {
    const insertSkill = db.prepare(`
      INSERT INTO skills (id, name, proficiency, category, icon, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const skills = [
      // Frontend
      { name: 'HTML/CSS', proficiency: 95, category: 'Frontend', icon: 'html', display_order: 1 },
      { name: 'JavaScript', proficiency: 92, category: 'Frontend', icon: 'javascript', display_order: 2 },
      { name: 'React', proficiency: 90, category: 'Frontend', icon: 'react', display_order: 3 },
      { name: 'TypeScript', proficiency: 80, category: 'Frontend', icon: 'typescript', display_order: 4 },
      { name: 'Tailwind CSS', proficiency: 88, category: 'Frontend', icon: 'tailwind', display_order: 5 },
      // Backend
      { name: 'Node.js', proficiency: 88, category: 'Backend', icon: 'nodejs', display_order: 1 },
      { name: 'Express', proficiency: 85, category: 'Backend', icon: 'express', display_order: 2 },
      { name: 'Python', proficiency: 75, category: 'Backend', icon: 'python', display_order: 3 },
      { name: 'PostgreSQL', proficiency: 82, category: 'Backend', icon: 'postgresql', display_order: 4 },
      { name: 'MongoDB', proficiency: 78, category: 'Backend', icon: 'mongodb', display_order: 5 },
      // Tools
      { name: 'Git', proficiency: 90, category: 'Tools', icon: 'git', display_order: 1 },
      { name: 'Docker', proficiency: 70, category: 'Tools', icon: 'docker', display_order: 2 }
    ];
    for (const s of skills) {
      insertSkill.run(uuidv4(), s.name, s.proficiency, s.category, s.icon, 1, s.display_order);
    }
  }

  // Seed services
  const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get();
  if (servicesCount.count === 0) {
    const insertService = db.prepare(`
      INSERT INTO services (id, title, description, icon, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const services = [
      {
        title: 'Web Development',
        description: 'Building responsive, performant web applications using modern technologies like React, Node.js, and cloud services.',
        icon: 'code',
        display_order: 1
      },
      {
        title: 'Backend & API Development',
        description: 'Designing and implementing robust RESTful APIs, microservices, and database architectures for scalable applications.',
        icon: 'server',
        display_order: 2
      },
      {
        title: 'UI/UX Design',
        description: 'Creating intuitive and visually appealing user interfaces with a focus on user experience and accessibility.',
        icon: 'palette',
        display_order: 3
      }
    ];
    for (const s of services) {
      insertService.run(uuidv4(), s.title, s.description, s.icon, 1, s.display_order);
    }
  }

  // Seed experience
  const experienceCount = db.prepare('SELECT COUNT(*) as count FROM experience').get();
  if (experienceCount.count === 0) {
    const insertExp = db.prepare(`
      INSERT INTO experience (id, company, position, description, start_date, end_date, current_job, location, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertExp.run(
      uuidv4(),
      'TechStartup Ethiopia',
      'Junior Full-Stack Developer',
      'Developing and maintaining web applications using React and Node.js. Collaborating with the team to deliver high-quality software solutions and participating in code reviews.',
      '2023-01',
      null,
      1,
      'Addis Ababa, Ethiopia',
      1,
      1
    );
    insertExp.run(
      uuidv4(),
      'Digital Agency Addis',
      'Frontend Intern',
      'Assisted in building responsive web pages using HTML, CSS, and JavaScript. Learned best practices for web development and worked on real client projects.',
      '2022-06',
      '2022-12',
      0,
      'Addis Ababa, Ethiopia',
      1,
      2
    );
  }

  // Seed education
  const educationCount = db.prepare('SELECT COUNT(*) as count FROM education').get();
  if (educationCount.count === 0) {
    const insertEdu = db.prepare(`
      INSERT INTO education (id, institution, degree, field, description, start_date, end_date, gpa, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertEdu.run(
      uuidv4(),
      'Addis Ababa University',
      'Bachelor of Science',
      'Computer Science',
      'Focused on software engineering, algorithms, data structures, and web technologies. Participated in multiple hackathons and open-source projects.',
      '2020',
      '2024',
      '3.7/4.0',
      1,
      1
    );
    insertEdu.run(
      uuidv4(),
      'Addis Ababa Preparatory School',
      'High School Diploma',
      'Natural Science',
      'Graduated with distinction. Developed a strong foundation in mathematics and sciences.',
      '2018',
      '2020',
      null,
      1,
      2
    );
  }

  // Seed achievements
  const achievementsCount = db.prepare('SELECT COUNT(*) as count FROM achievements').get();
  if (achievementsCount.count === 0) {
    const insertAchievement = db.prepare(`
      INSERT INTO achievements (id, title, description, date, icon, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertAchievement.run(
      uuidv4(),
      'Hackathon Winner',
      'Won 1st place at the National Coding Hackathon 2023 with an AI-powered health monitoring solution.',
      '2023-11',
      'trophy',
      1,
      1
    );
    insertAchievement.run(
      uuidv4(),
      'Open Source Contributor',
      'Active contributor to several open-source projects with over 50 merged pull requests on GitHub.',
      '2023-06',
      'github',
      1,
      2
    );
    insertAchievement.run(
      uuidv4(),
      'AWS Certified',
      'Obtained AWS Certified Cloud Practitioner certification, demonstrating cloud computing fundamentals.',
      '2023-08',
      'cloud',
      1,
      3
    );
  }

  // Seed contact
  const contactCount = db.prepare('SELECT COUNT(*) as count FROM contact').get();
  if (contactCount.count === 0) {
    db.prepare(`
      INSERT INTO contact (id, email, phone, address, working_hours)
      VALUES (1, ?, ?, ?, ?)
    `).run(
      'kirubel@example.com',
      '+251 91 234 5678',
      'Addis Ababa, Ethiopia',
      'Mon - Fri: 9:00 AM - 6:00 PM (EAT)'
    );
  }

  // Seed social links
  const socialCount = db.prepare('SELECT COUNT(*) as count FROM social_links').get();
  if (socialCount.count === 0) {
    const insertSocial = db.prepare(`
      INSERT INTO social_links (id, platform, url, icon, published, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertSocial.run(uuidv4(), 'GitHub', 'https://github.com/kirubel', 'github', 1, 1);
    insertSocial.run(uuidv4(), 'LinkedIn', 'https://linkedin.com/in/kirubel-gelaw', 'linkedin', 1, 2);
    insertSocial.run(uuidv4(), 'Twitter', 'https://twitter.com/kirubel_dev', 'twitter', 1, 3);
  }
}

module.exports = { db, initializeDatabase };
