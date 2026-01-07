/**
 * Подключение к базе данных PostgreSQL с использованием pg Pool
 */

const { Pool } = require('pg');
const config = require('../config');

// Пул соединений с БД
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
});

/**
 * Обёртка над pool.query для удобства использования в репозиториях
 * @param {string} text - SQL запрос
 * @param {Array} params - параметры запроса
 */
const query = (text, params) => pool.query(text, params);

/**
 * Простейшая проверка подключения к БД
 */
async function testConnection() {
  await pool.query('SELECT 1');
}

module.exports = {
  pool,
  query,
  testConnection,
};

