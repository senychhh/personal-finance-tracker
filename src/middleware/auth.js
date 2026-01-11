// Проверяем JWT токен и добавляем информацию о пользователе в req.user
const authService = require('../modules/auth/service'); 
const userRepository = require('../modules/auth/repository'); 

module.exports = async (req, res, next) => {
  try {
    // Достаём токен из заголовка Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Токен доступа не предоставлен',
      });
    }

    // Убираем "Bearer " и оставляем только токен
    const token = authHeader.substring(7);

    // Проверяем токен и достаём из него данные
    const decoded = authService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        error: 'Недействительный или истёкший токен',
      });
    }

    // Находим пользователя в базе по ID из токена
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Пользователь не найден',
      });
    }

    // Кладём информацию о пользователе в req, чтобы дальше можно было использовать
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Ошибка аутентификации',
    });
  }
};

