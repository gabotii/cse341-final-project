const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const mongodb = require('./data/database');

const port = process.env.PORT || 3000;

console.log('Starting server...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', port);
console.log('MONGODB_URL:', process.env.MONGODB_URL ? 'Set' : 'Not set');

mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1); // Exit if database connection fails
  } else {
    console.log('Database initialized successfully');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});