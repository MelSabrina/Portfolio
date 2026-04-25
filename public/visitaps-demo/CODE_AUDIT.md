# CODE_AUDIT.md — VisitAPS

Auditoría completa del codebase. Generado el 2026-03-22.

---

## 1. Hardcodeos de diseño

- **Archivo**: pantallas/visitaps-actualizar-zona.html | **Línea**: ~183 | **Severidad**: Media
  - **Problema**: Color hardcodeado `#9A958F` para hover de botón (variante de gray-btn `#8A8580`)
  - **Fix**: Crear variable `--gray-btn-hover` o derivar con `opacity`

- **Archivo**: pantallas/visitaps-actualizar-zona.html | **Línea**: ~374-378 | **Severidad**: Media
  - **Problema**: Colores `#1B2A4A` (navy) y `#C9A84C` (gold) hardcodeados en setAttribute para pie chart SVG
  - **Fix**: Usar `getComputedStyle(document.documentElement).getPropertyValue('--navy')` para leer tokens

- **Archivo**: pantallas/visitaps-actualizar-zona.html | **Línea**: ~386 | **Severidad**: Baja
  - **Problema**: Color `#EDEAE4` (cream) hardcodeado en stroke de línea SVG
  - **Fix**: Leer `--cream` via `getComputedStyle()`

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~169-170 | **Severidad**: Media
  - **Problema**: Colores hardcodeados para badges: `#2a9490`, `#a07a1a`, `rgba(80,183,178,0.15)`, `rgba(201,168,76,0.15)`
  - **Fix**: Crear variables `--badge-supervisor-text`, `--badge-admin-text`, etc. en `:root`

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~320 | **Severidad**: Media
  - **Problema**: Color `#F6EDE0` hardcodeado para background de bottom sheet
  - **Fix**: Crear variable `--bs-bg`

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~395 | **Severidad**: Baja
  - **Problema**: Color hover `#ccc9c2` hardcodeado para botón cancelar
  - **Fix**: Derivar con `opacity` o crear variable

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~209, 454, 518 | **Severidad**: Media
  - **Problema**: Uso de `#fff` en lugar de variable de texto claro sobre fondo navy/steel
  - **Fix**: Crear `--text-light` o usar crema claro `#F0EDE8`

- **Archivo**: pantallas/visitaps-crear-usuario.html | **Línea**: ~185-186 | **Severidad**: Media
  - **Problema**: Badges con colores hardcodeados `#2a9490`, `#a07a1a`, rgba values (duplicado de administracion)
  - **Fix**: Usar variables CSS definidas en `:root`

- **Archivo**: pantallas/visitaps-editar-usuario.html | **Línea**: ~147 | **Severidad**: Baja
  - **Problema**: Color `#fff` en background de elemento
  - **Fix**: Reemplazar con `var(--cream)`

- **Archivo**: pantallas/visitaps-editar-usuario.html | **Línea**: ~163-164 | **Severidad**: Media
  - **Problema**: Badges con hardcodes `#2a9490`, `#a07a1a`, rgba colors (mismo patrón duplicado)
  - **Fix**: Usar variables CSS

- **Archivo**: pantallas/visitaps-menu.html | **Línea**: ~72, 76 | **Severidad**: Media
  - **Problema**: Bordes hardcodeados `border: 1px solid #6B84A3` (steel-light)
  - **Fix**: Reemplazar con `var(--steel-light)`

- **Archivo**: pantallas/visitaps-menu-admin.html | **Línea**: ~81, 85 | **Severidad**: Media
  - **Problema**: Bordes hardcodeados `#50b7b2` (teal), `#D9BC72` (gold-light)
  - **Fix**: Reemplazar con `var(--teal)` y `var(--gold-light)`

- **Archivo**: pantallas/visitaps-reportes.html | **Línea**: ~278 | **Severidad**: Baja
  - **Problema**: Color hover `#3fa8a3` hardcodeado para botón export
  - **Fix**: Crear `--btn-export-hover` derivada de `--teal`

- **Archivo**: pantallas/visitaps-terminos.html | **Línea**: ~146, 150, 157 | **Severidad**: Media
  - **Problema**: Botones con colores hardcodeados `#8A8580`, `#9A958F`, `#6B84A3`
  - **Fix**: Usar `var(--gray-btn)`, derivada hover, `var(--steel)`

**Total categoría 1: 14 ítems** (0 Alta, 10 Media, 4 Baja)

