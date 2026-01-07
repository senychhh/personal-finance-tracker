/**
 * Конфигурация приложения
 * Загружает переменные окружения
 */

require('dotenv').config(); // загружает переменные окружения из файла .env

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'finance_tracker', 
    user: process.env.DB_USER || 'postgres', 
    password: process.env.DB_PASSWORD || '', 
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

