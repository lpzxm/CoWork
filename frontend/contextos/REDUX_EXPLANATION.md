# Redux en el Frontend — Explicación Completa

## Índice

1. [¿Qué es Redux?](#1-qué-es-redux)
2. [Estructura del Store](#2-estructura-del-store)
3. [Configuración del Store](#3-configuración-del-store)
4. [Persistencia con redux-persist](#4-persistencia-con-redux-persist)
5. [Los Slices — Cada uno explicado](#5-los-slices--cada-uno-explicado)
   - [5a. theme](#5a-theme)
   - [5b. locale](#5b-locale)
   - [5c. base / common](#5c-base--common)
   - [5d. auth / session](#5d-auth--session)
   - [5e. auth / user](#5e-auth--user)
   - [5f. auth / employee](#5f-auth--employee)
   - [5g. auth / functionalPosition](#5g-auth--functionalposition)
   - [5h. auth / organizationalUnit](#5h-auth--organizationalunit)
   - [5i. auth / notifications](#5i-auth--notifications)
6. [Cómo se provee el Store a la App](#6-cómo-se-provee-el-store-a-la-app)
7. [Cómo se usa Redux en los componentes](#7-cómo-se-usa-redux-en-los-componentes)
8. [Regla clave del proyecto](#8-regla-clave-del-proyecto)

---

## 1. ¿Qué es Redux?

Redux es un **manejador de estado global** para aplicaciones JavaScript. En lugar de que cada componente maneje su propio estado local (con `useState`), Redux centraliza ciertos datos en un solo lugar llamado **store** al que cualquier componente puede acceder.

### Conceptos básicos:

- **Store:** Objeto que contiene todo el estado global.
- **Slice:** Porción del store que maneja una parte específica del estado (ej: autenticación, tema visual, idioma).
- **Action:** Objeto con un `type` y un `payload` que describe qué ocurrió.
- **Reducer:** Función pura que recibe el estado actual y una acción, y devuelve el nuevo estado.
- **Dispatch:** Función para enviar acciones al store.
- **Selector:** Función que extrae una parte del estado (`useSelector`).

### Flujo de datos:

```
Componente → dispatch(action) → reducer → nuevo estado → componente se re-renderiza
```

---

## 2. Estructura del Store

El store tiene esta forma:

```js
{
  theme: { ... },
  locale: { ... },
  base: {
    common: { ... }
  },
  auth: {
    session: { ... },
    user: { ... },
    employee: { ... },
    functionalPosition: { ... },
    organizationalUnit: { ... },
    notifications: { ... }
  }
}
```

Se construye combinando slices en `rootReducer.js`:

```
rootReducer
  ├── theme           (themeSlice)
  ├── locale          (localeSlice)
  ├── base            (combina commonSlice)
  │   └── common
  ├── auth            (combina 6 slices)
  │   ├── session
  │   ├── user
  │   ├── employee
  │   ├── functionalPosition
  │   ├── organizationalUnit
  │   └── notifications
  └── asyncReducers   (se inyectan dinámicamente si es necesario)
```

---

## 3. Configuración del Store

Archivo: `src/store/index.js`

```js
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './rootReducer'

const persistConfig = {
    key: 'admin',
    storage,                // localStorage
    whitelist: ['auth', 'locale'],
}

const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer()),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
    devTools: true,         // solo en desarrollo
})
```

**Puntos clave:**

- Usa `configureStore` de Redux Toolkit (no el viejo `createStore`).
- El rootReducer se envuelve con `persistReducer` para guardar ciertos slices en localStorage.
- Los checks de inmutabilidad y serialización están desactivados (necesario para que redux-persist funcione sin falsos positivos).

### Inyección dinámica de reducers

El store soporta `injectReducer(key, reducer)` y `removeReducer(key)` para cargar reducers bajo demanda (carga perezosa). Esto permite que módulos grandes agreguen su propio estado al store solo cuando se usan.

---

## 4. Persistencia con redux-persist

redux-persist guarda el estado de Redux en `localStorage` y lo restaura al recargar la página.

**Slices persistidos:**

| Slice | ¿Persistido? | Razón |
|---|---|---|
| `auth` | Sí | El token y datos del usuario deben sobrevivir al refresh |
| `locale` | Sí | El idioma elegido debe mantenerse entre sesiones |
| `theme` | No | El tema se define con cada carga según preferencias del sistema |
| `base` | No | Los metadatos de ruta son transitorios |

**Provider:** `PersistGate` envuelve la app para que no renderice hasta que el estado persistido se haya restaurado.

---

## 5. Los Slices — Cada uno explicado

### 5a. `theme`

**Archivo:** `src/store/theme/themeSlice.js`

**Propósito:** Controla la apariencia visual de la aplicación.

| Estado | Descripción |
|---|---|
| `themeColor` | Color primario del tema (`'buke'`) |
| `direction` | Dirección del texto (`'ltr'` o `'rtl'`) |
| `mode` | Modo claro/oscuro (`'light'` / `'dark'`) |
| `primaryColorLevel` | Nivel de intensidad del color (500) |
| `panelExpand` | Si el panel de configuración está expandido |
| `navMode` | Modo de navegación (`'light'`, `'dark'`, `'themed'`, `'transparent'`) |
| `layout.type` | Tipo de layout (`'modern'`) |
| `layout.sideNavCollapse` | Si la barra lateral está colapsada |

**Acciones:** `setDirection`, `setMode`, `setLayout`, `setSideNavCollapse`, `setNavMode`, `setPanelExpand`, `setThemeColor`, `setThemeColorLevel`.

**Uso típico:** El componente `<Theme>` lee `state.theme.mode` para aplicar la clase CSS `dark` al `<html>`. Los botones de cambiar tema hacen `dispatch(setMode('dark'))`.

**NO se persiste** — el modo se determina al cargar la página según `prefers-color-scheme` o localStorage manual.

---

### 5b. `locale`

**Archivo:** `src/store/locale/localeSlice.js`

**Propósito:** Maneja el idioma de la interfaz.

| Estado | Descripción |
|---|---|
| `currentLang` | Código del idioma actual (`'es'` por defecto) |

**Acciones:** `setLang`.

**Uso típico:** Un selector de idioma hace `dispatch(setLang('en'))` y los componentes de texto se traducen según este valor.

**Sí se persiste** — para que al recargar la página el idioma se mantenga.

---

### 5c. `base / common`

**Archivo:** `src/store/base/commonSlice.js`

**Propósito:** Almacena metadatos de la ruta actual para la interfaz (títulos, breadcrumbs, opciones).

| Estado | Descripción |
|---|---|
| `current_general_key` | Clave general de la ruta |
| `current_route_key` | Identificador de la ruta actual |
| `current_route_index` | Índice de ruta (para navegación) |
| `current_route_sub_index` | Subíndice de ruta |
| `current_route_title` | Título de la página actual |
| `current_route_subtitle` | Subtítulo de la página |
| `current_route_info` | Información contextual de la ruta |
| `current_route_options` | Opciones de la ruta actual |
| `current_route_sub_options` | Sub-opciones de la ruta |

**Acciones:** `setCurrentRouteTitle`, `setCurrentRouteSubtitle`, `setCurrentRouteInfo`, `setCurrentRouteOptions`, etc.

**Uso típico:** Cuando se navega a una página, se hace `dispatch(setCurrentRouteTitle('Tareas'))` y el header de la app muestra ese título automáticamente.

**NO se persiste** — los metadatos se redefinen en cada navegación.

---

### 5d. `auth / session`

**Archivo:** `src/store/auth/sessionSlice.js`

**Propósito:** Maneja el estado de la sesión del usuario autenticado.

| Estado | Descripción |
|---|---|
| `token` | Token Bearer de Passport |
| `signedIn` | Booleano que indica si hay sesión activa |
| `verificationOn` | Si el usuario está en proceso de verificación 2FA |
| `tk` | Token temporal de verificación |

**Acciones:**

| Acción | Efecto |
|---|---|
| `onSignInSuccess` | Marca `signedIn=true`, guarda el token |
| `onSignOutSuccess` | Limpia todo (`signedIn=false`, token vacío) |
| `setToken` | Actualiza el token manualmente |
| `setVerificationOn` | Activa/desactiva el estado de verificación |
| `setTk` | Guarda el token temporal |

**Uso típico:**

- Al hacer login exitoso: `dispatch(onSignInSuccess(token))`
- Al cerrar sesión: `dispatch(onSignOutSuccess())`
- El `BaseService` de axios lee el token de Redux para añadirlo al header `Authorization: Bearer {token}`

**Sí se persiste** — el token debe mantenerse al recargar.

---

### 5e. `auth / user`

**Archivo:** `src/store/auth/userSlice.js`

**Propósito:** Datos básicos del usuario logueado.

| Estado | Descripción |
|---|---|
| `id` | ID del usuario |
| `name` | Nombre |
| `lastname` | Apellido |
| `username` | Nombre de usuario |
| `email` | Correo electrónico |
| `status` | Estado del usuario |
| `authority` | Array de roles (ej: `['admin', 'coordinador']`) |
| `permissions` | Permisos específicos |

**Acciones:**

| Acción | Efecto |
|---|---|
| `setUser` | Reemplaza todo el estado de usuario con `action.payload` |
| (string) `'auth/user/userLoggedOut'` | Resetea al estado inicial |

**Uso típico:**

```js
const user = useSelector((state) => state.auth.user)
const isAdmin = user.authority.some((r) => ['super-admin', 'admin'].includes(r))
```

**Sí se persiste.**

---

### 5f. `auth / employee`

**Archivo:** `src/store/auth/employeeSlice.js`

**Propósito:** Datos laborales del empleado (extiende la info del usuario).

| Estado | Descripción |
|---|---|
| `id`, `name`, `lastname`, `email` | Datos básicos |
| `email_personal`, `phone`, `phone_personal` | Contacto |
| `birthday` | Fecha de nacimiento |
| `marking_required` | Si requiere marcaje |
| `status`, `active` | Estado laboral |
| `user_id` | ID del usuario asociado |
| `adm_gender_id`, `adm_marital_status_id`, `adm_address_id` | Datos de RRHH |
| `photo` | Foto del empleado |

**Uso típico:** Se llena al iniciar sesión con los datos del empleado desde el backend. Se usa en perfiles y ajustes.

**Sí se persiste.**

---

### 5g. `auth / functionalPosition`

**Archivo:** `src/store/auth/functionalPositionSlice.js`

**Propósito:** Puesto funcional / cargo del usuario.

| Estado | Descripción |
|---|---|
| `id`, `name`, `abbreviation` | ID y nombre del cargo |
| `description` | Descripción del puesto |
| `amount_required`, `salary_min`, `salary_max` | Datos salariales |
| `boss`, `boss_hierarchy` | Jefe inmediato y jerarquía |
| `original` | Cargo original |
| `user_required` | Si requiere usuario |
| `active` | Si está activo |
| `adm_organizational_unit_id` | Unidad organizativa asociada |
| `adm_functional_position_id` | ID del puesto funcional |

**Uso típico:** Se usa en módulos de RRHH y organigramas.

**Sí se persiste.**

---

### 5h. `auth / organizationalUnit`

**Archivo:** `src/store/auth/organizationalUnitSlice.js`

**Propósito:** Unidad organizativa/departamento del usuario.

| Estado | Descripción |
|---|---|
| `id` | ID de la unidad |
| `nombre` | Nombre del departamento |
| `abreviatura` | Abreviatura |
| `habilitado` | Si está habilitada |

**Uso típico:** Se usa para filtrar por departamento, mostrar el área del usuario, etc.

**Sí se persiste.**

---

### 5i. `auth / notifications`

**Archivo:** `src/store/auth/notificationsSlice.js`

**Propósito:** Lista de notificaciones del usuario.

| Estado | Descripción |
|---|---|
| `notifications` | Array de objetos de notificación |

**Acciones:**

| Acción | Efecto |
|---|---|
| `setNotifications` | Reemplaza toda la lista con `action.payload` |

**Uso típico:** Se llena desde el backend al cargar la app. El dropdown de notificaciones lee de aquí.

**Sí se persiste** — aunque las notificaciones suelen refrescarse al iniciar.

---

## 6. Cómo se provee el Store a la App

En `src/App.js`:

```jsx
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store'

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Theme>
                        <Layout />
                    </Theme>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    )
}
```

**Cadena de providers (de afuera hacia adentro):**

1. `LocalizationProvider` — Adaptador de fechas (Dayjs)
2. **`Provider`** — Provee el store de Redux a toda la app
3. **`PersistGate`** — Espera a que el estado persistido se restaure antes de renderizar
4. `BrowserRouter` — Router de React
5. `Theme` — Lee el slice `theme` para aplicar modo claro/oscuro
6. `Layout` — Componente principal de layout

---

## 7. Cómo se usa Redux en los componentes

### Leer estado — `useSelector`

```jsx
import { useSelector } from 'react-redux'

const Comp = () => {
    const mode = useSelector((state) => state.theme.mode)
    const token = useSelector((state) => state.auth.session.token)
    const user = useSelector((state) => state.auth.user)
    const isAdmin = user.authority.some((r) => ['super-admin', 'admin'].includes(r))
    // ...
}
```

### Modificar estado — `useDispatch`

```jsx
import { useDispatch } from 'react-redux'
import { setMode } from 'store/theme/themeSlice'
import { setUser } from 'store/auth/userSlice'

const Comp = () => {
    const dispatch = useDispatch()

    const toggleDarkMode = () => {
        dispatch(setMode('dark'))
    }

    const login = (userData) => {
        dispatch(setUser(userData))
    }
}
```

### En servicios (axios interceptor)

El token se lee de Redux para adjuntarlo automáticamente en cada petición:

```js
// BaseService.js — simplificado
import store from 'store'

api.interceptors.request.use((config) => {
    const token = store.getState().auth.session.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
```

---

## 8. Regla clave del proyecto

> **Redux solo guarda: auth, theme, locale y metadatos de ruta.**
> Los datos de negocio (tareas, subtareas, archivos, usuarios, estados, modales, formularios) viven en `useState` local de cada componente.

**¿Por qué?**
- Los datos de negocio cambian constantemente y son específicos de cada vista.
- Si se guardaran en Redux, habría que sincronizarlos constantemente con el backend, lo que añade complejidad innecesaria.
- El state local es más simple: se carga al montar el componente y se descarta al desmontarlo.

**Excepciones:**
- El token de sesión y datos del usuario se persisten en Redux porque deben sobrevivir al refresh.
- El tema y el idioma se persisten para mantener la preferencia del usuario.
- Los metadatos de ruta se guardan para que el header y los breadcrumbs funcionen.

---

## Resumen visual

```
localStorage (persist)
  ├── auth.session { token, signedIn }
  ├── auth.user { id, name, authority }
  ├── auth.employee { ... }
  ├── auth.functionalPosition { ... }
  ├── auth.organizationalUnit { ... }
  ├── auth.notifications { ... }
  └── locale { currentLang: 'es' }

Redux Store
  ├── theme (no persist) → colores, modo, layout
  ├── locale (persist)   → idioma
  ├── base.common        → título de ruta, breadcrumbs
  └── auth (persist)     → sesión, usuario, empleado, etc.

Componentes
  ├── useState           → tareas, subtareas, archivos,
  │                        modales, formularios
  └── Redux (useSelector) → token, roles, tema, idioma
```
