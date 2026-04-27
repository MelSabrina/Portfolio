# SaludENT — Horizontal Scroll en tablas (known issues)

Documento de referencia para Claude. Leer antes de tocar el scroll horizontal en las páginas de guías de SaludENT.

---

## Arquitectura de tres frames

```
Portfolio canvas (React)
  └── ProjectAppNode  ←  SaludENT iframe (Ionic/Angular)
        └── VisorHtmlPage  ←  inner guide iframe (Hiper*.html)
```

**VisorHtmlPage** (`chunk-OU34WFI4.js`): componente Angular que renderiza guías HTML en un inner iframe. Al cargar cada guía, inyecta sus propios handlers de mouse **en el documento del inner iframe** vía el evento `load` del iframe, en **capture mode**.

Lo que inyecta VisorHtmlPage:
- Cursor relay: mousemove → postMessage al padre
- Drag-to-scroll vertical: drag sobre la página scrollea `document.documentElement.scrollTop`
- Reset de `moved = false` en mousedown

---

## Páginas con tablas horizontales

Tres páginas tienen tablas que no entran en el ancho del viewport y necesitan scroll horizontal:

| Archivo | Tabla | Estructura |
|---|---|---|
| `HiperEvalCuadros.html` | `.diagnostic-table` | `.table-wrapper` directo en `.main-container` |
| `HiperSegCuadros.html` | `.follow-table` | `.table-wrapper` directo en `.main-container` |
| `HiperEvalRecom.html` | `.diagnostic-table` | `.table-wrapper` dentro de `.sub-accordion-inner` |

---

## Problema central

VisorHtmlPage captura los eventos de mouse en el inner iframe y los interpreta como drag-to-scroll vertical. El usuario intenta arrastrar horizontalmente la tabla, pero VisorHtmlPage se roba el evento y scrollea la página.

La solución depende del orden de registro de event listeners en capture phase sobre `document`. Nuestro IIFE se registra **inline** (durante el parsing del HTML), antes de que VisorHtmlPage inyecte sus handlers vía `load`. Si llegamos primero, podemos llamar `stopImmediatePropagation()` en mousemove para bloquearlo.

---

## Fixes aplicados

### CSS
- **Eliminar `scroll-behavior: smooth` de `.table-wrapper`**: causaba lag porque VisorHtmlPage escribe `scrollLeft` directamente y el browser animaba cada write.
- **HiperEvalCuadros**: eliminar propiedades extra del `.table-wrapper` que no tienen las otras páginas: `overflow-y: visible`, `position: relative`, `display: block`, `max-width: 100%`. Una de ellas (probablemente el `overflow-y: visible` que el browser coerciona a `auto`) interfería con la detección del drag.

### JS — IIFE en cada página
Cada una de las tres páginas tiene un IIFE al final del `<body>` con esta lógica:

1. **Cursor relay primero**: registrado como primer listener de mousemove (capture) para que ningún `stopImmediatePropagation` posterior lo mate.
2. **Counter-scroll**: `window.addEventListener('scroll', ...)` — si VisorHtmlPage scrollea la página durante nuestro drag horizontal, lo deshacemos inmediatamente (reset de `scrollTop` al valor pre-drag). Funciona independientemente del orden de registro de listeners.
3. **mousedown**: detectar si el target está dentro de `.table-wrapper`. Guardar `startX`, `startScrollLeft`, `preDragScrollTop`.
4. **mousemove**: detección de dirección (ratio 2:1 — solo declinar si |dy| > |dx|×2). Una vez locked, `stopImmediatePropagation` + actualizar `scrollLeft`. Velocidad clampeada a `dt = Math.max(now - lastT, 16)` para evitar spikes.
5. **mouseup**: activar `scrollLockUntil = now + 300ms` para contrarrestar el momentum vertical post-release de VisorHtmlPage. Arrancar momentum horizontal (decay 0.92 por frame).

---

## Known issues (no resueltos)

### 1. Inconsistencia en primera carga
**Síntoma**: después de Ctrl+Shift+R o fresh load, HiperEvalCuadros y HiperSegCuadros a veces no responden al drag horizontal. Navegar a HiperEvalRecom y volver suele resolverlo.

**Causa probable**: en la primera navegación del router Angular, VisorHtmlPage puede estar registrando sus handlers antes de que el inline script del inner iframe ejecute (race condition de inicialización del componente). Si VisorHtmlPage gana la carrera, `stopImmediatePropagation` no lo puede bloquear porque ya corrió primero.

El counter-scroll mitiga esto (deshace el scrollTop que VisorHtmlPage impone) pero no lo soluciona completamente si VisorHtmlPage también interfiere con el `scrollLeft` de la tabla.

**Estado**: investigado, mitigado, no resuelto. Workaround del usuario: abrir otra guía y volver.

### 2. Pequeño rebound al soltar mid-drag
**Síntoma**: al soltar el mouse mientras el drag está en movimiento, la tabla da un pequeño rebote vertical (retrocede unos píxeles).

**Causa**: VisorHtmlPage dispara momentum vertical en su mouseup handler (si acumuló suficiente `moved`). El scroll lock de 300ms no siempre lo cancela completamente antes de que se vea.

**Estado**: aceptable. No vale la pena seguir optimizando por ahora.

---

## ⛔ Cosas que NO hacer

### NO hacer `stopImmediatePropagation` en mouseup

```js
// ESTO ROMPE TODO — no reimplementar
document.addEventListener('mouseup', function(e) {
  if (locked) e.stopImmediatePropagation(); // ← NUNCA
  ...
}, true);
```

**Qué pasa**: VisorHtmlPage nunca recibe el mouseup. Su estado interno queda en "mouse presionado". Todos los movimientos de mouse posteriores (sin botón apretado) los interpreta como drag vertical. El cursor aparece con el ícono de "clickeado" y la página scrollea sola hasta el próximo mousedown. Es un bug grave y difícil de diagnosticar.
