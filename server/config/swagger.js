const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'eVolve API',
        version: '1.0.0',
        description: 'API for eVolve application',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [], // Apply this globally to all routes if needed
        },
      ],
      servers: [
        {
          url: 'http://localhost:8082/api',
        },
      ]
    },
    apis: ['./routes/*.js'], // Adjust the path to your routes
  };


const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
