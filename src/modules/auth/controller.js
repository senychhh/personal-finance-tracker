// Обработка HTTP запросов для регистрации и авторизации
const authService = require('./service');

const authController = {
  // POST /api/auth/register
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Проверяем, что пришли все нужные данные
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email и пароль обязательны для заполнения',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: 'Пароль должен содержать минимум 6 символов',
        });
      }

      // Простая проверка формата email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Некорректный формат email',
        });
      }

      const result = await authService.register({
        email: email.toLowerCase().trim(),
        password,
        firstName,
        lastName,
      });

      res.status(201).json({
        message: 'Пользователь успешно зарегистрирован',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Проверяем наличие email и пароля
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email и пароль обязательны для заполнения',
        });
      }

      const result = await authService.login(
        email.toLowerCase().trim(),
        password
      );

      res.json({
        message: 'Успешная авторизация',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/me - информация о текущем пользователе
  // Требует токен в заголовке Authorization
  async getMe(req, res, next) {
    try {
      // req.user уже заполнен middleware auth
      res.json({
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;

