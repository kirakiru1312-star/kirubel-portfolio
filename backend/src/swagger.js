const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kirubel Portfolio API',
      version: '1.0.0',
      description: 'REST API for the Kirubel portfolio website. Public endpoints are open. Admin endpoints require a Bearer JWT token.',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Local development' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Profile: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            tagline: { type: 'string' },
            bio: { type: 'string' },
            location: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            profile_image: { type: 'string' },
            resume_file: { type: 'string' },
            years_experience: { type: 'integer' },
            projects_count: { type: 'integer' },
            clients_count: { type: 'integer' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            long_description: { type: 'string' },
            tech_stack: { type: 'string' },
            github_url: { type: 'string' },
            live_url: { type: 'string' },
            image: { type: 'string' },
            featured: { type: 'integer' },
            published: { type: 'integer' },
            display_order: { type: 'integer' },
          },
        },
        Skill: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            proficiency: { type: 'integer' },
            category: { type: 'string' },
            icon: { type: 'string' },
            published: { type: 'integer' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
}

const swaggerSpec = swaggerJsdoc(options)
module.exports = swaggerSpec
