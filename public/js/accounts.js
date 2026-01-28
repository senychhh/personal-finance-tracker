// Управление счетами: создание, загрузка, отображение

const accountForm = document.getElementById('accountForm');
const accountFormCard = document.getElementById('accountFormCard');
const accountErrorMessage = document.getElementById('accountErrorMessage');
const addAccountBtn = document.getElementById('addAccountBtn');
const createAccountBtn = document.getElementById('createAccountBtn');
const cancelAccountBtn = document.getElementById('cancelAccountBtn');

// Показать форму добавления счета
function showAccountForm() {
    if (accountFormCard) {
        accountFormCard.style.display = 'block';
        loadCurrencies();
        // Прокручиваем к форме
        accountFormCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (addAccountBtn) {
        addAccountBtn.style.display = 'none';
    }
}

// Скрыть форму добавления счета
function hideAccountForm() {
    if (accountFormCard) {
        accountFormCard.style.display = 'none';
    }
    if (addAccountBtn) {
        addAccountBtn.style.display = 'inline-flex';
    }
    if (accountForm) {
        accountForm.reset();
        document.getElementById('accountBalance').value = 0;
        clearFieldErrors();
    }
    if (accountErrorMessage) {
        accountErrorMessage.hidden = true;
        accountErrorMessage.textContent = '';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadAccounts();
    
    // Обработчики кнопок
    if (addAccountBtn) {
        addAccountBtn.addEventListener('click', showAccountForm);
    }
    
    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', showAccountForm);
    }

    if (cancelAccountBtn) {
        cancelAccountBtn.addEventListener('click', hideAccountForm);
    }
});

