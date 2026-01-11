// Панель управления - загрузка данных и отображение

async function loadUserInfo() {
    try {
        const data = await apiRequest('/auth/me');
        const userInfo = document.getElementById('userInfo');
        if (userInfo && data.data.user) {
            const user = data.data.user;
            userInfo.textContent = `${user.firstName || ''} ${user.lastName || ''} (${user.email})`.trim();
        }
    } catch (error) {
        console.error('Ошибка загрузки информации о пользователе:', error);
    }
}

async function loadDashboardData() {
    try {
        // Здесь будут запросы к API для загрузки счетов, категорий, транзакций
        // Пока просто заглушки
        document.getElementById('accountsCount').textContent = '0';
        document.getElementById('categoriesCount').textContent = '0';
        document.getElementById('transactionsCount').textContent = '0';

        // Показываем пустые состояния
        const accountsList = document.getElementById('accountsList');
        const transactionsList = document.getElementById('transactionsList');
        
        if (accountsList) {
            accountsList.innerHTML = '<div class="empty-state">Счета пока не добавлены</div>';
        }
        
        if (transactionsList) {
            transactionsList.innerHTML = '<div class="empty-state">Транзакции пока не добавлены</div>';
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadDashboardData();

    // Обработчик кнопки добавления счёта
    const addAccountBtn = document.getElementById('addAccountBtn');
    if (addAccountBtn) {
        addAccountBtn.addEventListener('click', () => {
            alert('Функция добавления счёта будет реализована позже');
        });
    }
});

