const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Swimming Tools API',
    description: 'API for managing swimming tools and clients'
  },
  host: 'localhost:3000',
  schemes: ['https', 'http'],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: "Enter your bearer token in the format 'Bearer <token>'"
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = [
  './routes/index.js',
  './routes/clients.js',
  './routes/swimmingTools.js',
  './routes/orders.js',
  './routes/deliveries.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);