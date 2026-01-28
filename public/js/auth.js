// Работа с аутентификацией: сохранение токена, проверка авторизации
const API_BASE_URL = '/api';

// Сохраняем токен в localStorage
function saveToken(token) {
    localStorage.setItem('token', token);
}

// Получаем токен из localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Удаляем токен
function removeToken() {
    localStorage.removeItem('token');
}

// Проверяем, авторизован ли пользователь
function isAuthenticated() {
    return !!getToken();
}

// Делаем запрос к API с токеном
async function apiRequest(url, options = {}) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Ошибка запроса');
    }

    return data;
}

// Проверяем авторизацию и перенаправляем на нужную страницу
function checkAuth() {
    const isAuth = isAuthenticated();
    const currentPage = window.location.pathname;

    // Если пользователь авторизован и на странице логина/регистрации
    if (isAuth && (currentPage.includes('login.html') || currentPage.includes('register.html'))) {
        window.location.href = '/dashboard.html';
        return;
    }

    // Если пользователь не авторизован и на защищённой странице
    if (!isAuth && currentPage.includes('dashboard.html')) {
        window.location.href = '/login.html';
        return;
    }

    // Обновляем навигацию
    updateNavigation(isAuth);
}

// Обновляем навигацию в зависимости от авторизации
function updateNavigation(isAuth) {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const dashboardLink = document.getElementById('dashboardLink');

    // Скрываем/показываем кнопки входа и регистрации
    if (loginBtn) loginBtn.style.display = isAuth ? 'none' : 'inline-block';
    if (registerBtn) registerBtn.style.display = isAuth ? 'none' : 'inline-block';
    
    // Показываем/скрываем кнопку панели управления
    if (dashboardLink) dashboardLink.style.display = isAuth ? 'inline-block' : 'none';
}

// Выход из системы
function logout() {
    // Разрешаем навигацию назад перед выходом
    if (typeof window.allowBackNavigation === 'function') {
        window.allowBackNavigation();
    }
    
    removeToken();
    window.location.href = '/';
}

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuth);
} else {
    checkAuth();
}

// Обработчик ссылки выхода в сайдбаре
document.addEventListener('DOMContentLoaded', () => {
    const sidebarLogoutLink = document.getElementById('sidebarLogoutLink');
    if (sidebarLogoutLink) {
        sidebarLogoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    }
});

