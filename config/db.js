const mysql = require('mysql2/promise');

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Aiven requer SSL, configurar como objeto
if (process.env.NODE_ENV === 'production' || process.env.DB_HOST.includes('aivencloud')) {
  poolConfig.ssl = 'Amazon RDS';
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
