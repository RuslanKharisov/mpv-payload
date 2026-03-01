# Техническое саммари проекта OnStock B2B

## Обзор проекта

**Название:** OnStock B2B  
**Назначение:** B2B платформа для управления складскими запасами и каталогом продукции с поддержкой мульти-тенантности  
**Стек технологий:**

- Frontend: Next.js 15, React 19, TypeScript
- CMS: PayloadCMS v3.77.0
- Backend: Node.js, PostgreSQL (через @payloadcms/db-postgres)
- API: tRPC 11 для внутреннего API, REST для внешних эндпоинтов
- UI: Radix UI, Tailwind CSS, Shadcn
- Другие: Zod (валидация), XLSX (импорт Excel), Resend (email)

## Архитектура

### Структура папок:

- `src/app/` - Next.js 15 приложение с App Router
  - `(frontend)/` - клиентская часть (публичные и приватные маршруты)
    - `(auth)/` - страницы аутентификации (login, register)
    - `(private)/` - защищенные маршруты личного кабинета поставщика
      - `[slug]/` - динамические страницы тенанта поставщика
      - `products/` - каталог товаров поставщика
      - `stock/` - управление складскими запасами
      - `cart/` - корзина заказов
      - `search/` - поиск и фильтрация товаров
    - `(public)/` - публичные страницы
      - `[slug]/` - публичные страницы тенанта (каталог, информация)
      - `products/` - публичный каталог товаров
      - `search/` - публичный поиск
    - `(sitemaps)/` - генерация sitemap
    - `(tenants)/suppliers/[slug]/` - публичный профиль поставщика
  - `(payload)/` - административная панель PayloadCMS
    - `admin/` - панель администратора
    - `api/` - API маршруты Payload
  - `api/trpc/[trpc]/` - tRPC маршрут
- `src/payload/` - конфигурация CMS
  - `collections/` - определения коллекций данных (Users, Tenants, Products, Stocks, Warehouses и др.)
  - `blocks/` - переиспользуемые блоки контента
  - `access/` - правила доступа
    - `authenticated.ts` - базовая аутентификация (`authenticated`, `isAuthenticatedFieldAccess`)
    - `isSuperAdmin.ts` - проверка супер-админа
    - `canReadTenant.ts` - чтение тенантов (супер-админы видят всех, пользователи — только свои)
  - `globals/` - глобальные настройки
  - `heros/` - компоненты шапки страниц
- `src/entities/` - бизнес-сущности (DDD подход), обеспечивающие логику личного кабинета поставщика
  - `auth/` - аутентификация пользователей
    - `api/{client|server}/` - tRPC процедуры для аутентификации
    - `_domain/` - схемы валидации
  - `products/` - работа с продуктами
    - `api/{client|server}/` - tRPC процедуры для работы с продуктами
    - `_domain/` - схемы и типы продуктов
  - `stocks/` - управление складскими запасами
    - `api/{client|server}/` - tRPC процедуры для работы со складами
    - `api/get-stocks-by-tenant.ts` - server action для получения остатков по тенанту с аутентификацией
    - `_domain/` - схемы и типы складских данных
    - `model/stock-with-relations.ts` - тип `StockWithRelations` для полностью загруженных связей
- `dashboard/` - дашборд поставщика
  - `api/get-supplier-dashboard-summary.ts` - server action для агрегации данных дашборда (пользователь, тенант, склады, остатки, подписка)
  - `tenants/` - работа с тенантами (профили поставщиков)
  - `api/server/get-tenants.ts` - server action для получения списка тенантов
  - `api/update-remote-config.ts` - server action для обновления конфигурации Google Таблиц
  - `api/{client|server}/` - tRPC процедуры для работы с тенантами
  - `_domain/` - схемы и типы тенантов
  - `user/` - работа с пользователями
  - `warehouse/` - управление складами
    - `api/get-warehouses-by-tenant.ts` - server action для получения складов по тенанту
    - `api/create-new-warehouse.ts` - server action для создания нового склада с проверкой фичи CAN_MANAGE_STOCK
    - `model/types.ts` - типы для UI представления складов
  - `remote-stock/` - работа с удаленными остатками (Google Таблицы)
  - `brands/` - работа с брендами
  - `cart/` - функционал корзины
  - `category/` - работа с категориями
  - `price-request/` - запросы коммерческих предложений
