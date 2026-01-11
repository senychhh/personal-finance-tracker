/**
 * Скрипт для выполнения миграций базы данных
 * Запуск: node src/database/migrations/run-migrations.js
 */

const fs = require('fs');
const path = require('path');
const { query } = require('../connection');

const migrationsDir = __dirname;

async function runMigrations() {
  console.log('🚀 Начало выполнения миграций...\n');

  try {
    // Получаем список файлов миграций, отсортированных по имени
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('❌ Файлы миграций не найдены');
      return;
    }

    console.log(`📋 Найдено миграций: ${files.length}\n`);

    // Выполняем каждую миграцию
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`📄 Выполнение: ${file}...`);

      try {
        // Выполняем SQL из файла
        await query(sql);
        console.log(`✅ Успешно: ${file}\n`);
      } catch (error) {
        console.error(`❌ Ошибка в миграции ${file}:`, error.message);
        throw error;
      }
    }

    console.log('✨ Все миграции выполнены успешно!');
  } catch (error) {
    console.error('💥 Критическая ошибка при выполнении миграций:', error);
    process.exit(1);
  }
}

// Запуск миграций
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('\n✅ Миграции завершены');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Ошибка выполнения миграций:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };

