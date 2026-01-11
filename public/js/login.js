// Обработка формы входа

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Инициализация валидации
if (typeof initFormValidation === 'function') {
    document.addEventListener('DOMContentLoaded', () => {
        initFormValidation();
    });
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Валидация формы перед отправкой
    if (typeof validateForm === 'function' && !validateForm(loginForm)) {
        return;
    }

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    // Скрываем предыдущие ошибки
    errorMessage.style.display = 'none';
    errorMessage.className = 'error-message';

    // Показываем индикатор загрузки
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Вход...';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Ошибка входа');
        }

        // Показываем сообщение об успехе
        errorMessage.className = 'success-message';
        errorMessage.textContent = 'Вход выполнен успешно! Перенаправление...';
        errorMessage.style.display = 'block';

        // Сохраняем токен и перенаправляем
        saveToken(data.data.token);
        submitBtn.textContent = 'Успешно!';
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1000);
    } catch (error) {
        errorMessage.className = 'error-message';
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
        
        // Убираем индикатор загрузки
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
    }
});

