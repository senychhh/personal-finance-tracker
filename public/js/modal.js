// Управление popup для входа и регистрации

const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const closeModal = document.getElementById('closeModal');
const modalTabs = document.querySelectorAll('.modal-tab');
const tabContents = document.querySelectorAll('.modal-tab-content');

// Инициализация валидации при загрузке
if (typeof initFormValidation === 'function') {
    document.addEventListener('DOMContentLoaded', () => {
        initFormValidation();
    });
}

// Открытие popup
function openModal(tab = 'login') {
    authModal.style.display = 'block';
    switchTab(tab);
}

// Закрытие popup
function closeModalFunc() {
    authModal.style.display = 'none';
    // Очищаем формы и ошибки
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.reset();
        // Очищаем состояния полей
        loginForm.querySelectorAll('input').forEach(input => {
            if (typeof clearFieldState === 'function') {
                clearFieldState(input);
            }
        });
    }
    
    if (registerForm) {
        registerForm.reset();
        // Очищаем состояния полей
        registerForm.querySelectorAll('input').forEach(input => {
            if (typeof clearFieldState === 'function') {
                clearFieldState(input);
            }
        });
    }
    
    const loginError = document.getElementById('loginErrorMessage');
    const registerError = document.getElementById('registerErrorMessage');
    if (loginError) loginError.hidden = true;
    if (registerError) registerError.hidden = true;
}

// Переключение между вкладками
function switchTab(tabName) {
    // Убираем активный класс у всех вкладок
    modalTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });

    // Показываем нужный контент
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}Tab`) {
            content.classList.add('active');
        }
    });
}

// Обработчики событий
if (loginBtn) {
    loginBtn.addEventListener('click', () => openModal('login'));
}

if (registerBtn) {
    registerBtn.addEventListener('click', () => openModal('register'));
}

if (closeModal) {
    closeModal.addEventListener('click', closeModalFunc);
}

// Закрытие при клике вне popup
window.addEventListener('click', (event) => {
    if (event.target === authModal) {
        closeModalFunc();
    }
});

// Переключение вкладок
modalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
    });
});

// Обработка формы входа в popup
const loginForm = document.getElementById('loginForm');
const loginErrorMessage = document.getElementById('loginErrorMessage');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Валидация формы перед отправкой
        if (typeof validateForm === 'function' && !validateForm(loginForm)) {
            return;
        }

        const email = document.getElementById('modalEmail').value.trim();
        const password = document.getElementById('modalPassword').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        // Скрываем предыдущие сообщения
        loginErrorMessage.hidden = true;
        loginErrorMessage.className = 'error-message';

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
            loginErrorMessage.className = 'success-message';
            loginErrorMessage.textContent = 'Вход выполнен успешно! Перенаправление...';
            loginErrorMessage.hidden = false;

            // Сохраняем токен и обновляем навигацию
            saveToken(data.data.token);
            if (typeof updateNavigation === 'function') {
                updateNavigation(true);
            }
            submitBtn.textContent = 'Успешно!';
            setTimeout(() => {
                closeModalFunc();
                window.location.href = '/dashboard.html';
            }, 1000);
        } catch (error) {
            loginErrorMessage.className = 'error-message';
            loginErrorMessage.textContent = error.message;
            loginErrorMessage.hidden = false;
            
            // Убираем индикатор загрузки
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;
        }
    });
}

// Обработка формы регистрации в popup
const registerForm = document.getElementById('registerForm');
const registerErrorMessage = document.getElementById('registerErrorMessage');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Валидация формы перед отправкой
        if (typeof validateForm === 'function' && !validateForm(registerForm)) {
            return;
        }

        const email = document.getElementById('modalRegEmail').value.trim();
        const password = document.getElementById('modalRegPassword').value;
        const firstName = document.getElementById('modalFirstName').value.trim();
        const lastName = document.getElementById('modalLastName').value.trim();
        const submitBtn = registerForm.querySelector('button[type="submit"]');

        // Скрываем предыдущие сообщения
        registerErrorMessage.hidden = true;
        registerErrorMessage.className = 'error-message';

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
            registerErrorMessage.className = 'success-message';
            registerErrorMessage.textContent = 'Регистрация успешна! Перенаправление...';
            registerErrorMessage.hidden = false;

            // Сохраняем токен и обновляем навигацию
            saveToken(data.data.token);
            if (typeof updateNavigation === 'function') {
                updateNavigation(true);
            }
            submitBtn.textContent = 'Успешно!';
            setTimeout(() => {
                closeModalFunc();
                window.location.href = '/dashboard.html';
            }, 1000);
        } catch (error) {
            registerErrorMessage.className = 'error-message';
            registerErrorMessage.textContent = error.message;
            registerErrorMessage.hidden = false;
            
            // Убираем индикатор загрузки
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;
        }
    });
}

