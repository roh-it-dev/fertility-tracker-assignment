require('dotenv').config();
const path = require('path');

const environment = process.env.NODE_ENV || 'development';

const config = {
  client: process.env.DB_CLIENT || 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fertilitytrack',
    port: Number(process.env.DB_PORT) || 5432,
    ssl:
      environment === 'production'
        ? { rejectUnauthorized: false }
        : process.env.DB_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
  },
  pool: { min: 0, max: 7 },
  migrations: { directory: path.join(__dirname, 'src', 'migrations') },
  seeds: { directory: path.join(__dirname, 'src', 'seeds') },
};

module.exports = {
  development: config,
  production: config,
};
