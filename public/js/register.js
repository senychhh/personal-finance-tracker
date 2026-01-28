// Обработка формы регистрации

const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');

// Инициализация валидации
if (typeof initFormValidation === 'function') {
    document.addEventListener('DOMContentLoaded', () => {
        initFormValidation();
    });
}

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Валидация формы перед отправкой
    if (typeof validateForm === 'function' && !validateForm(registerForm)) {
        return;
    }

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const submitBtn = registerForm.querySelector('button[type="submit"]');

    // Скрываем предыдущие ошибки
    errorMessage.style.display = 'none';
    errorMessage.className = 'error-message';

    // Показываем индикатор загрузки
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Регистрация...';

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, firstName, lastName }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Ошибка регистрации');
        }

        // Показываем сообщение об успехе
        errorMessage.className = 'success-message';
        errorMessage.textContent = 'Регистрация успешна! Перенаправление...';
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

