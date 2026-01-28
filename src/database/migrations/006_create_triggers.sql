-- Миграция: Создание триггеров для автоматического обновления updated_at
-- Триггеры автоматически обновляют поле updated_at при изменении записи

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для всех таблиц с полем updated_at
CREATE TRIGGER update_currencies_updated_at BEFORE UPDATE ON currencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON FUNCTION update_updated_at_column() IS 'Функция для автоматического обновления поля updated_at';

-- ============================================
-- Триггеры для автоматического обновления баланса счетов
-- ============================================

-- Функция для обновления баланса счета при изменении транзакций
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- При создании транзакции: добавляем сумму к балансу
    IF TG_OP = 'INSERT' THEN
        UPDATE accounts 
        SET balance = balance + NEW.amount
        WHERE id = NEW.account_id;
        RETURN NEW;
    END IF;
    
    -- При изменении транзакции: пересчитываем баланс
    IF TG_OP = 'UPDATE' THEN
        -- Убираем старую сумму
        UPDATE accounts 
        SET balance = balance - OLD.amount
        WHERE id = OLD.account_id;
        
        -- Добавляем новую сумму (если счет изменился, обновляем оба счета)
        IF OLD.account_id != NEW.account_id THEN
            -- Убираем из старого счета
            UPDATE accounts 
            SET balance = balance - OLD.amount
            WHERE id = OLD.account_id;
            -- Добавляем в новый счет
            UPDATE accounts 
            SET balance = balance + NEW.amount
            WHERE id = NEW.account_id;
        ELSE
            -- Тот же счет, просто обновляем разницу
            UPDATE accounts 
            SET balance = balance + NEW.amount
            WHERE id = NEW.account_id;
        END IF;
        RETURN NEW;
    END IF;
    
    -- При удалении транзакции: возвращаем сумму
    IF TG_OP = 'DELETE' THEN
        UPDATE accounts 
        SET balance = balance - OLD.amount
        WHERE id = OLD.account_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Триггер при создании транзакции
CREATE TRIGGER update_account_balance_on_insert
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_account_balance();

-- Триггер при изменении транзакции
CREATE TRIGGER update_account_balance_on_update
    AFTER UPDATE ON transactions
    FOR EACH ROW
    WHEN (OLD.amount IS DISTINCT FROM NEW.amount OR OLD.account_id IS DISTINCT FROM NEW.account_id)
    EXECUTE FUNCTION update_account_balance();

-- Триггер при удалении транзакции
CREATE TRIGGER update_account_balance_on_delete
    AFTER DELETE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_account_balance();

COMMENT ON FUNCTION update_account_balance() IS 'Функция для автоматического обновления баланса счета при изменении транзакций';
