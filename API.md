# API Документация

## Базовый URL
```
http://localhost:3000/api
```

## Аутентификация

Большинство эндпоинтов требуют аутентификации через JWT токен. Токен передаётся в заголовке:

```
Authorization: Bearer <your_token_here>
```

---

## Эндпоинты

### Health Check

#### `GET /api/health`

Проверка работоспособности сервера.

**Ответ:**
```json
{
  "status": "ok",
  "environment": "development"
}
```

---

### Аутентификация

#### `POST /api/auth/register`

Регистрация нового пользователя.

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Иван",
  "lastName": "Иванов"
}
```

**Поля:**
- `email` (обязательно) - Email пользователя
- `password` (обязательно) - Пароль (минимум 6 символов)
- `firstName` (опционально) - Имя
- `lastName` (опционально) - Фамилия

**Успешный ответ (201):**
```json
{
  "message": "Пользователь успешно зарегистрирован",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "Иван",
      "lastName": "Иванов"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Ошибки:**
- `400` - Некорректные данные (не указан email/пароль, пароль слишком короткий, неверный формат email)
- `409` - Пользователь с таким email уже существует

---

#### `POST /api/auth/login`

Авторизация пользователя.

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Поля:**
- `email` (обязательно) - Email пользователя
- `password` (обязательно) - Пароль

**Успешный ответ (200):**
```json
{
  "message": "Успешная авторизация",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "Иван",
      "lastName": "Иванов"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Ошибки:**
- `400` - Не указан email или пароль
- `401` - Неверный email или пароль

---

#### `GET /api/auth/me`

Получение информации о текущем пользователе.

**Требует аутентификации:** Да

**Заголовки:**
```
Authorization: Bearer <token>
```

**Успешный ответ (200):**
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "Иван",
      "lastName": "Иванов"
    }
  }
}
```

**Ошибки:**
- `401` - Токен не предоставлен, недействителен или истёк

---

## Примеры использования

### Регистрация и авторизация

```bash
# 1. Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Тест",
    "lastName": "Тестов"
  }'

# 2. Авторизация
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. Получение информации о себе (замените TOKEN на полученный токен)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## Структура ошибок

Все ошибки возвращаются в следующем формате:

```json
{
  "error": "Описание ошибки"
}
```

Коды статусов:
- `400` - Некорректный запрос (валидация)
- `401` - Не авторизован
- `404` - Не найдено
- `409` - Конфликт (например, пользователь уже существует)
- `500` - Внутренняя ошибка сервера

