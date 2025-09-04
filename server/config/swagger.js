const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Panchroma API',
      version: '1.0.0',
      description: 'Production-ready API for Panchroma web application',
      contact: {
        name: 'API Support',
        email: 'api@panchroma.ca'
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.panchroma.ca' 
          : `http://localhost:${process.env.PORT || 5000}`,
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;