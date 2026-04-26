# SaludENT Scroll Bug — Investigación

**Síntoma:** Al scrollear dentro de una página de guía clínica (ej. Urgencias de HTA → Manejo), el contenido de la página no scrollea — en cambio scrollea el frame exterior de SaludENT ("urgencias se mueve"). Los acordeones abiertos dentro de la página se quedan quietos.

**Estado al 2026-04-26:** Parcialmente investigado, fixes aplicados pero bug persiste.

---

## Arquitectura relevante

```
Portfolio canvas
  └── ProjectAppNode <iframe> (src: /saludent-demo/browser/)
        └── SaludENT Angular/Ionic app
              ├── IFRAME_INJECT (inyectado por ProjectAppNode.tsx al cargar)
              ├── ion-content
              │     └── .scroll-body  ← el scroll container "exterior" que se mueve
              └── VisorHtmlPage (cuando el usuario abre una guía)
                    └── iframe.visor-frame  ← el inner iframe de la guía
                          └── HiperManeRecom.html (u otra página HTML estática)
                                ├── body (scroll container del inner iframe)
                                └── .accordion-content (acordeones)
```

### VisorHtmlPage — CSS crítico
```css
/* Host del componente Angular */
[_nghost] { display: flex; flex-direction: column; height: 100%; overflow: hidden; }

/* El inner iframe */
.visor-frame { flex: 1; width: 100%; overflow: auto; border: none; }
```

El inner iframe tiene **altura fija** (flex:1 en contenedor con height:100%), NO crece con el contenido. Esto significa el `body` de la página HTML sí tiene overflow cuando hay acordeones abiertos.

**Importante:** VisorHtmlPage solo inyecta `.toolbar { display: none }` en el inner iframe. No tiene wheel listeners ni scroll handlers propios.

---

## Causa raíz identificada (dos partes)

### Causa A — `scrollIntoView` cross-frame (CONFIRMADA y RESUELTA)
En `HiperManeRecom.html`, `toggleAccordion()` llamaba:
```js
header.scrollIntoView({ behavior: 'smooth', block: 'start' });
```
El `scrollIntoView` nativo propaga a través de límites de iframe y scrollea todos los ancestors — incluyendo `.scroll-body` de SaludENT. Esto causaba que al abrir un acordeón, "urgencias" saltara.

**Fix aplicado:** Reemplazado por `window.scrollTo({ top: header.getBoundingClientRect().top + window.scrollY - 8, behavior: 'smooth' })` que se queda dentro del inner iframe.

**Solo HiperManeRecom.html tenía este problema** (verificado con grep en todos los htmls).

### Causa B — Wheel scroll chaining cross-frame (INVESTIGADA, FIX APLICADO, BUG PERSISTE)
Cuando el usuario scrollea con rueda dentro del inner iframe:
1. Evento `wheel` dispara en el documento del inner iframe
2. Si el body del inner iframe no está scrolleando (contenido cabe, o está en boundary), el browser encadena el scroll al frame padre
3. SaludENT's `.scroll-body` scrollea → "urgencias se mueve"

**Fixes aplicados:**

**Fix B1** — `html { overscroll-behavior: contain; }` en 8 páginas HTML internas:
```css
html { overscroll-behavior: contain; }
.accordion-content.active { overflow-y: auto; overscroll-behavior: contain; }
.sub-accordion-content.active { overflow-y: auto; overscroll-behavior: contain; }
```
Páginas: HiperManeRecom, HiperTablas, HiperSegRecom, HiperMetas, HiperEvalRecom, AlcoManeRecom, AlcoManeCuadros, PrevRastreo.

**Por qué no alcanza:** `overscroll-behavior: contain` solo actúa como firewall cuando el elemento ES un scroll container activo (tiene overflow real). Si el body no está scrolleando (contenido < alto del iframe), el `overscroll-behavior` no se activa y el scroll encadena igual.

**Fix B2** — `_visorLock` en IFRAME_INJECT (`ProjectAppNode.tsx`):
```js
function _visorLock(){
  var sb = document.querySelector('.scroll-body');
  if(!sb) return;
  sb.style.overflowY = document.querySelector('.visor-frame') ? 'hidden' : '';
}
_visorLock();
window.addEventListener('hashchange', function(){
  setTimeout(_visorLock, 80);
  setTimeout(_visorLock, 300);
});
```
Cuando el usuario navega a una VisorHtmlPage, pone `overflow-y: hidden` en `.scroll-body` — el container exterior no puede scrollear. Cuando sale, lo restaura.

