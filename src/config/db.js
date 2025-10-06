require('dotenv').config();
const path = require('path');
const knex = require('knex');
const config = require('../../knexfile'); // import from root

const environment = process.env.NODE_ENV || 'development';

const db = knex(config[environment]);

db.raw('SELECT 1')
  .then(() => console.log(`Connected to ${environment} database`))
  .catch((err) => console.error('Database connection failed:', err));

module.exports = db;
