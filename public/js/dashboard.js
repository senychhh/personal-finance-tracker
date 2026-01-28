// Панель управления - загрузка данных и отображение

async function loadUserInfo() {
    try {
        const data = await apiRequest('/auth/me');
        const userInfo = document.getElementById('userInfo');
        if (userInfo && data.data.user) {
            const user = data.data.user;
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            const email = user.email || '';
            
            // Форматируем информацию о пользователе
            if (fullName && email) {
                userInfo.innerHTML = `<div>${fullName}</div><div style="font-size: 0.75rem; color: var(--text-light);">${email}</div>`;
            } else if (fullName) {
                userInfo.textContent = fullName;
            } else if (email) {
                userInfo.textContent = email;
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки информации о пользователе:', error);
    }
}

async function loadDashboardData() {
    try {
        await Promise.all([
            loadBalanceSummary(),
            loadRecentTransactions()
        ]);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

async function loadBalanceSummary() {
    try {
        const accountsData = await apiRequest('/accounts');
        const accounts = accountsData?.data?.accounts || [];
        const totalBalance = accounts.reduce((sum, account) => {
            const amount = parseFloat(account.balance || 0);
            return sum + (Number.isNaN(amount) ? 0 : amount);
        }, 0);

        const transactionsData = await apiRequest('/transactions');
        const transactions = transactionsData?.data?.transactions || [];
        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach((transaction) => {
            const amount = parseFloat(transaction.amount || 0);
            if (Number.isNaN(amount) || amount === 0) return;
            if (amount > 0) {
                totalIncome += amount;
            } else {
                totalExpenses += Math.abs(amount);
            }
        });

        const totalBalanceEl = document.getElementById('totalBalance');
        const totalIncomeEl = document.getElementById('totalIncome');
        const totalExpensesEl = document.getElementById('totalExpenses');

        if (totalBalanceEl) totalBalanceEl.textContent = formatCurrency(totalBalance);
        if (totalIncomeEl) totalIncomeEl.textContent = `+${formatCurrency(totalIncome)}`;
        if (totalExpensesEl) totalExpensesEl.textContent = `-${formatCurrency(totalExpenses)}`;
    } catch (error) {
        console.error('Ошибка загрузки сводки:', error);
    }
}

async function loadRecentTransactions() {
    try {
        const transactionsData = await apiRequest('/transactions?limit=5');
        const transactions = transactionsData?.data?.transactions || [];
        const list = document.getElementById('recentTransactions');
        if (!list) return;

        if (transactions.length === 0) {
            list.innerHTML = '<div class="empty-state">Операции пока не добавлены</div>';
            return;
        }

        list.innerHTML = transactions.map((transaction) => {
            const amount = parseFloat(transaction.amount || 0);
            const isIncome = amount > 0;
            const categoryName = transaction.category?.name
                || transaction.category_name
                || transaction.categoryName
                || 'Без категории';
            const description = transaction.description || 'Операция';
            const amountText = `${isIncome ? '+' : '-'}${formatCurrency(Math.abs(amount))}`;
            const iconClass = getOperationIconClass(categoryName, transaction.type);
            const iconSvg = getOperationIconSvg(iconClass);

            return `
                <div class="operation-item">
                    <div class="operation-icon ${iconClass}">
                        ${iconSvg}
                    </div>
                    <div class="operation-info">
                        <div class="operation-name">${description}</div>
                        <div class="operation-category">${categoryName}</div>
                    </div>
                    <div class="operation-amount ${isIncome ? 'positive' : 'negative'}">${amountText}</div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Ошибка загрузки операций:', error);
        const list = document.getElementById('recentTransactions');
        if (list) {
            list.innerHTML = '<div class="empty-state">Не удалось загрузить операции</div>';
        }
    }
}

function formatCurrency(value) {
    const number = Number.isFinite(value) ? value : 0;
    return `BR ${number.toFixed(2)}`;
}

function getOperationIconClass(categoryName, type) {
    const name = (categoryName || '').toLowerCase();
    if (type === 'income' || name.includes('доход') || name.includes('зарплат')) {
        return 'operation-icon-income';
    }
    if (name.includes('подписк') || name.includes('netflix')) {
        return 'operation-icon-subscription';
    }
    if (name.includes('кафе') || name.includes('еда') || name.includes('продукт')) {
        return 'operation-icon-cart';
    }
    return 'operation-icon-cafe';
}

function getOperationIconSvg(iconClass) {
    if (iconClass === 'operation-icon-income') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>`;
    }
    if (iconClass === 'operation-icon-subscription') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>`;
    }
    if (iconClass === 'operation-icon-cart') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>`;
    }
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="8"></line>
        <line x1="10" y1="1" x2="10" y2="8"></line>
        <line x1="14" y1="1" x2="14" y2="8"></line>
    </svg>`;
}

// Защита от навигации назад
let allowBackNavigation = false;

// Обработчик нажатия кнопки "Назад"
function handleBackButton(event) {
    if (!allowBackNavigation) {
        // Возвращаемся на текущую страницу
        history.pushState(null, '', window.location.href);
        // Показываем сообщение
        alert('Для выхода из профиля используйте кнопку "Выйти"');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, что пользователь авторизован
    if (typeof isAuthenticated === 'function' && isAuthenticated()) {
        // Добавляем запись в историю браузера
        history.pushState(null, '', window.location.href);
        // Подключаем обработчик нажатия "Назад"
        window.addEventListener('popstate', handleBackButton);
    }
    
    setupBurgerMenu();
    loadUserInfo();
    loadDashboardData();
});

// Экспортируем функцию для разрешения навигации назад (для auth.js)
if (typeof window !== 'undefined') {
    window.allowBackNavigation = function() {
        allowBackNavigation = true;
        window.removeEventListener('popstate', handleBackButton);
    };
}

function setupBurgerMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const sidebar = document.getElementById('dashboardSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (!burgerBtn || !sidebar || !sidebarOverlay) return;
    const sidebarLinks = Array.from(sidebar.querySelectorAll('.sidebar-link'));

    const closeMenu = () => {
        sidebar.classList.remove('is-open');
        sidebarOverlay.hidden = true;
        burgerBtn.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
        sidebar.classList.add('is-open');
        sidebarOverlay.hidden = false;
        burgerBtn.setAttribute('aria-expanded', 'true');
    };

    burgerBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    sidebarOverlay.addEventListener('click', closeMenu);

    const setActiveLink = (activeLink) => {
        sidebarLinks.forEach((link) => link.classList.remove('is-active'));
        if (activeLink) activeLink.classList.add('is-active');
    };

    const navigateToSection = (link) => {
        const href = link.getAttribute('href') || '';
        const targetId = href.startsWith('#') ? href : '';
        const target = targetId ? document.querySelector(targetId) : null;
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setActiveLink(link);
        closeMenu();
    };

    sidebarLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            // Проверяем, не является ли это ссылкой выхода
            if (link.id === 'sidebarLogoutLink' || link.getAttribute('href') === '#logout') {
                if (typeof logout === 'function') {
                    logout();
                }
                return;
            }
            navigateToSection(link);
        });
    });

    const defaultLink = sidebarLinks.find((link) => link.getAttribute('href') === '#summary') || sidebarLinks[0];
    if (defaultLink) {
        setActiveLink(defaultLink);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}
