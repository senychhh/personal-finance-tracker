-- Миграция: Создание таблицы пользователей
-- Основная таблица для хранения данных пользователей

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Хеш пароля (bcrypt)
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Комментарии
COMMENT ON TABLE users IS 'Таблица пользователей системы';
COMMENT ON COLUMN users.email IS 'Email пользователя (уникальный)';
COMMENT ON COLUMN users.password_hash IS 'Хеш пароля пользователя (bcrypt)';
COMMENT ON COLUMN users.first_name IS 'Имя пользователя';
COMMENT ON COLUMN users.last_name IS 'Фамилия пользователя';

