# Kirubel Portfolio — Full-Stack

A modern, professional, responsive portfolio website with a completely separate frontend and backend, a secure admin dashboard, and persistent database storage.

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Vite, React Router, Axios     |
| Backend  | Node.js, Express, SQLite (better-sqlite3)|
| Auth     | JWT (jsonwebtoken) + bcryptjs           |
| Uploads  | Multer (local disk)                     |
| API Docs | Swagger UI (swagger-jsdoc + swagger-ui-express) |

---

## Folder Structure

```
kirubel-portfolio/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express app entry point
│   │   ├── database.js       # SQLite setup + seeding
│   │   ├── swagger.js        # Swagger/OpenAPI config
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT middleware
│   │   └── routes/
│   │       ├── auth.js       # POST /api/auth/login
│   │       ├── public.js     # GET /api/public/*
│   │       ├── admin.js      # /api/admin/* (CRUD)
│   │       └── upload.js     # POST /api/admin/upload
│   ├── uploads/              # Uploaded files (gitignored)
│   ├── postman_collection.json
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios client + API functions
│   │   ├── sections/         # Hero, About, Skills, Projects, etc.
│   │   ├── admin/            # Login, Dashboard, CRUD pages
│   │   ├── components/       # Navbar, Footer
│   │   ├── context/          # AuthContext (JWT)
│   │   └── styles/           # Global CSS variables
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Local Development Setup

### 1. Clone & setup environment files

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env and set a strong JWT_SECRET

# Frontend
cd ../frontend
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000 (default)
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev       # starts on http://localhost:5000
```

The SQLite database (`portfolio.db`) is created automatically on first run and seeded with sample data.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173
```

Open http://localhost:5173 to view the portfolio.

---

## Environment Variables

### backend/.env

| Variable       | Description                         | Default                    |
|----------------|-------------------------------------|----------------------------|
| `PORT`         | Server port                         | `5000`                     |
| `JWT_SECRET`   | Secret key for JWT signing          | **CHANGE THIS**            |
| `FRONTEND_URL` | Allowed CORS origin                 | `http://localhost:5173`    |
| `NODE_ENV`     | Environment (development/production)| `development`              |

### frontend/.env

| Variable            | Description             | Default                  |
|---------------------|-------------------------|--------------------------|
| `VITE_API_BASE_URL` | Backend base URL        | `http://localhost:5000`  |

---

## Default Admin Credentials

| Username | Password  |
|----------|-----------|
| `admin`  | `admin123`|

> ⚠️ **Change these in production!** The password is hashed in the database. To update it, use the `/api/auth/login` endpoint to confirm the current credentials, then update the hash manually or add a change-password endpoint.

---

## API Documentation

Swagger UI is available at:

```
http://localhost:5000/api/docs
```

Raw OpenAPI JSON:
```
http://localhost:5000/api/docs.json
```

### Postman Collection

Import `backend/postman_collection.json` into Postman:
1. Set the `baseUrl` variable to `http://localhost:5000`
2. Run **Login** to get a token
3. Set the `token` variable to the returned value
4. All Admin requests will automatically use `Bearer {{token}}`

---

## API Endpoints Summary

### Public (no auth)
| Method | Path                      | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/public/profile       | Portfolio owner profile  |
| GET    | /api/public/projects      | Published projects       |
| GET    | /api/public/skills        | Published skills         |
| GET    | /api/public/services      | Published services       |
| GET    | /api/public/experience    | Work experience          |
| GET    | /api/public/education     | Education history        |
| GET    | /api/public/achievements  | Achievements             |
| GET    | /api/public/contact       | Contact + social links   |
| POST   | /api/public/messages      | Send contact form        |

### Admin (Bearer JWT required)
| Method | Path                         | Description         |
|--------|------------------------------|---------------------|
| POST   | /api/auth/login              | Get JWT token       |
| GET/PUT| /api/admin/profile           | Manage profile      |
| GET/POST/PUT/DELETE | /api/admin/projects | Manage projects |
| GET/POST/PUT/DELETE | /api/admin/skills   | Manage skills   |
| GET/POST/PUT/DELETE | /api/admin/services | Manage services |
| GET/POST/PUT/DELETE | /api/admin/experience | Manage experience |
| GET/POST/PUT/DELETE | /api/admin/education  | Manage education  |
| GET/POST/PUT/DELETE | /api/admin/achievements | Manage achievements |
| GET/PUT | /api/admin/contact          | Manage contact info |
| GET/POST/PUT/DELETE | /api/admin/social_links | Social links |
| GET/DELETE/PUT      | /api/admin/messages     | View messages |
| POST   | /api/admin/upload            | Upload file         |

---

## Admin Dashboard

Access the admin dashboard at http://localhost:5173/admin

Features:
- **Dashboard** — overview with content counts
- **Profile** — edit name, bio, tagline, upload photo & CV
- **Projects** — full CRUD + featured/published toggles
- **Skills** — full CRUD with categories and proficiency
- **Services** — full CRUD
- **Experience** — work history management
- **Education** — academic history management
- **Achievements** — awards and certifications
- **Contact** — update contact info and social links
- **Messages** — read and manage contact form submissions

---

## Production Deployment

### Frontend (Vercel / Netlify)
1. Set `VITE_API_BASE_URL` to your deployed backend URL
2. Run `npm run build` — deploy the `dist/` folder
3. Configure the host to serve `index.html` for all routes (SPA routing)

### Backend (Railway / Render / Fly.io)
1. Set environment variables: `JWT_SECRET`, `PORT`, `FRONTEND_URL`, `NODE_ENV=production`
2. Run `npm start`
3. SQLite file persists on the server disk (or use a persistent volume)
4. The `uploads/` directory must be persistent — use a persistent volume or migrate to cloud storage (e.g., AWS S3) for production

### CORS
The backend allows requests only from `FRONTEND_URL`. Update this to your deployed frontend URL in production.

---

## Security Notes

- JWT tokens expire after 24 hours
- Passwords are hashed with bcrypt (10 rounds)
- File uploads are restricted to images and PDFs, max 10MB
- Stack traces are never exposed in production responses
- All admin routes require a valid Bearer token
- Input validation is performed on all POST/PUT endpoints
