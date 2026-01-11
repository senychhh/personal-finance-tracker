// Основной файл приложения для главной страницы

// Обновляем навигацию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const isAuth = isAuthenticated();
    if (typeof updateNavigation === 'function') {
        updateNavigation(isAuth);
    }
    
    // Обновляем футер
    const footerDashboardLink = document.getElementById('footerDashboardLink');
    if (footerDashboardLink) {
        footerDashboardLink.style.display = isAuth ? 'inline-block' : 'none';
    }
});

