if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const knex = require('knex');

const db = knex({
  client: 'pg', 
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT)
  },
  migrations: {
    directory: './migrations'
  }
});

module.exports = db;