- `src/features/` - бизнес-функциональность (фичи), реализующие конкретные возможности ЛК поставщика
  - `auth/` - аутентификация и регистрация
  - `cart/` - корзина и оформление заказов
  - `get-sidebar-categories/` - получение категорий для боковой панели
  - `send-price-request/` - отправка запросов коммерческих предложений
    - `api/{client|server}/` - tRPC процедуры для отправки запросов
    - `email/` - генерация email-уведомлений
    - `forms/` - формы для запроса КП
    - `ui/` - UI компоненты для отправки запросов
  - `send-general-search-request/` - отправка общих поисковых запросов
  - `stock/` - функционал управления складом
- `src/shared/` - общие утилиты, провайдеры, UI компоненты, обеспечивающие работу личного кабинета
  - `providers/` - React провайдеры (Theme, TRPC, Session)
  - `trpc/` - конфигурация tRPC
    - `client.tsx` - клиент tRPC
    - `init.ts` - инициализация tRPC контекста
    - `routers/_app.ts` - главный роутер tRPC
    - `server.tsx` - сервер tRPC
  - `ui/` - переиспользуемые UI компоненты
  - `utilities/` - служебные утилиты
    - `getURL.ts` - получение URL сервера/клиента
    - `getMeUser.ts` - получение текущего пользователя из сессии
    - `getUserTenantIDs.ts` - получение ID тенантов пользователя
    - `extractID.ts` - извлечение ID из объекта или числа
- `src/components/` - переиспользуемые UI компоненты
  - `AdminBar/` - панель администратора
  - `Card/` - карточки элементов
  - `Link/` - кастомные ссылки
  - `Media/` - компоненты медиа
  - `Pagination/` - компоненты пагинации
  - `ProductTemplate/` - шаблон страницы продукта
  - `RichText/` - отображение форматированного текста
  - `ui/` - базовые UI компоненты
- `src/widgets/` - виджеты (шапка, подвал, фильтры и т.д.), используемые в личном кабинете поставщика
  - `cart/` - виджет корзины
  - `filters-sidebar/` - боковая панель фильтров
  - `footer/` - подвал сайта
  - `header/` - шапка сайта
  - `private-header/` - шапка личного кабинета
  - `private-sidebar/` - боковое меню личного кабинета
  - `products-catalog/` - каталог товаров
  - `remote-stocks-result/` - результаты удаленного поиска
  - `smart-data-table/` - умная таблица данных
  - `socials/` - социальные сети
  - `stock-search-bar/` - строка поиска остатков
  - `supplier-stocks/` - отображение остатков поставщика
  - `warehouses/` - управление складами и интеграция с Google Таблицами

### Frontend Logic (src/entities, src/features, src/widgets):

**Entities (src/entities):**

- `auth/` - предоставляет процедуры аутентификации и сессии для ЛК поставщика
- `products/` - API для получения и фильтрации товаров в каталоге поставщика
- `stocks/` - управление остатками и ценами на складе поставщика
- `tenants/` - работа с профилем и настройками тенанта-поставщика
- `warehouse/` - управление складами поставщика

**Features (src/features):**

- `send-price-request/` - позволяет клиентам отправлять запросы коммерческих предложений поставщику
- `stock/` - функционал импорта и управления остатками
- `cart/` - реализация корзины для B2B заказов

**Widgets (src/widgets):**

- `private-header/`, `private-sidebar/` - навигация в личном кабинете поставщика
- `products-catalog/` - отображение каталога товаров поставщика
- `supplier-dashboard/` - виджеты дашборда поставщика (FSD-архитектура)
  - `company-card/` - карточка компании
  - `user-card/` - карточка пользователя
  - `stats-cards/` - статистика (склады, остатки, SKU)
  - `quick-links-card/` - быстрые ссылки
  - `warehouses-sample/` - список складов
- `supplier-stocks/` - таблица управления остатками
- `smart-data-table/` - интерактивная таблица для работы с данными

### App Router (src/app):

**Private Cabinet Routes (`(private)/`):**

1. `[slug]/` - главная страница ЛК поставщика
2. `products/` - управление каталогом товаров
3. `stock/` - управление складскими остатками
4. `search/` - внутренний поиск по товарам
5. `suppliers/` - дашборд поставщика (обзор компании, складов, остатков)
   - Использует FSD-виджеты: `CompanyCard`, `UserCard`, `StatsCards`, `QuickLinksCard`, `WarehousesSample`
   - Server action `getSupplierDashboardSummary` для агрегации данных
   - Отображает информацию о подписке и доступе к управлению складами (`canManageStock`)
6. `suppliers/warehouses/` - управление локальными складами (создание, список)
   - Аутентификация через `getMeUser({ nullUserRedirect: '/login' })`
   - Проверка фичи `CAN_MANAGE_STOCK` для отображения кнопки создания
   - Использует `getWarehousesByTenant()` для загрузки складов
