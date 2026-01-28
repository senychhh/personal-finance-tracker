// Валидация форм в реальном времени

// Валидация email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Валидация пароля
function validatePassword(password) {
    if (password.length < 6) {
        return { valid: false, message: 'Пароль должен содержать минимум 6 символов' };
    }
    return { valid: true, message: '' };
}

// Показываем сообщение об ошибке под полем
function showFieldError(input, message) {
    // Убираем предыдущее сообщение
    const existingError = input.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Убираем класс успеха
    input.classList.remove('field-valid');
    input.classList.add('field-invalid');

    // Добавляем новое сообщение
    if (message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
    }
}

// Показываем успешное состояние поля
function showFieldSuccess(input) {
    // Убираем предыдущее сообщение
    const existingError = input.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Убираем класс ошибки и добавляем успех
    input.classList.remove('field-invalid');
    input.classList.add('field-valid');
}

// Очищаем состояние поля
function clearFieldState(input) {
    input.classList.remove('field-invalid', 'field-valid');
    const existingError = input.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Валидация email в реальном времени
function setupEmailValidation(input) {
    input.addEventListener('blur', () => {
        const email = input.value.trim();
        if (email === '') {
            clearFieldState(input);
            return;
        }

        if (!validateEmail(email)) {
            showFieldError(input, 'Некорректный формат email');
        } else {
            showFieldSuccess(input);
        }
    });

    input.addEventListener('input', () => {
        // При вводе убираем ошибку, если поле пустое
        if (input.value.trim() === '') {
            clearFieldState(input);
        }
    });
}

// Валидация пароля в реальном времени
function setupPasswordValidation(input, minLength = 6) {
    input.addEventListener('blur', () => {
        const password = input.value;
        if (password === '') {
            clearFieldState(input);
            return;
        }

        const validation = validatePassword(password);
        if (!validation.valid) {
            showFieldError(input, validation.message);
        } else {
            showFieldSuccess(input);
        }
    });

    input.addEventListener('input', () => {
        // При вводе убираем ошибку, если поле пустое
        if (input.value === '') {
            clearFieldState(input);
        } else {
            // Показываем прогресс пароля
            const validation = validatePassword(input.value);
            if (validation.valid) {
                showFieldSuccess(input);
            }
        }
    });
}

// Инициализация валидации для всех форм
function initFormValidation() {
    // Валидация email полей
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        setupEmailValidation(input);
    });

    // Валидация паролей
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        setupPasswordValidation(input);
    });
}

// Проверка всей формы перед отправкой
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');

    inputs.forEach(input => {
        if (input.type === 'email') {
            const email = input.value.trim();
            if (!email || !validateEmail(email)) {
                showFieldError(input, 'Некорректный формат email');
                isValid = false;
            }
        } else if (input.type === 'password') {
            const validation = validatePassword(input.value);
            if (!validation.valid) {
                showFieldError(input, validation.message);
                isValid = false;
            }
        } else if (!input.value.trim()) {
            showFieldError(input, 'Это поле обязательно для заполнения');
            isValid = false;
        }
    });

    return isValid;
}

