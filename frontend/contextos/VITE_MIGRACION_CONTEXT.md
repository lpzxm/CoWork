# Contexto de migracion a Vite

Fecha inicio: 2026-05-28  
Ultima actualizacion: 2026-05-28 (higiene de dependencias + PostCSS + ESLint 9)

## Objetivo

Migrar el proyecto desde `react-scripts` (CRA) a `vite` manteniendo compatibilidad con archivos `.js` que contienen JSX y sin renombrar masivamente componentes.

---

## Cambios principales aplicados

### 1) Toolchain y scripts

Archivo: `package.json`

- Eliminado: `react-scripts`
- Scripts actuales:
  - `start` / `dev`: `vite`
  - `build`: `vite build`
  - `preview`: `vite preview`
  - `test`: `vitest run --passWithNoTests`
  - `lint`: `eslint src --max-warnings=0`
  - `analyze`: `vite build --mode analyze` (abre `dist/stats.html`)
- Dependencias clave de build:
  - `vite`, `@vitejs/plugin-react`, `vite-tsconfig-paths`, `vite-plugin-react-js-support`
  - `vitest`, `rollup-plugin-visualizer`

### 2) Configuracion de Vite

Archivo: `vite.config.js`

- `vite-tsconfig-paths` → respeta `baseUrl: src` de `jsconfig.json`
- `vite-plugin-react-js-support` → JSX dentro de archivos `.js`
- `@vitejs/plugin-react` → React Fast Refresh
- `define` inyecta tema Tailwind en runtime del cliente:
  - `__TW_COLORS__`, `__TW_HEIGHT__`, `__TW_SCREENS__`
- `manualChunks` para separar vendors (react, mui, charts, motion, etc.)
- `chunkSizeWarningLimit: 600` (ApexCharts es pesado por naturaleza)

### 3) Entrada HTML/JS

- Nuevo `index.html` en raiz (Vite lo usa como template)
- Nuevo `src/main.jsx` como entrypoint (`/src/main.jsx`)
- Eliminados: `public/index.html`, `src/index.js`
- CSS global: import de `./assets/styles/app.css` en `main.jsx` (ya no hace falta `watch:css` / `build:css` de CRA)

### 4) Entorno (`env`)

Archivo: `src/utils/env.js`

- `NODE_ENV` → `import.meta.env.MODE`
- `IS_DEV` → `import.meta.env.DEV`

Usado en: `App.js`, `store/index.js`, `DataTable.js`

### 5) Rutas y runtime

- Eliminado `src/history.js` y uso de prop `history` en `BrowserRouter` (React Router v6 no lo usa)
- `navigation.config/index.js`: removido import roto de `DIRECTORY_PREFIX_PATH`
- Guards en `VerticalMenuContent` y `UserDropdown` para estado Redux parcial al hidratar `redux-persist`

### 6) PostCSS (warnings eliminados)

Archivo: `postcss.config.js`

Pipeline actual (solo lo necesario para Vite + Tailwind):

```js
postcss-import → tailwindcss/nesting → tailwindcss → autoprefixer
```

Eliminados del pipeline (causaban warnings `Complex selectors ... :is(.dark *)`):

- `postcss-preset-env`
- `cssnano` (Vite minifica CSS en produccion)

### 7) Higiene de dependencias (sin `npm warn deprecated`)

#### Eliminado (CRA / obsoleto)

| Paquete | Motivo |
|---------|--------|
| `eslint-config-react-app` | Arrastraba ESLint 8, Babel proposal plugins, glob 7, rimraf |
| `source-map-explorer` | Arrastraba glob 7, inflight, rimraf 2 |
| `twin.macro` | Arrastraba `lodash.get` deprecated |
| `babel-plugin-macros` | Solo servia a twin.macro |
| `cross-env`, `npm-run-all`, `postcss-cli`, `postcss-preset-env`, `cssnano`, `postcss-nested` | Scripts/pipeline CRA ya no usados |

#### Añadido (moderno)

| Paquete | Uso |
|---------|-----|
| `eslint@9` + `eslint.config.mjs` | Lint sin stack CRA |
| `eslint-plugin-react`, `eslint-plugin-react-hooks`, `@eslint/js`, `globals` | Reglas React |
| `rollup-plugin-visualizer` | `npm run analyze` |
| `src/utils/tailwindTheme.js` | Reemplazo de `twin.macro` (colores/screens) |

