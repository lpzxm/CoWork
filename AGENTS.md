# AGENTS.md — CoWork Monorepo

Backend: Laravel 13 + Passport API. Frontend: React 18 + Redux + MUI + Vite.

## Directory map

```
CoWork/
├── backend/   Laravel API (PHP 8.3)
│   ├── app/
│   │   ├── DTOs/        Spatie Laravel Data (custom validateWithId() pattern)
│   │   ├── Http/
│   │   │   ├── Controllers/  (Auth, User, Task, SubTask, File, Status)
│   │   │   │   └── Auth/     AuthController.php (register, login, verifyToken, logout)
│   │   │   ├── Middleware/   (empty, unused)
│   │   │   └── Resources/    JSON resources (camelCase `coordinatorsAssigned` vs snake_case rest)
│   │   ├── Mail/            UserVerificationCodeMail
│   │   ├── Models/          Task, SubTask, File, Status, User, CoordinatorTask, VerifyCode
│   │   └── Providers/       AppServiceProvider (Passport expiry + rate limiters)
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/         DatabaseSeeder, RolePermissionSeeder, StatusSeeder
│   └── routes/
│       └── api.php          All routes under `auth:api` middleware
├── frontend/  React 18 + Vite (JS, not TS)
│   └── src/
│       ├── configs/         app.config.js (API base URL), routes.config/, navigation.config/
│       ├── constants/
│       ├── services/        BaseService.js (axios + interceptors), ApiService.js
│       ├── store/           Redux: auth/, theme/, locale/
│       ├── views/           Routes: Home, tasks, permission
│       └── mock/            MirageJS mock server (enableMock flag)
```

## Backend — key facts

- **API prefix:** `/cowork` (set in `bootstrap/app.php` `apiPrefix: 'cowork'`)
- **Auth guard:** `api` (Passport). Default guard overridden in `.env`: `AUTH_GUARD=api`
- **2FA login flow:** `POST /login` → sends code to email → `POST /verify-token` with code → returns Passport token
- **Rate limiting:** login & verify 5 req/min per `email|ip`; global API 100 req/min per `user_id|ip`
- **Roles:** `super-admin`, `admin`, `coordinador` (Spatie Permission). Controllers use `hasRole()`, not granular `can()` — permissions defined in seeder are ornamental
- **Status constants** (`app/Models/Status.php`): 1=Creado, 2=Pendiente, 3=En Progreso, 4=Completado, 5=En Revisión, 6=Aprobado, 7=Rechazado
- **Error handling pattern** all controllers: `catch (ValidationException)` → `catch (QueryException)` → `catch (\Exception)`, Spanish messages
- **Soft deletes** on Task, SubTask, File
- **File storage:** `public` disk (`storage/app/public/files/`), symlink must exist
- **Allowed uploads:** pdf, pptx, doc, docx, xls, xlsx, jpg, jpeg, png, gif, webp (max 50 MB)
- **CoordinatorTaskController** is empty — not registered in routes
- **Register route** `/register` is commented out (defaults to super-admin, security risk)
- **No Mailpit running** — email sending is inactive
- **DTO pattern:** `FileData::validateWithId($data)`, `TaskData::validateWithId($data, $taskId)` — static method merges create/update rules with optional ID for unique-except-self validation

### Backend commands

```bash
# Setup (first time)
composer run setup

# Dev servers (PHP serve + queue + Vite concurrently)
composer run dev

# Run tests (SQLite :memory:)
composer run test

# Create storage symlink
php artisan storage:link

# Cache clear (before tests)
php artisan config:clear
```

### Backend DB

- MySQL (`bd_coWork`). Queue driver: `database`. Cache: `database`. Session: `database`.
- Broadcast: Laravel Reverb (WebSocket on port 8080)
- Mail: SMTP on port 1025 (Mailpit-like)
- Passport OAuth tables. No `AuthServiceProvider` gates/policies.

### Seeder order

1. `RolePermissionSeeder` — 3 roles + 16 permissions
2. `StatusSeeder` — 7 status rows (must match Status constants)
3. `DatabaseSeeder` orchestrates both

## Frontend — key facts

- **JS only** (no TypeScript). `jsconfig.json` maps `src/` as baseUrl for absolute imports
- **API base URL** in `src/configs/app.config.js` (copy from `.example`). Currently points to `http://127.0.0.1:8000/api` — note `/api` vs backend's `/cowork` prefix.
- **Mock server:** miragejs, enabled via `appConfig.enableMock = true`
- **ESLint** very permissive: `no-unused-vars: off`, most rules suppressed
- **Formatting:** Prettier (`prettier --write .`)
- **State:** Redux Toolkit + redux-persist. Auth token stored in persist, injected by axios interceptor
- **Auth interceptor:** auto sign-out on 401 responses
- **Routing:** `react-router-dom` v6, lazy-loaded views in `configs/routes.config/`
- **UI:** MUI 5 + Tailwind 3 + ApexCharts + FullCalendar
- **Tests:** Vitest (`npm test`)

### Frontend commands

```bash
npm run dev          # dev server
npm run build        # production build
npm run lint         # eslint src --max-warnings=0
npm run format       # prettier --write .
npm test             # vitest run --passWithNoTests
```

## Quirks & gotchas

- `coordinators_ids` not sent → no sync; sent as `[]` → `sync([])` removes all coordinators
- `TaskResource` key `coordinatorsAssigned` is camelCase; every other resource key is snake_case
- `coordinator_tasks` pivot has nullable `user_id` in migration (should be `nullable(false)`)
- `coordinator_tasks` has no unique constraint on `(user_id, task_id)`
- `admin` role can delete users/tasks in controller code, but permissions seed says `users.delete` and `tasks.delete` are NOT assigned to admin (controllers use `hasRole()` not `can()`, so the seed permissions for admin on delete are wrong)
- `subtasks.approve` permission exists but no controller checks it
- `StatusController::index` and `show` have no role check (any authenticated user)
- `StatusController::destroy` is super-admin only (stricter than store/update which allow admin)
- `configs/app.config.js` is gitignored, must be copied from `.example`
- Frontend `app.config.js` uses `apiPrefix: '/api'` but backend routes are under `/cowork` — may need updating for deployment
