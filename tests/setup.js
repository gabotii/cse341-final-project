// tests/setup.js
const mongodb = require('../data/database');

module.exports = async () => {
  await mongodb.initDb(() => {});
};

afterAll(async () => {
  await mongodb.closeDb();
});