// Загрузка валют для выпадающего списка
async function loadCurrencies() {
    try {
        const data = await apiRequest('/currencies');
        const currencySelect = document.getElementById('accountCurrency');
        
        if (currencySelect && data.data && data.data.currencies) {
            currencySelect.innerHTML = '<option value="">Выберите валюту</option>';
            
            data.data.currencies.forEach(currency => {
                const option = document.createElement('option');
                option.value = currency.id;
                option.textContent = `${currency.name} (${currency.code})`;
                currencySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки валют:', error);
        // Если API не реализован, добавляем BYN по умолчанию
        const currencySelect = document.getElementById('accountCurrency');
        if (currencySelect) {
            currencySelect.innerHTML = '<option value="">Выберите валюту</option><option value="5">Belarusian Ruble (BYN)</option>';
        }
    }
}

// Обработка отправки формы
if (accountForm) {
    accountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = accountForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Скрываем предыдущие ошибки
        accountErrorMessage.hidden = true;
        accountErrorMessage.textContent = '';
        
        // Получаем данные формы
        const formData = new FormData(accountForm);
        const name = formData.get('name') || '';
        const currencyValue = formData.get('currency_id') || '';
        const currencyId = currencyValue ? parseInt(currencyValue) : 0;
        const accountType = formData.get('account_type') || '';
        const balanceValue = formData.get('balance') || '0';
        const balance = balanceValue ? parseFloat(balanceValue) : 0;
        
        // Валидация полей
        let isValid = true;
        clearFieldErrors();
        
        // Валидация названия
        if (!name || name.trim().length === 0) {
            showFieldError('accountName', 'Введите название счёта');
            isValid = false;
        } else if (name.trim().length < 2) {
            showFieldError('accountName', 'Название должно содержать минимум 2 символа');
            isValid = false;
        }
        
        // Валидация валюты
        if (!currencyValue || currencyValue === '' || isNaN(parseInt(currencyValue)) || parseInt(currencyValue) <= 0) {
            showFieldError('accountCurrency', 'Выберите валюту');
            isValid = false;
        }
        
        // Валидация типа счёта
        if (!accountType || accountType === '') {
            showFieldError('accountType', 'Выберите тип счёта');
            isValid = false;
        }
        
        // Валидация баланса
        if (balance < 0) {
            showFieldError('accountBalance', 'Баланс не может быть отрицательным');
            isValid = false;
        }
        
        if (!isValid) {
            accountErrorMessage.textContent = 'Исправьте ошибки в форме';
            accountErrorMessage.hidden = false;
            return;
        }
        
        // Показываем индикатор загрузки
        submitBtn.disabled = true;
        submitBtn.textContent = 'Добавление...';
        
        try {
            const response = await apiRequest('/accounts', {
                method: 'POST',
                body: JSON.stringify({
                    name: name.trim(),
                    currency_id: currencyId,
                    account_type: accountType,
                    balance: balance
                })
            });
            
            // Успешно добавлено
            submitBtn.textContent = 'Добавлено!';
            submitBtn.style.background = 'var(--green)';
            
            // Очищаем форму и обновляем список счетов
            setTimeout(() => {
                accountForm.reset();
                document.getElementById('accountBalance').value = 0;
                clearFieldErrors();
                accountErrorMessage.hidden = true;
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                // Обновляем список счетов
                loadAccounts();
                // Скрываем форму
                hideAccountForm();
            }, 1000);
            
        } catch (error) {
            accountErrorMessage.textContent = error.message || 'Ошибка при добавлении счёта';
            accountErrorMessage.hidden = false;
            
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Загрузка и отображение счетов
async function loadAccounts() {
    try {
        const accountsList = document.getElementById('accountsList');
        const accountSelect = document.getElementById('accountSelect');
        if (!accountsList) return;
        
        accountsList.innerHTML = '<div class="loading-state">Загрузка счетов...</div>';
        if (accountSelect) {
            accountSelect.innerHTML = '<option value="">Загрузка счетов...</option>';
            accountSelect.disabled = true;
        }
        
        const data = await apiRequest('/accounts');
        
        if (data.data && data.data.accounts && data.data.accounts.length > 0) {
            if (accountSelect) {
                accountSelect.innerHTML = data.data.accounts.map(account => {
                    const currency = account.currency?.code || account.currency_code || 'BR';
                    return `<option value="${account.id}">${account.name} (${currency})</option>`;
                }).join('');
                accountSelect.disabled = false;
            }
            if (createAccountBtn) {
                createAccountBtn.style.display = 'none';
            }
            accountsList.innerHTML = data.data.accounts.map(account => {
                const accountTypeNames = {
                    'wallet': 'Кошелёк',
                    'bank': 'Банковский счёт',
                    'card': 'Банковская карта',
                    'savings': 'Накопительный счёт'
                };
                
                const typeName = accountTypeNames[account.account_type] || account.account_type;
                const currency = account.currency?.code || account.currency_code || 'BR';
                
                return `
                    <div class="account-item">
                        <div class="account-item-info">
                            <div class="account-item-name">${account.name || 'Без названия'}</div>
                            <div class="account-item-details">
                                <span class="account-type">${typeName}</span>
                                <span class="account-currency">${currency}</span>
                            </div>
                        </div>
                        <div class="account-item-balance">
                            ${parseFloat(account.balance || 0).toFixed(2)} ${currency}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            accountsList.innerHTML = '<div class="empty-state">У вас пока нет счетов. Добавьте первый счёт выше.</div>';
            if (accountSelect) {
                accountSelect.innerHTML = '<option value="">Счета отсутствуют</option>';
                accountSelect.disabled = true;
            }
            if (createAccountBtn) {
                createAccountBtn.style.display = 'inline-flex';
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки счетов:', error);
        const accountsList = document.getElementById('accountsList');
        if (accountsList) {
            accountsList.innerHTML = '<div class="empty-state error">Ошибка загрузки счетов</div>';
        }
        const accountSelect = document.getElementById('accountSelect');
        if (accountSelect) {
            accountSelect.innerHTML = '<option value="">Ошибка загрузки</option>';
            accountSelect.disabled = true;
        }
        if (createAccountBtn) {
            createAccountBtn.style.display = 'inline-flex';
        }
    }
}

// Показ ошибки для конкретного поля
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('field-invalid');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Очистка ошибок полей
function clearFieldErrors() {
    const fields = ['accountName', 'accountCurrency', 'accountType', 'accountBalance'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.remove('field-invalid', 'field-valid');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    });
    
    if (accountErrorMessage) {
        accountErrorMessage.hidden = true;
        accountErrorMessage.textContent = '';
    }
}

// Валидация в реальном времени
if (accountForm) {
    const fields = accountForm.querySelectorAll('input, select');
    fields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.addEventListener('input', () => {
            if (field.classList.contains('field-invalid')) {
                validateField(field);
            }
        });
        
        field.addEventListener('change', () => {
            if (field.classList.contains('field-invalid')) {
                validateField(field);
            }
        });
    });
}

// Валидация отдельного поля
function validateField(field) {
    const fieldId = field.id;
    const value = field.type === 'select-one' ? field.value : field.value.trim();
    
    clearFieldError(fieldId);
    
    // Проверка обязательных полей
    const requiredFields = ['accountName', 'accountCurrency', 'accountType'];
    if (requiredFields.includes(fieldId) && (!value || value === '')) {
        if (fieldId === 'accountName') {
            showFieldError(fieldId, 'Введите название счёта');
        } else if (fieldId === 'accountCurrency') {
            showFieldError(fieldId, 'Выберите валюту');
        } else if (fieldId === 'accountType') {
            showFieldError(fieldId, 'Выберите тип счёта');
        }
        return false;
    }
    
    // Специфичная валидация для названия
    if (fieldId === 'accountName' && value.length > 0 && value.length < 2) {
        showFieldError(fieldId, 'Название должно содержать минимум 2 символа');
        return false;
    }
    
    // Валидация валюты
    if (fieldId === 'accountCurrency' && value && (isNaN(parseInt(value)) || parseInt(value) <= 0)) {
        showFieldError(fieldId, 'Выберите валюту');
        return false;
    }
    
    // Валидация баланса
    if (fieldId === 'accountBalance' && field.value && parseFloat(field.value) < 0) {
        showFieldError(fieldId, 'Баланс не может быть отрицательным');
        return false;
    }
    
    // Если поле валидно
    if (value && value !== '') {
        field.classList.add('field-valid');
        field.classList.remove('field-invalid');
    }
    
    return true;
}

// Очистка ошибки для конкретного поля
function clearFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}
