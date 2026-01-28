/**
 * Маршруты для аутентификации
 */

const express = require('express');
const authController = require('./controller');
const authMiddleware = require('../../middleware/auth');

const router = express.Router();

// Регистрация (публичный доступ)
router.post('/register', authController.register);

// Авторизация (публичный доступ)
router.post('/login', authController.login);

// Получение информации о текущем пользователе (требует аутентификации)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;