#### Archivo `.npmrc`

```
fund=false
audit-level=moderate
```

- `fund=false` → oculta mensaje "packages are looking for funding"
- No elimina warnings de seguridad reales

#### Estado npm verificado

```text
npm install  → added ~582 packages, 0 vulnerabilities, sin deprecated warnings
npm run lint → OK
npm run build → OK, sin warnings PostCSS
```

**Conteo de paquetes:** ~794 (CRA) → ~583 (Vite limpio)

---

## Por que `npm install` no lista cada paquete

Es **comportamiento normal** de npm moderno (v7+), no un error.

| Situacion | Lo que ves |
|-----------|------------|
| Primera install (sin `node_modules`, con lockfile) | Resumen: `added 582 packages, and audited 583 packages in 57s` |
| Install repetido (`node_modules` ya existe y lock no cambio) | `up to date, audited 583 packages in 1s` |
| CRA antiguo / npm viejo | A veces imprimia cada paquete en una linea (mas ruidoso) |

npm **agrupa** la salida: descarga e instala todo el arbol de dependencias, pero solo muestra totales y tiempo. Los 582 paquetes **si se instalaron** (incluye dependencias transitivas de `react`, `vite`, `mui`, etc.).

Para ver mas detalle (opcional):

```powershell
npm install --loglevel verbose
```

Para listar que quedo instalado:

```powershell
npm ls --depth=0
```

---

## Problemas conocidos y solucion

### A) `504 Outdated Optimize Dep` / pantalla negra / login no carga

Causa: cache de Vite desactualizada o **dos servidores** corriendo (5173 viejo + 5174 nuevo).

```powershell
# Cerrar procesos en 5173/5174 si hace falta (ver PID con netstat)
netstat -ano | findstr ":5173"
taskkill /PID <pid> /F

Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
npm run dev -- --force --port 5173
```

En navegador: pestaña nueva + `Ctrl+F5`. Si persiste estado Redux viejo: limpiar Local Storage del sitio.

### B) `Port 5173 is in use, trying another one...` → abre en 5174

Significa que **ya hay otro Vite/Node** usando 5173 (terminal anterior, Cursor, etc.).

Opciones:

1. Cerrar el proceso viejo y usar solo `http://localhost:5173/`
2. O usar la URL que indique Vite (`http://localhost:5174/`) — no mezclar pestañas de ambos puertos

### C) Pantalla negra por Redux

Errores tipo `Cannot read properties of undefined (reading 'id')` en menu/header → estado `auth` incompleto al hidratar. Ya hay guards en `VerticalMenuContent` y `UserDropdown`. Si vuelve: `localStorage.clear()` y recargar.

---

## Como revertir (rollback completo a CRA)

1. Restaurar `package.json` con `react-scripts` y scripts CRA (`watch:css`, `build:css`, etc.)
2. Restaurar `public/index.html`, `src/index.js`, `src/history.js`
3. Eliminar: `index.html` (raiz), `vite.config.js`, `src/main.jsx`, `src/utils/env.js`, `src/utils/tailwindTheme.js`, `eslint.config.mjs`, `.npmrc`
4. Restaurar `.eslintrc.json` con `eslint-config-react-app`
5. Restaurar `postcss.config.js` con pipeline CRA si se requiere paridad exacta
6. `Remove-Item -Recurse node_modules; npm install`

Rollback rapido: `git restore` / `git checkout` sobre los archivos del repo.

---

## Nota para otro agente

- No quitar `vite-plugin-react-js-support` mientras existan `.js` con JSX en `src/`
- No reintroducir `postcss-preset-env` en dev sin motivo (vuelven warnings `:is(.dark *)`)
- No reintroducir `eslint-config-react-app` (vuelven deprecated warnings en install)
- Tema Tailwind en cliente va via `define` en `vite.config.js`, no `createRequire` en `tailwindTheme.js` (rompe bundle browser)
- Validar siempre: `npm install`, `npm run lint`, `npm run build`, `npm run dev`
