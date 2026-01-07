/**
 * Middleware для обработки ошибок
 * TODO: Реализовать централизованную обработку ошибок
 */

module.exports = (err, req, res, next) => {
  console.error('Ошибка:', err);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Внутренняя ошибка сервера',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

