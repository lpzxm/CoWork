# React Doctor: state y effects

Fecha base: 2026-05-22  
Ultima consolidacion: 2026-05-28

## Contexto

Se ejecuto React Doctor para reducir issues de state/effects sin romper autenticacion ni rutas protegidas.

Restriccion central mantenida:

- no alterar el contrato funcional de login/2FA mas alla de fixes puntuales de estabilidad

## Trabajo realizado (resumen consolidado)

### Fase 1: auth y formularios criticos

- `src/views/auth/SignIn/VerifyForm.jsx`
  - se elimino logica de expiracion basada en efecto derivado
  - se movio la accion al origen del evento (timer/carga)
  - guardas contra ejecuciones duplicadas
- `src/views/auth/ForgotPassword/ForgotPasswordForm.js`
  - se movio componente interno fuera del render
  - se corrigieron `key` en listas
- hooks de soporte:
  - `src/utils/hooks/useTimeOutMessage.js`
  - `src/utils/hooks/useDebounce.js`
  - cleanup/deps estabilizados

### Fase 2: UI compartida y accesibilidad

- fixes de keys y exportes en varios componentes
- soporte reduced-motion (parcial) en CSS y componentes con motion
- conversion de elementos clickeables a superficies accesibles por teclado
- reduccion de state derivado en:
  - `Pagination`
  - `Pagers`
  - `Switcher`

### Fase 3: lotes state/effects por familias

- `Tooltip`, `MenuCollapse`, `Radio`, `VerticalMenuContent`
- familia `DatePicker` / `TimeInput`
- `Upload`, `Checkbox`, tablas custom
- `Input`, `Avatar`, `Drawer`, `StickyFooter`, `Notification`

### Fase 4: regression real de login 2FA

Se detecto rafaga de requests repetidos a:

- `/api/auth/send-two-factor-expires-at`

Causa:

- funcion de `useAuth` inestable entre renders + efecto dependiente

Fix:

- `src/utils/hooks/useAuth.js`
  - funciones envueltas en `useCallback` (incluye `getTwoFactorExpiresAt`)

### Fase 5: cierre y limpieza de compilacion

- se corrigieron warnings/errores residuales en hooks, slices y modulos de auth/mock
- se reparo import roto de mock auth
- se ajustaron warnings de React Router legacy (`activeClassName`) en menu

## Resultado registrado en ese contexto

- score React Doctor reportado: `92 / 100`
- issues restantes: `13 issues across 10/393 files`
- `eslint` limpio en el cierre reportado
- `build` de produccion compilando

## Pendientes principales dejados en contexto original

- `package.json`: `require-reduced-motion`
- `ThemeSwitcher`: `server-dedup-props`
- `custom/DataTable.jsx`: `server-dedup-props`
- `TimeInput`: `no-derived-state`, `no-event-handler`
- `Notification`: `no-derived-state`
- `useTimeout`: `no-pass-data-to-parent`
- `useRootClose`: APIs deprecated (`findDOMNode`)
- `DataTablePaginated.jsx`: `no-giant-component`
- `StackedSideNav/index.js`: `no-cascading-set-state`
- `StickyFooter.js`: `no-initialize-state`

## Nota para siguientes agentes

- tratar pendientes por lotes pequenos
- validar siempre despues de cada lote:
  - `npx react-doctor@latest --verbose --diff`
  - `npx eslint src --max-warnings=0`
  - `npm run build`
- evitar mezclar fixes masivos de UI compartida con cambios de auth en un mismo lote
