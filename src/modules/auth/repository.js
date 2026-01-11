// Работа с пользователями в базе данных
const { query } = require('../../database/connection');

const userRepository = {
  // Находим пользователя по email
  async findByEmail(email) {
    const result = await query(
      'SELECT id, email, password_hash, first_name, last_name, created_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  // Находим пользователя по ID
  async findById(id) {
    const result = await query(
      'SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  // Создаём нового пользователя в базе
  async create({ email, passwordHash, firstName, lastName }) {
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, first_name, last_name, created_at`,
      [email, passwordHash, firstName || null, lastName || null]
    );
    return result.rows[0];
  },

  // Проверяем, есть ли уже пользователь с таким email
  async emailExists(email) {
    const result = await query(
      'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
      [email]
    );
    return result.rows[0].exists;
  },
};

module.exports = userRepository;

