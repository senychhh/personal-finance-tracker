-- Миграция: Создание таблицы транзакций
-- Финансовые операции (доходы и расходы)

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(15, 2) NOT NULL, -- Сумма транзакции (положительная для доходов, отрицательная для расходов)
    type category_type NOT NULL, -- 'income' или 'expense'
    description TEXT, -- Описание транзакции
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Дата транзакции
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Проверка: сумма не может быть нулевой
    CONSTRAINT check_amount_not_zero CHECK (amount != 0)
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_user_type ON transactions(user_id, type);

-- Комментарии
COMMENT ON TABLE transactions IS 'Финансовые транзакции пользователей';
COMMENT ON COLUMN transactions.user_id IS 'ID пользователя';
COMMENT ON COLUMN transactions.account_id IS 'ID счета, с которым связана транзакция';
COMMENT ON COLUMN transactions.category_id IS 'ID категории транзакции (может быть NULL)';
COMMENT ON COLUMN transactions.amount IS 'Сумма транзакции (положительная для доходов, отрицательная для расходов)';
COMMENT ON COLUMN transactions.type IS 'Тип транзакции: income (доход) или expense (расход)';
COMMENT ON COLUMN transactions.description IS 'Описание транзакции';
COMMENT ON COLUMN transactions.transaction_date IS 'Дата совершения транзакции';

