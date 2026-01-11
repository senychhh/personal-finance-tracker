// Вся логика аутентификации: хеширование паролей, работа с JWT токенами
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const userRepository = require('./repository');

const authService = {
  // Хешируем пароль перед сохранением в базу
  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  // Сравниваем введённый пароль с хешем из базы
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  },

  // Генерируем JWT токен для пользователя
  generateToken({ userId, email }) {
    return jwt.sign(
      { userId, email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  },

  // Проверяем JWT токен и достаём из него данные пользователя
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      return null;
    }
  },

  // Регистрация нового пользователя
  async register({ email, password, firstName, lastName }) {
    // Сначала проверяем, нет ли уже такого email
    const exists = await userRepository.emailExists(email);
    if (exists) {
      const error = new Error('Пользователь с таким email уже существует');
      error.status = 409; // Conflict
      throw error;
    }

    // Хешируем пароль и сохраняем пользователя
    const passwordHash = await this.hashPassword(password);
    const user = await userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    // Сразу выдаём токен, чтобы пользователь был авторизован
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    };
  },

  // Авторизация: проверяем email и пароль, выдаём токен
  async login(email, password) {
    // Ищем пользователя в базе
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Неверный email или пароль');
      error.status = 401; // Unauthorized
      throw error;
    }

    // Проверяем пароль
    const isPasswordValid = await this.comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      const error = new Error('Неверный email или пароль');
      error.status = 401;
      throw error;
    }

    // Всё ок, выдаём токен
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    };
  },
};

module.exports = authService;

