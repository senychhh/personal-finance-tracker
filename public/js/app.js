// Основной файл приложения для главной страницы

// Обновляем навигацию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const isAuth = isAuthenticated();
    if (typeof updateNavigation === 'function') {
        updateNavigation(isAuth);
    }
    
    // Обработчик для кнопки "Начать"
    const startBtn = document.querySelector('.btn-hero.btn-primary');
    if (startBtn && typeof openModal === 'function') {
        startBtn.addEventListener('click', () => {
            openModal('register');
        });
    }
    
    // Обработчик для кнопки "Подробнее"
    const moreBtn = document.querySelector('.btn-hero.btn-secondary');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            const allInOne = document.querySelector('#all-in-one');
            if (allInOne) {
                allInOne.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Обработчик для кнопки "Возможности" в навигации
    const featuresNavLink = document.querySelector('a[href="#features"]');
    if (featuresNavLink) {
        featuresNavLink.addEventListener('click', function (e) {
            e.preventDefault();
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Плавная прокрутка для навигационных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

