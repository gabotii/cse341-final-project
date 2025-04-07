const MongoClient = require('mongodb').MongoClient;

let database;

const initDb = (callback) => {
  if (database) {
    console.log('Db is already initialized!');
    if (callback) return callback(null, database);
    return Promise.resolve(database);
  }
  return MongoClient.connect(
    process.env.MONGODB_TEST_URL || process.env.MONGODB_URL,
    { 
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
    }
  )
    .then(client => {
      database = client;
      console.log('Database connection established');
      if (callback) return callback(null, database);
      return database;
    })
    .catch(err => {
      console.error('Database connection failed:', err);
      if (callback) return callback(err);
      throw err;
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database;
};

const closeDb = async () => {
  if (database) {
    await database.close();
    database = null;
    console.log('Database connection closed');
  }
};

module.exports = { initDb, getDatabase, closeDb };