-- Миграция: Создание таблицы счетов
-- Финансовые счета пользователей (кошельки, банковские счета и т.д.)

CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency_id INTEGER NOT NULL REFERENCES currencies(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL, -- Название счета (например, "Основной кошелёк", "Карта Сбербанка")
    balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL, -- Текущий баланс счета
    account_type VARCHAR(50) DEFAULT 'wallet', -- Тип счета: wallet, bank, card, savings и т.д.
    is_active BOOLEAN DEFAULT TRUE, -- Активен ли счет
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_currency_id ON accounts(currency_id);
CREATE INDEX idx_accounts_user_active ON accounts(user_id, is_active);

-- Комментарии
COMMENT ON TABLE accounts IS 'Финансовые счета пользователей';
COMMENT ON COLUMN accounts.user_id IS 'ID пользователя-владельца счета';
COMMENT ON COLUMN accounts.currency_id IS 'ID валюты счета';
COMMENT ON COLUMN accounts.name IS 'Название счета';
COMMENT ON COLUMN accounts.balance IS 'Текущий баланс счета';
COMMENT ON COLUMN accounts.account_type IS 'Тип счета (wallet, bank, card, savings)';
COMMENT ON COLUMN accounts.is_active IS 'Активен ли счет';

