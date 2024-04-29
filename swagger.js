const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for my Express API'
    },
    servers: [
      {
        url: 'http://localhost:3000', 
        description: 'Development server'
      }
    ]
  },
  apis: ['./schemas/schemas.js', './index.js'] 
};

const specs = swaggerJsdoc(options);


module.exports = function(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