---

## 2. Stubs y TODOs sin marcar

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~1014 | **Severidad**: Alta
  - **Problema**: Comentario `// TODO: reemplazar MOCK_ZONAS con query a tabla zonas`. Usa arreglo mockup estático
  - **Fix**: Conectar `renderTablaZonas()` con query real a tabla zonas en Supabase

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~1022-1028 | **Severidad**: Alta
  - **Problema**: `window.renderTablaZonas()` renderiza desde `MOCK_ZONAS` hardcodeado, no desde base de datos
  - **Fix**: Modificar para recibir datos de Supabase y renderizar tabla dinámica

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~1136 | **Severidad**: Alta
  - **Problema**: `// TODO: conectar con DELETE a Supabase` — botón Eliminar en zonas no elimina realmente
  - **Fix**: Implementar eliminación real en Supabase

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~1156 | **Severidad**: Alta
  - **Problema**: `// TODO: conectar con UPDATE a Supabase` — `guardarZona()` no guarda cambios en DB
  - **Fix**: Implementar UPDATE real en Supabase

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~1172 | **Severidad**: Alta
  - **Problema**: `// TODO: conectar con INSERT a Supabase` — `crearZona()` no inserta en DB
  - **Fix**: Implementar INSERT real en Supabase

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~1307 | **Severidad**: Alta
  - **Problema**: `// TODO: conectar con UPDATE a Supabase` — `guardarEstablecimiento()` no persiste
  - **Fix**: Implementar UPDATE real

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~1319 | **Severidad**: Alta
  - **Problema**: `// TODO: conectar con DELETE a Supabase` — `eliminarEstablecimiento()` no elimina
  - **Fix**: Implementar DELETE real

- **Archivo**: pantallas/visitaps-reportes.html | **Línea**: ~653 | **Severidad**: Baja
  - **Problema**: `console.log('[renderFiltros] nivel:', nivel)` — debug leftover
  - **Fix**: Remover línea de console.log

- **Archivo**: js/data-service.js | **Línea**: ~275-278 | **Severidad**: Media
  - **Problema**: `updateAgentePassword()` devuelve error intencional — requiere `service_role` key, pendiente backend
  - **Fix**: Implementar con service_role key o documentar explícitamente como no soportado

**Total categoría 2: 9 ítems** (7 Alta, 1 Media, 1 Baja)

---

## 3. Código duplicado

- **Archivo(s)**: pantallas/visitaps-actualizar-zona.html | **Líneas**: ~188-212 | **Severidad**: Media
  - **Problema**: Reglas CSS `.version-footer` y `.version` definidas dos veces idénticas, solo difiere `animation` en primera definición
  - **Fix**: Eliminar la segunda definición duplicada (líneas ~202-212)

- **Archivo(s)**: js/router.js | **Líneas**: ~1411-1504 | **Severidad**: Alta
  - **Problema**: `showDetallePopup()` y `showLogoutPopup()` comparten estructura casi idéntica: overlay cssText, card padding/background, botones con estilos inline idénticos
  - **Fix**: Crear función auxiliar `createPopupOverlay(config)` que acepte title, message, buttons array

- **Archivo(s)**: js/router.js (~231-271) y pantallas/visitaps-actualizar-zona.html (~333-389) | **Líneas**: ~231, ~333 | **Severidad**: Alta
  - **Problema**: Lógica de pie chart rendering duplicada: `renderPieChart()` en router.js y `window.renderChart()` en zona.html. Ambas calculan ocupado/disponible, renderizan SVG y actualizan porcentajes
  - **Fix**: Extraer a función reutilizable única; zona.html llama esa función

- **Archivo(s)**: js/router.js | **Líneas**: ~1429-1437, ~1471-1479, ~1543-1551 | **Severidad**: Media
  - **Problema**: Tres funciones popup (`showDetallePopup`, `showLogoutPopup`, `showChangePasswordPopup`) duplican cssText exacto de botones con mínimas variaciones de color
  - **Fix**: Definir constantes de estilo o helper que genere cssText para botones

