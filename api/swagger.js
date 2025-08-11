import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'TechGist API',
    version: '1.0.0',
    description: 'API documentation for TechGist blog platform.'
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Local server' }
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string' }
        }
      },
      Post: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          content: { type: 'string' },
          image: { type: 'string' },
          category: { type: 'string' },
          topic: { type: 'string' },
          slug: { type: 'string' }
        }
      },
      Comment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          content: { type: 'string' },
          postId: { type: 'string', format: 'uuid' },
          authorId: { type: 'string', format: 'uuid' }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['api/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
export function setupSwagger(app){
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