**Por qué puede no funcionar:** Timing. Los `setTimeout(80ms)` y `setTimeout(300ms)` asumen que Angular renderizó el nuevo componente. Si Ionic tarda más, hay una ventana donde `.visor-frame` no existe aún y el lock no se activa.

---

## Hipótesis para sesión futura

### Hipótesis 1 (la más prometedora): MutationObserver en lugar de setTimeout
Reemplazar los timeouts con un MutationObserver que detecte cuándo `.visor-frame` aparece/desaparece del DOM:

```js
// En lugar de los setTimeout:
new MutationObserver(function() {
  var sb = document.querySelector('.scroll-body');
  if (!sb) return;
  sb.style.overflowY = document.querySelector('.visor-frame') ? 'hidden' : '';
}).observe(document.body, { childList: true, subtree: true });
```

Esto se dispara exactamente cuando Angular monta/desmonta el componente, sin timing frágil.

**Riesgo:** MutationObserver con `subtree: true` puede ser muy ruidoso (Angular re-renderiza frecuentemente). Solución: debounce de 50ms, o solo observar `childList` sin subtree en el router-outlet.

### Hipótesis 2: Identificar el router-outlet y observarlo directamente
El router-outlet de Ionic tiene un selector conocido (`ion-router-outlet`). Observar solo sus hijos directos:
```js
var outlet = document.querySelector('ion-router-outlet');
if (outlet) {
  new MutationObserver(_visorLock).observe(outlet, { childList: true });
}
```
Menos ruidoso que observar todo el body.

### Hipótesis 3: Forzar al inner iframe a ser siempre scroll container
En los inner HTML files, agregar:
```css
html, body { height: 100%; overflow-y: auto; overscroll-behavior: contain; }
```
Esto hace que body sea SIEMPRE un scroll container (aunque no tenga overflow real), lo que activa `overscroll-behavior: contain` incluso cuando el contenido es corto.

**Riesgo:** Puede romper el layout de las páginas (body con `height: 100%` puede colapsar elementos con `height: auto`). Necesita testing visual en cada página.

### Hipótesis 4 (nuclear): Wheel event capture en SaludENT outer frame
Agregar en IFRAME_INJECT un listener de wheel en capture mode que bloquee completamente el scroll de `.scroll-body` si el cursor está sobre `.visor-frame`:

```js
document.addEventListener('wheel', function(e) {
  var vf = document.querySelector('.visor-frame');
  if (!vf) return;
  // El cursor está sobre el iframe → bloquear scroll del outer frame
  e.preventDefault();
  e.stopPropagation();
}, { passive: false, capture: true });
```

**Problema conocido:** Los wheel events del inner iframe NO disparan en el documento padre (cross-frame). Este listener solo capturaría wheels sobre la UI de SaludENT fuera del inner iframe. No soluciona el chaining interno.

---

## Estado actual de todos los cambios aplicados

| Archivo | Cambio | Estado |
|---|---|---|
| `HiperManeRecom.html` | `scrollIntoView` → `window.scrollTo` | ✅ Funciona |
| `HiperManeRecom.html` + 7 páginas | `html { overscroll-behavior: contain }` | ⚠️ Parcial |
| `ProjectAppNode.tsx` IFRAME_INJECT | `.bs-sheet` skip en mousedown | ✅ Correcto (VisitAPS fix) |
| `ProjectAppNode.tsx` IFRAME_INJECT | `_visorLock` con setTimeout | ⚠️ Timing frágil |
| `visitaps-demo/index.html` | `user-select: none` en `.bs-sheet` | ✅ Correcto |
| `visitaps-administracion.html` | Mouse drag-to-close en sheets | ✅ Funciona |
| `visitaps-detalle-relevamiento.html` | Mouse drag-to-close en sheet | ✅ Funciona |

---

## Archivos clave para retomar

- `src/components/ProjectAppNode.tsx` — IFRAME_INJECT (líneas 12-95 aprox)
- `public/saludent-demo/browser/chunk-2VJQG4DT.js` — VisorHtmlPage compiled (leer, no editar)
- `public/saludent-demo/browser/assets/html/Hiper*.html` — inner pages con acordeones
- `public/saludent-demo/browser/assets/html/Alco*.html` — idem

## Próximos pasos sugeridos para la sesión

1. Probar **Hipótesis 1** (MutationObserver debounced) — reemplaza los `setTimeout` en `_visorLock`
2. Si no funciona, probar **Hipótesis 3** (body siempre scroll container en inner pages) — más quirúrgico pero requiere testing visual
3. Verificar en producción (Vercel) vs local — el timing puede ser diferente
