// swagger.config.js
const { version } = require('./package.json');

module.exports = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My Project Nest Implementation',
      version,
      description: 'All API documentation',
    },
    servers: [
      {
        url: 'http://localhost:8080', // Update with your server URL
      },
    ],
  },
  apis: ['src/**/*.controller.ts'], // Update with your controller paths
};
