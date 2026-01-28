-- Миграция: Создание таблицы валют
-- Справочник валют для системы

CREATE TABLE IF NOT EXISTS currencies (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL UNIQUE, -- ISO 4217 код валюты (USD, EUR, RUB и т.д.)
    name VARCHAR(100) NOT NULL, -- Название валюты
    symbol VARCHAR(10), -- Символ валюты ($, €, ₽)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска по коду валюты
CREATE INDEX idx_currencies_code ON currencies(code);

-- Комментарии к таблице и колонкам
COMMENT ON TABLE currencies IS 'Справочник валют';
COMMENT ON COLUMN currencies.code IS 'ISO 4217 код валюты (например, USD, EUR, RUB)';
COMMENT ON COLUMN currencies.name IS 'Название валюты';
COMMENT ON COLUMN currencies.symbol IS 'Символ валюты';

-- Вставка основных валют
INSERT INTO currencies (code, name, symbol) VALUES
    ('USD', 'US Dollar', '$'),
    ('EUR', 'Euro', '€'),
    ('RUB', 'Russian Ruble', '₽'),
    ('GBP', 'British Pound', '£'),
    ('BYN', 'Belarusian Ruble', 'Br')
ON CONFLICT (code) DO NOTHING; 

