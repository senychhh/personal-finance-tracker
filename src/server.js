const express = require('express');
const cors = require('cors');

const config = require('./config');
const { testConnection } = require('./database/connection');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Базовые middleware
app.use(cors());
app.use(express.json());

// Простой health-check эндпоинт
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: config.nodeEnv,
  });
});

// TODO: здесь позже подключим модули:
// app.use('/api/auth', authRoutes);
// app.use('/api/users', usersRoutes);
// и т.д.

// Middleware обработки ошибок – в самом конце цепочки
app.use(errorHandler);

async function start() {
  try {
    console.log('Проверка подключения к базе данных...');
    await testConnection();
    console.log('Подключение к базе данных установлено успешно');

    app.listen(config.port, () => {
      console.log(
        `Сервер запущен на порту ${config.port} в режиме ${config.nodeEnv}`,
      );
    });
  } catch (error) {
    console.error('Ошибка при запуске приложения:', error);
    process.exit(1);
  }
}

start();