6. `suppliers/stocks/` - управление складскими остатками с табами
   - Таб "Локальные склады (БД)" - отображение остатков из БД с пагинацией
   - Таб "Google Таблицы (API)" - интеграция с внешними источниками
   - Аутентификация через `getMeUser({ nullUserRedirect: '/login' })`
   - Использует `getStocksByTenant()` для загрузки остатков с `depth: 2`

**Public Supplier Pages (`(public)/`, `(tenants)/suppliers/[slug]/`):**

- Публичные страницы каталога товаров поставщика
- Страницы информации о поставщике
- Поиск и фильтрация товаров для клиентов

### Shared Layer (src/shared):

**TRPC Configuration:**

- Используется для безопасного API взаимодействия между клиентом и сервером
- `baseProcedure` обеспечивает аутентификацию через Payload
- `createTRPCContext` предоставляет `payload` и `user` в контексте процедур
- Роутеры объединяются в `appRouter` для централизованного API

**Providers:**

- Theme provider для управления темой интерфейса
- TRPC provider для доступа к API
- Session provider для управления сессией пользователя

### Связь слоев:

Компоненты из `features` взаимодействуют с API через `entities`, используя tRPC процедуры:

- UI вызывает tRPC мутации/запросы из `features`
- `features` используют соответствующие процедуры из `entities/*/*/server`
- Серверные процедуры выполняют бизнес-логику и взаимодействуют с Payload CMS

### Текущий прогресс по ЛК поставщика:

**Реализовано:**

1. Регистрация и аутентификация тенантов-поставщиков
2. Управление профилем тенанта
3. Каталог товаров поставщика
4. Управление складскими остатками и ценами
5. Функция импорта Excel для обновления остатков
6. Отправка коммерческих предложений
7. Приватные маршруты для личного кабинета
8. Интеграция с Google Таблицами для удаленных остатков
9. Управление доступом: супер-админы видят все тенанты, пользователи — только свои
10. **Управление локальными складами:**
    - Страница `suppliers/warehouses/` для создания и просмотра складов
    - Server action `createNewWarehouse` с проверкой фичи `CAN_MANAGE_STOCK`
    - Server action `getWarehousesByTenant` для загрузки складов с адресами
11. **Управление остатками с табами:**
    - Страница `suppliers/stocks/` с табами "Локальные склады (БД)" и "Google Таблицы (API)"
    - Server action `getStocksByTenant` с аутентификацией и типобезопасностью (`StockWithRelations`)
    - Пагинация и отображение остатков в `LocalWarehouses` таблице

**В разработке:**

1. Интерфейс управления заказами
2. Расширенная аналитика

**Планируется:**

1. Интеграция с внешними ERP системами
2. Расширенные фильтры и сортировка
3. Управление подписками и тарифами

## Основные сущности и данные

- **Users** - пользователи системы с поддержкой ролей и тенантов
- **Tenants** - компании/организации в мульти-тенантной архитектуре
- **Products** - каталог продукции с артикулами, изображениями, категориями
- **ProductCategories** - иерархические категории продукции
- **Stocks** - складские запасы (кол-во, цены, условия, склады)
- **Warehouses** - склады с локациями
- **Brands** - производители/бренды продукции
- **Currencies** - валюты для ценообразования
- **Addresses** - адреса для складов (интеграция с DaData)

## Основные Flow / Процессы

### 1. Процесс авторизации:

API -> tRPC -> Auth Hook (Payload) -> Session/Token

### 2. Процесс импорта данных:

Excel файл -> FormData -> Endpoint `/import-stocks` -> XLSX parsing -> Validation (Zod) -> Create/Update Products/Stocks

### 3. Поиск и отображение товаров:

Client Request -> tRPC Query -> Payload Collections -> Response with Filtering

### 4. Запрос коммерческого предложения:

Form Submit -> tRPC Mutation -> Email Generation -> Send via Resend

### 5. Синхронизация статистики:

Product CRUD -> Hooks -> Update Category/Brand Counts

### 6. Интеграция с Google Таблицами:

1. Поставщик настраивает подключение к Google Таблице через интерфейс ЛК
2. Данные сохраняются в поля `apiUrl`, `apiToken`, `apiType` коллекции Tenants
3. При поиске остатков клиент вызывает tRPC-процедуру `remoteStocks.getByUrl`, которая на сервере выполняет HTTP-запрос к API Google Таблиц
4. Данные парсятся и отображаются в интерфейсе поиска
5. Конфигурация обновляется через server action `updateRemoteConfig`

## Точки расширения

