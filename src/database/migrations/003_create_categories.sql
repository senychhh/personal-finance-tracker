-- Миграция: Создание таблицы категорий
-- Категории для доходов и расходов

CREATE TYPE category_type AS ENUM ('income', 'expense');

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type category_type NOT NULL, -- 'income' или 'expense'
    color VARCHAR(7), -- HEX цвет для UI (например, #FF5733)
    icon VARCHAR(50), -- Название иконки
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Уникальность: один пользователь не может иметь две категории с одинаковым именем и типом
    UNIQUE(user_id, name, type)
);

-- Индексы
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_user_type ON categories(user_id, type);

-- Комментарии
COMMENT ON TABLE categories IS 'Категории доходов и расходов пользователей';
COMMENT ON COLUMN categories.user_id IS 'ID пользователя-владельца категории';
COMMENT ON COLUMN categories.name IS 'Название категории';
COMMENT ON COLUMN categories.type IS 'Тип категории: income (доход) или expense (расход)';
COMMENT ON COLUMN categories.color IS 'Цвет категории в HEX формате для UI';
COMMENT ON COLUMN categories.icon IS 'Название иконки для категории';