- **Archivo(s)**: pantallas/*.html (13 archivos) | **Líneas**: variadas | **Severidad**: Media
  - **Problema**: Clases `.top-bar`, `.top-nav`, `.btn-atras`, `.nav-icon` duplicadas en ~13 archivos HTML con estilos idénticos
  - **Fix**: Mover estilos invariantes a `shell-styles` en index.html

- **Archivo(s)**: pantallas/*.html (11+ archivos) | **Líneas**: variadas | **Severidad**: Baja
  - **Problema**: Clases `.ornament`, `.ornament-line`, `.ornament-diamond` redefinidas en 11+ pantallas con CSS exactamente igual
  - **Fix**: Mover a shell-styles

**Total categoría 3: 6 ítems** (2 Alta, 3 Media, 1 Baja)

---

## 4. Inconsistencias de patrón

- **Archivo**: pantallas/visitaps-rondas.html | **Línea**: ~1 (toda la página) | **Severidad**: Alta
  - **Problema**: Rondas no tiene `<script>` propio pero depende de elementos SVG/chart. Rendering acoplado a router.js `renderPieChart()` sin consistencia con zona.html que SÍ tiene su propio `<script>`
  - **Fix**: Mover chart rendering de router.js a rondas.html `<script>`, o documentar claramente la dependencia

- **Archivo**: pantallas/visitaps-actualizar-zona.html | **Línea**: ~202-226 | **Severidad**: Baja
  - **Problema**: `@keyframes fadeDown, fadeUp, fadeIn` definidos en zona.html y también en los otros 12 screens idénticamente
  - **Fix**: Mover @keyframes comunes a shell-styles en index.html

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~302-327 | **Severidad**: Media
  - **Problema**: Bottom sheet CSS local duplica reglas de `.bs-sheet` del shell. Conflicto de z-index: 200 vs 201 local vs 10 en shell
  - **Fix**: Alinear z-index y usar clases del shell; evitar redefinir position/transform

- **Archivo**: pantallas/*.html (varios) | **Línea**: variadas | **Severidad**: Media
  - **Problema**: `.scroll-body` padding-bottom inconsistente entre pantallas: 32px (reportes, admin), 40px (crear-usuario), 70px (editar-usuario)
  - **Fix**: Estandarizar padding-bottom o usar CSS variable si necesita variar por pantalla

- **Archivo**: js/form-sync.js | **Línea**: ~118-124, ~163-170 | **Severidad**: Media
  - **Problema**: Conversión fecha dd/mm/yyyy ↔ yyyy-mm-dd duplicada en `readField()` y `writeField()` — si el formato cambia, hay que actualizar en dos lugares
  - **Fix**: Extraer a funciones `formatDateToDB()` y `formatDateFromDB()`

- **Archivo**: pantallas/visitaps-menu.html | **Línea**: ~19 | **Severidad**: Baja
  - **Problema**: `.top-nav` usa `padding:12px 22px 0` pero otros screens usan `14px 22px 0`. Diferencia de 2px sin razón aparente
  - **Fix**: Estandarizar a 14px o documentar por qué menu necesita 12px

- **Archivo**: pantallas/visitaps-detalle-relevamiento.html | **Línea**: ~164 | **Severidad**: Baja
  - **Problema**: `.accordions` definido dos veces con reglas parcialmente duplicadas (width, margin-top en ambas; ::after solo en la segunda)
  - **Fix**: Combinar ambas reglas en una sola definición

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~466-522 | **Severidad**: Media
  - **Problema**: Popup CSS local (`.popup-overlay.active`, `.popup-card`) duplica estructura de `.bs-backdrop/.bs-sheet`. Dos patrones de overlay distintos sin criterio claro
  - **Fix**: Unificar a un solo patrón de overlay o documentar cuándo usar cada uno

- **Archivo**: js/router.js | **Línea**: ~1412-1413, ~1459, ~1509 | **Severidad**: Media
  - **Problema**: CSS inline para overlay en tres funciones popup con variaciones inconsistentes: `border-radius:12px` vs `16px`, `width:300px` vs `280px`
  - **Fix**: Estandarizar a un único tamaño/radio o usar clases CSS

**Total categoría 4: 9 ítems** (1 Alta, 5 Media, 3 Baja)

---

## 5. Legacy y orphan code

- **Archivo**: pantallas/visitaps-rondas.html | **Línea**: ~229 | **Severidad**: Alta
  - **Problema**: Inline `onclick="actualizarRondas()"` referencia función que no existe en ningún archivo del proyecto
  - **Fix**: Eliminar el onclick handler o implementar `actualizarRondas()`

- **Archivo**: pantallas/visitaps-rondas.html | **Línea**: ~202, 208, 229 | **Severidad**: Media
  - **Problema**: Inline `onmouseover=` y `onmouseout=` mezclados con pattern de addEventListener del router
  - **Fix**: Convertir a CSS `:hover { opacity: 1 }` o mover a listeners

- **Archivo**: pantallas/visitaps-terminos.html | **Línea**: ~276-277, 285, 288 | **Severidad**: Media
  - **Problema**: Inline onclick handlers (`handleCancelar()`, `handleConfirmar()`, `handleOverlayClick()`, `closePopup()`) mezclados con funciones registradas en window por router
  - **Fix**: Mover a addEventListener en el script de la página

- **Archivo**: js/router.js | **Línea**: ~273-722 | **Severidad**: Alta
  - **Problema**: `postMount()` tiene 449 líneas con lógica deeply-nested para 13+ screens. Monolito que contiene lógica de negocio por pantalla
  - **Fix**: Extraer a módulos por pantalla (postMountRondas, postMountRelevamientos, etc.) y llamar desde dispatcher

- **Archivo**: js/router.js | **Línea**: ~725-1009 | **Severidad**: Media
  - **Problema**: `initReportes()` tiene 284 líneas con field mappings, cube flattening y rendering embebidos en router. Candidata a extracción (ya mencionado en CLAUDE.md)
  - **Fix**: Crear `js/reportes.js` con initReportes(), buildStatRows() y reporteData

**Total categoría 5: 5 ítems** (2 Alta, 3 Media, 0 Baja)

---

## 6. Problemas de migración Angular/Ionic

- **Archivo**: js/router.js | **Línea**: ~220, 338, 348, 404, 469, 663-667, 698, 727-728 | **Severidad**: Alta
  - **Problema**: Estado global mutable en window: `cachedAgente`, `window.__currentRondaId`, `window.__currentAgenteId`, `window.__routeParams`, `window._adminUsuarios`, `window._zonasList`, `window.__editUsuario`, `window._reporteAgente`, `window._reporteOpciones`
  - **Fix**: Migrar a injectable StateService/AuthService con DI en lugar de globals en window

- **Archivo**: js/router.js | **Línea**: ~379-380 | **Severidad**: Alta (XSS)
  - **Problema**: Datos de Supabase interpolados directamente en innerHTML sin escapar: `r.identi`, `r.estado` concatenados en HTML strings. Si contienen HTML/JS, se ejecutan
  - **Fix**: Usar `textContent` o crear `escapeHtml()` utility antes de insertar

- **Archivo**: js/router.js | **Línea**: ~318, 380 | **Severidad**: Alta (XSS)
  - **Problema**: Campos de Supabase (`r.caps`, `r.descripcion`, `r.identi`, `r.estado`) concatenados en HTML strings sin sanitización
  - **Fix**: Usar DOM APIs (textContent, setAttribute) en lugar de string concatenation

- **Archivo**: js/router.js | **Línea**: ~544-587 | **Severidad**: Media
  - **Problema**: Business logic (handleCancelar, handleConfirmar, closePopup) registrada como `window.*` para onclick inline. En Angular serían métodos de componente/servicio
  - **Fix**: Mover a TyC service/controller dedicado

- **Archivo**: js/router.js | **Línea**: ~297 | **Severidad**: Media
  - **Problema**: Lógica de badge con HTML inline hardcodeado y class switching. En Angular sería pipe o componente
  - **Fix**: Extraer a `getNivelBadgeHTML()` utility o Angular pipe

- **Archivo**: js/form-sync.js | **Línea**: ~14-16 | **Severidad**: Media
  - **Problema**: Estado en closure (currentRelevamientoId, currentAgenteId, debounceTimers) persiste entre navegaciones. No testeable, no limpiable por lifecycle
  - **Fix**: Wrappear FormSync en clase/servicio con init/cleanup explícito

- **Archivo**: js/form-sync.js | **Línea**: ~264-316 | **Severidad**: Media
  - **Problema**: DOM event listeners directos (input, MutationObserver). En Angular serían (input) binding + Reactive Forms
  - **Fix**: Migrar a Angular Reactive Forms con FormGroup/FormControl

- **Archivo**: js/router.js | **Línea**: ~273-722 | **Severidad**: Media
  - **Problema**: Código de inicialización por página (wireRondaItems, wireRelevamientoItems, etc.) hardcodeado en postMount. Cada página debería ser componente con OnInit
  - **Fix**: Convertir cada screen a Angular component con lifecycle propio

- **Archivo**: js/router.js | **Línea**: ~1411-1455, 1457-1499 | **Severidad**: Media
  - **Problema**: Popups/modales generados con createElement y inline styles. En Angular/Ionic serían mat-dialog o ion-modal
  - **Fix**: Crear Angular service con Dialog/Modal; eliminar creación manual de overlay

- **Archivo**: js/data-service.js | **Línea**: ~15, 28-32, 41-43 | **Severidad**: Media
  - **Problema**: Data access layer expone queries Supabase directamente sin error handling estandarizado ni typed models
  - **Fix**: Wrappear en try-catch; retornar DTOs tipados; agregar HTTP interceptor para auth token

**Total categoría 6: 10 ítems** (3 Alta, 7 Media, 0 Baja)

---

## 7. Dead code

- **Archivo**: js/router.js | **Línea**: ~1374 | **Severidad**: Media
  - **Problema**: `wireAdminButtons()` definida como función vacía `function wireAdminButtons() {}` — nunca ejecuta lógica
  - **Fix**: Eliminar definición y llamada (~1247)

- **Archivo**: js/router.js | **Línea**: ~348 | **Severidad**: Baja
  - **Problema**: `window.__currentAgenteId` es asignada pero nunca leída en ningún archivo
  - **Fix**: Eliminar la línea `window.__currentAgenteId = agente.id;`

- **Archivo**: js/form-sync.js | **Línea**: ~445 | **Severidad**: Baja
  - **Problema**: `getRelevamientoId()` método público expuesto en `window.FormSync` pero nunca llamado
  - **Fix**: Eliminar el método de la API pública

- **Archivo**: js/data-service.js | **Línea**: ~275 | **Severidad**: Media
  - **Problema**: `updateAgentePassword()` siempre devuelve error — función stub sin implementación real
  - **Fix**: Implementar con service_role key o eliminar

- **Archivo**: pantallas/visitaps-administracion.html | **Línea**: ~1015-1018 | **Severidad**: Baja
  - **Problema**: `MOCK_ZONAS` array hardcodeado usado como datos de prueba que quedó sin reemplazar
  - **Fix**: Reemplazar con query real a tabla `zonas` de Supabase

**Total categoría 7: 5 ítems** (0 Alta, 2 Media, 3 Baja)

---

## Resumen

### Conteo por categoría

| Categoría | Alta | Media | Baja | Total |
|---|---|---|---|---|
| 1. Hardcodeos de diseño | 0 | 10 | 4 | 14 |
| 2. Stubs y TODOs | 7 | 1 | 1 | 9 |
| 3. Código duplicado | 2 | 3 | 1 | 6 |
| 4. Inconsistencias de patrón | 1 | 5 | 3 | 9 |
| 5. Legacy y orphan code | 2 | 3 | 0 | 5 |
| 6. Migración Angular/Ionic | 3 | 7 | 0 | 10 |
| 7. Dead code | 0 | 2 | 3 | 5 |
| **TOTAL** | **15** | **31** | **12** | **58** |

### Top 5 ítems de mayor impacto para atacar primero

1. **XSS en router.js (~379-380)** — Severidad Alta. Datos de usuario de Supabase interpolados directamente en `innerHTML` sin sanitizar. Riesgo de seguridad real. Fix: crear `escapeHtml()` y aplicar a toda concatenación de datos de usuario en HTML.

2. **7 TODOs sin backend en administracion.html (zonas + establecimientos)** — Severidad Alta. Todo el módulo de administración de zonas y establecimientos opera sobre datos mock o stubs vacíos. No persiste nada en Supabase. Fix: implementar queries CRUD en data-service.js y conectar.

3. **postMount() monolito de 449 líneas en router.js (~273-722)** — Severidad Alta. Toda la lógica de inicialización de cada pantalla en una sola función. Bloquea migración a Angular y dificulta mantenimiento. Fix: extraer a módulos por pantalla.

4. **Pie chart duplicado entre router.js y zona.html** — Severidad Alta. Lógica idéntica en dos lugares que puede divergir. Fix: unificar en una sola función reutilizable.

5. **Estado global mutable en window (9+ variables)** — Severidad Alta. `cachedAgente`, `__currentRondaId`, `_adminUsuarios`, `__editUsuario`, etc. dificultan razonamiento, testing y migración. Fix: centralizar en un único objeto de estado o servicio.