- **Новые фичи:** В директориях `src/features/` и `src/entities/`
- **UI компоненты:** В `src/components/` и `src/widgets/`
- **Payload коллекции:** В `src/payload/collections/`
- **API процедуры:** В `src/entities/*/api/server/`
- **tRPC маршруты:** В `src/shared/trpc/routers/_app.ts`

## Зависимости (основные)

- **PayloadCMS** - основной CMS движок с админкой
- **Next.js 15** - фреймворк для рендеринга
- **PostgreSQL** - основная БД через @payloadcms/db-postgres
- **tRPC 11** - типизированный API между клиентом и сервером
- **Zod** - валидация данных
- **Resend** - отправка email
- **XLSX** - импорт Excel файлов
- **Radix UI + Tailwind** - компоненты и стили

## Нюансы реализации

- **Мульти-тенантность:** Реализована через плагин @payloadcms/plugin-multi-tenant
- **Импорт Excel:** Сложная валидация и связывание сущностей через SKU
- **Иерархические категории:** Поддержка вложенных категорий с автоматическим подсчетом товаров
- **Кэширование:** Использование React.cache и Next.js revalidation
- **SEO:** Поддержка метатегов через @payloadcms/plugin-seo
- **i18n:** Поддержка RU/EN локализаций
- **Технический долг:** Некоторые области используют хардкод (например, валидация имен пользователей)
- **Асинхронные операции:** Обработка импорта и обновления статистики через серверные эндпоинты
- **Аутентификация в Server Actions:** Server actions (`getStocksByTenant`, `createNewWarehouse`, `updateRemoteConfig`) используют `getMeUser({ nullUserRedirect: '/login' })` для проверки авторизации, не полагаясь только на layout-уровень защиты
- **DaData интеграция:** Используется для валидации адресов складов

## Структура связей (Relations)

### Связи между основными сущностями:

**Users ↔ Tenants:**

- Тип: Many-to-Many (через промежуточную таблицу в поле `tenants` у Users)
- Обязательная: Нет (пользователь может не иметь тенантов)
- Multi-tenant поле: `tenants` в коллекции Users

**Products → ProductCategories:**

- Тип: Many-to-One
- Обязательная: Нет
- Поле связи: `productCategory` в Products

**Products → Brands:**

- Тип: Many-to-One
- Обязательная: Нет
- Поле связи: `brand` в Products

**Products ↔ Stocks:**

- Тип: One-to-Many
- Обязательная: Да (для создания Stocks)
- Поле связи: `product` в Stocks указывает на Products

**Stocks → Warehouses:**

- Тип: Many-to-One
- Обязательная: Нет
- Поле связи: `warehouse` в Stocks

**Stocks → Currencies:**

- Тип: Many-to-One
- Обязательная: Да
- Поле связи: `currency` в Stocks

**Stocks → Tenants:**

- Тип: Many-to-One
- Обязательная: Да (для мульти-тенантности)
- Multi-tenant поле: `tenant` в Stocks

**ProductCategories → ProductCategories:**

- Тип: Self-referencing (Parent-Child)
- Обязательная: Нет
- Поле связи: `parent` в ProductCategories (реализовано через плагин nested-docs)

**Warehouses → Addresses:**

- Тип: Many-to-One
- Обязательная: Да
- Поле связи: `warehouse_address` в Warehouses

## Логика доступа и фильтрации

### Tenant Isolation:

- Изоляция тенантов реализована через автоматическое добавление поля `tenant` в коллекцию Stocks через хук `beforeValidate` (set-stock-defaults.ts)
- Доступ к данным контролируется через правила доступа в каждой коллекции
- В коллекции **Tenants** реализована проверка `canReadTenant`: супер-админы видят всех, обычные пользователи — только свои тенанты
- В коллекции **Users** поле `tenants` доступно для чтения аутентифицированным пользователям (`isAuthenticatedFieldAccess`), но редактируется только супер-админами
- В коллекции Stocks доступ к чтению/редактированию ограничен аутентифицированными пользователями, а создание требует активной подписки с фичей CAN_MANAGE_STOCK

### Роли пользователей:

- `super-admin` - полный доступ ко всем функциям, может управлять ролями пользователей
- `admin` - административные права
- `user` - стандартная роль
- `content-editor` - редактор контента
- `tenant-admin` - администратор тенанта
- `tenant-viewer` - просмотрщик тенанта

### Безопасность tRPC:

- Для защиты tRPC процедур используется `baseProcedure` с аутентификацией через Payload
- Контекст tRPC (`createTRPCContext`) содержит `payload` и `user` — текущего аутентифицированного пользователя
- В процедурах реализованы проверки на принадлежность данных конкретному тенанту пользователя через `getUserTenantIDs`
- Коллекция Stocks использует хуки для автоматического связывания с тенантом текущего пользователя