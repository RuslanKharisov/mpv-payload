# 🏭 OnStock B2B — Multitenant Website Template

> **Next.js + Payload CMS + PostgreSQL + Multitenant Plugin**  
> Готовое решение для построения многоарендных (multi-tenant) сайтов с общей административной панелью, изолированными данными и современным фронтендом на Next.js App Router.

---

## 🚀 Назначение проекта

**OnStock B2B** — это многоарендная (multi-tenant) CMS-платформа, созданная на базе [Payload CMS](https://payloadcms.com/) и [Next.js](https://nextjs.org/).  
Система используется для управления контентом, каталогами, продуктами и компаниями в рамках отдельных арендаторов (тенантов), сохраняя централизованный контроль и масштабируемую архитектуру.

---

## ⚙️ Основные технологии

| Компонент                   | Назначение                                     |
| --------------------------- | ---------------------------------------------- |
| **Next.js (App Router)**    | Фронтенд и SSR/SSG генерация                   |
| **Payload CMS**             | Бэкенд, API и админ-панель                     |
| **Multitenant Plugin**      | Разделение данных между компаниями (тенантами) |
| **PostgreSQL**              | Основная база данных                           |
| **TailwindCSS + shadcn/ui** | Современный UI/UX                              |
| **tRPC + React Query**      | Типобезопасное взаимодействие фронта и API     |
| **Resend Email Adapter**    | Отправка почтовых уведомлений                  |
| **PM2 + GitHub Actions**    | Продакшн деплой и управление процессами        |

---

## 🧩 Архитектура проекта

├── src/
│ ├── app/ # Next.js фронтенд (App Router)
│ ├── payload/ # Конфигурации Payload CMS
│ │ ├── collections/ # Коллекции контента (Users, Posts, Products и т.д.)
│ │ ├── globals/ # Глобальные сущности (Header, Footer, Settings)
│ │ └── plugins/ # Конфигурация Multitenant и других плагинов
│ ├── shared/ # Утилиты, TRPC, хуки и общие компоненты
│ └── widgets/ # Компоненты шапки, футера, виджетов
├── public/ # Статические ресурсы
├── .github/workflows/ # CI/CD пайплайн деплоя на VPS
├── package.json
├── payload.config.ts # Главная конфигурация Payload CMS
├── next.config.mjs
└── README.md

yaml
Копировать код

---

## 🧑‍💻 Установка и запуск локально

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/your-org/onstock-payload-b2b.git
cd onstock-payload-b2b
2. Установите зависимости
Рекомендуется использовать pnpm:

bash
Копировать код
pnpm install
3. Настройте переменные окружения
Создайте .env из шаблона:

bash
Копировать код
cp .env.example .env
Минимальный набор для локального запуска:

env
Копировать код
PAYLOAD_SECRET=dev-secret
DATABASE_URI=postgres://user:password@localhost:5432/onstock_b2b
RESEND_API=your-resend-api-key
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
4. Примените миграции
bash
Копировать код
npm run migrate:up
5. Запустите локально
bash
Копировать код
npm run dev
Откройте http://localhost:3000
и создайте первого администратора через интерфейс Payload.

🧱 Конфигурация Multitenant плагина
Плагин @payloadcms/plugin-multi-tenant позволяет изолировать данные арендаторов (тенантов) внутри общей базы данных.

Пример конфигурации:

ts
Копировать код
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'

export const plugins = [
  multiTenantPlugin({
    tenants: {
      slug: 'tenants',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'domain', type: 'text', unique: true },
      ],
    },
    collections: ['products', 'stocks', 'addresses'],
  }),
]
🧭 Пример использования:
Каждый тенант получает свои собственные коллекции (products, warehouses, stocks и т.п.)

Администратор управляет всеми тенантами из панели /admin

Пользователи видят только контент своего тенанта (фильтрация по tenantID)

🗂 Структура проекта и ключевые модули
Папка / файл	Назначение
src/payload.config.ts	Центральная конфигурация Payload (db, плагины, коллекции)
src/payload/collections/	Определения сущностей (Products, Tenants, Users...)
src/app/	Фронтенд, маршруты, компоненты Next.js
src/shared/trpc/	Логика серверных вызовов
src/widgets/	Header, Footer, SiteSettings
src/endpoints/	Кастомные API эндпоинты (например, импорт остатков)

🧮 Основные страницы и функции
/admin — Панель Payload CMS

/ — Главная страница сайта

/catalog — Каталог продуктов

/suppliers — Список поставщиков

/login, /register — Авторизация и регистрация

/profile — Кабинет пользователя с API-подключениями

/api/trpc — tRPC API маршруты

🧰 Команды npm/pnpm
Команда	Назначение
npm run dev	Запуск Next.js + Payload в режиме разработки
npm run build	Сборка фронтенда
npm run start	Запуск собранного проекта
npm run payload	CLI Payload CMS
npm run ci	Прогон миграций и билд для продакшена
npm run migrate:create	Создание новой миграции
npm run migrate:up	Применение всех миграций
npm run lint	Проверка кода линтером

🚢 Деплой и продакшн
Проект разворачивается на VPS автоматически при пуше в ветку main.

🧾 GitHub Actions Workflow
.github/workflows/deploy.yml выполняет:

Проверку изменений в коде

Синхронизацию через rsync

Установку зависимостей

Прогон миграций и билд (npm run ci)

Рестарт приложения через pm2

⚙️ Переменные окружения для продакшена
env
Копировать код
NODE_ENV=production
PAYLOAD_SECRET=supersecret
DATABASE_URI=postgres://user:password@localhost:5432/onstock_b2b
RESEND_API=your-resend-api-key
CRON_SECRET=your-cron-token
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
💡 Советы
Для PM2 используйте pm2 save после первого старта

Настройте бэкапы базы PostgreSQL

При изменении схемы всегда создавайте миграции (npm run migrate:create)

📚 Полезные ссылки
📖 Payload CMS Documentation

⚙️ Next.js Documentation

🧩 Payload Multitenant Plugin

💾 PostgreSQL Documentation

💬 Resend Email API

🪪 Лицензия
Проект распространяется под лицензией MIT.

💖 Благодарности
Создано с любовью для проекта Prom-Stock | Онлайн Склад
Базируется на официальном Payload Website Template и расширено под B2B и Multi-Tenant архитектуру.

markdown
Копировать код
> Build once — serve many tenants 🚀
```
