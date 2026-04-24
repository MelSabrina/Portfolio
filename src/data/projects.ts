export interface TrackData {
  headingBold?:  string
  headingLight?: string
  description:   { en: string; es: string }
  videoUrl?:     string
  videoPoster?:  string
  videoWidth?:   number  // px — defaults to 400; height always 315px in track mode
}

export interface ProjectData {
  id:            string
  tech:          string[]
  role:          { en: string[]; es: string[] }
  appUrl?:       string
  linkUrl?:      string
  linkLabel?:    { en: string; es: string }
  bgVideo?:        string
  bgVideoOffset?:  { dx: number; dy: number }
  // custom per-image positions (dx/dy relative to imgX0, cy)
  imageLayout?:    Array<{ dx: number; dy: number }>
  // explicit link-node position (dx/dy relative to imgX0, cy) — overrides computed anchor
  linkOffset?:     { dx: number; dy: number }
  // shifts the entire image cluster (imgX0 + dx, cy + dy)
  clusterOffset?:  { dx: number; dy: number }
  // per-column x offset for the default grid (index = column number)
  imageColumnOffsets?: number[]
  // per-image delta offsets applied on top of grid or imageLayout position
  imageOffsets?: Record<number, { dx?: number; dy?: number }>
  // single-track
  headingBold?:  string
  headingLight?: string
  description?:  { en: string; es: string }
  videoUrl?:     string
  videoPoster?:  string
  // multi-track
  tracks?:       TrackData[]
  // image gallery
  images?: Array<{ url: string; width?: number }>
}

export const PROJECTS: Record<string, ProjectData> = {
  rutas: {
    id: 'rutas',
    headingBold:  'Clinical Pathways',
    headingLight: 'for the Healthcare System',
    description: {
      en: `In 2023, Argentina's Ministry of Health (MSAL) needed standardized visual tools to support clinical decision-making at the point of care. The challenge: dense medical protocols with inconsistent hierarchy, producing high cognitive load for physicians and health workers under pressure.

Working with PAHO/OPS, I designed a modular graphic system for the country's national clinical pathways — beginning with Hypertension and Type 2 Diabetes, the two leading causes of preventable mortality in Argentina.

The system uses strict grid structure, color-coded sections, and A3/A2 formats engineered to remain readable at 1.5 meters in a clinical environment. Every typographic and layout decision follows clinical reading patterns: rapid scanning under pressure, not leisurely reading.

Both pathways are officially deployed across national hospitals and distributed through PAHO's regional network. The system became the design foundation for all subsequent MSAL clinical pathway publications.`,
      es: `En 2023, el Ministerio de Salud (MSAL) necesitaba herramientas visuales estandarizadas para apoyar la toma de decisiones clínicas en el punto de atención. El desafío: protocolos médicos densos con jerarquía inconsistente, generando alta carga cognitiva para médicos y agentes sanitarios bajo presión.

En colaboración con la OPS/PAHO, diseñé un sistema gráfico modular para las vías clínicas nacionales — empezando por Hipertensión Arterial y Diabetes Mellitus Tipo 2, las dos principales causas de mortalidad prevenible en Argentina.

El sistema usa grilla estricta, secciones codificadas por color y formatos A3/A2 diseñados para ser legibles a 1,5 metros en entornos clínicos. Cada decisión tipográfica y de layout sigue los patrones de lectura clínica: escaneo rápido bajo presión.

Ambas vías clínicas están desplegadas oficialmente en hospitales nacionales y distribuidas por la red regional de la OPS. El sistema se convirtió en la base de diseño para todas las publicaciones de vías clínicas del MSAL que siguieron.`,
    },
    tech: ['Illustrator', 'InDesign', 'A3/A2 Print'],
    role: {
      en: ['Editorial Design', 'Graphic System', 'Information Design'],
      es: ['Diseño Editorial', 'Sistema Gráfico', 'Diseño de Información'],
    },
    linkUrl:   'https://www.behance.net/gallery/240161979/Clinical-Pathways-for-Argentinas-Healthcare-System',
    linkLabel: { en: 'View on Behance', es: 'Ver en Behance' },
    images: [
      { url: '/assets/projects/vias-clinicas/2.jpg', width: 320 },
      { url: '/assets/projects/vias-clinicas/4.jpg', width: 280 },
      { url: '/assets/projects/vias-clinicas/5.jpg', width: 300 },
      { url: '/assets/projects/vias-clinicas/6.jpg', width: 280 },
      { url: '/assets/projects/vias-clinicas/7.png', width: 300 },
      { url: '/assets/projects/vias-clinicas/9.png', width: 340 },
    ],
    clusterOffset: { dx: 30, dy: 0 },
    imageColumnOffsets: [0, -40],
    imageOffsets: { 0: { dx: -25 } },
  },

  visitaps: {
    id: 'visitaps',
    description: {
      en: `VisitAPS is a PWA built for health agents at Argentina's Ministry of Health. Not pharmaceutical reps — APS workers. The ones who go door to door in primary care zones, conducting household health surveys (relevamientos) in the field.

The app works offline. It collects structured data about housing conditions, household members, healthcare access, animal presence. Syncs to a national database when connectivity returns.

I designed the visual identity and the full UI system, then built the frontend: Vanilla JS, Supabase, service worker, hash-based SPA routing. No framework.

What stayed with me: this became someone's actual work tool. It's in their pocket when they knock on doors in the morning. Knowing that changed how I think about what design is for.`,
      es: `VisitAPS es una PWA para los agentes sanitarios del Ministerio de Salud de la Nación. No los visitadores de las farmacéuticas — los de APS. Las personas que van de puerta en puerta en las zonas de atención primaria, haciendo relevamientos sanitarios domiciliarios.

La app funciona sin conexión. Registra datos estructurados sobre condiciones de vivienda, integrantes del hogar, acceso a la salud, presencia de animales. Sincroniza con la base nacional cuando hay señal.

Diseñé la identidad visual y el sistema de UI completo, y construí el frontend: Vanilla JS, Supabase, service worker, ruteo SPA por hash. Sin framework.

Lo que más me marcó: esto se convirtió en la herramienta de trabajo real de alguien. Está en su bolsillo cuando golpean puertas a la mañana. Saber eso cambió cómo pienso para qué sirve el diseño.`,
    },
    tech: ['Vanilla JS', 'Supabase', 'PWA', 'Service Worker', 'Hash routing'],
    role: {
      en: ['UI Design', 'Visual Identity', 'Frontend Dev'],
      es: ['Diseño UI', 'Identidad visual', 'Frontend Dev'],
    },
    appUrl: '/visitaps-demo/index.html',
  },

  estrategia: {
    id: 'estrategia',
    headingBold:  'Estrategia Nacional',
    headingLight: 'de Salud Digital 2025',
    description: {
      en: `Argentina's Ministry of Health, PAHO, and the IDB co-organized the National Digital Health Strategy 2025 — a federal summit attended by health professionals across the country's digital health agenda.

I designed the visual identity for the event: credential systems, event signage, editorial collateral, and printed materials distributed at the summit. The work required building coherent brand expression across three co-organizing institutions, each with existing brand guidelines.

The identity holds from A0 signage boards to pocket-sized printed notebooks.`,
      es: `El Ministerio de Salud de la Nación, la OPS y el BID organizaron la Estrategia Nacional de Salud Digital 2025 — un congreso federal para profesionales de salud en torno a la agenda de salud digital del país.

Diseñé la identidad visual del evento: sistema de credenciales, señalética, colaterales editoriales y materiales impresos distribuidos en el congreso. El trabajo requería construir expresión de marca coherente entre tres instituciones co-organizadoras, cada una con sus propias guías.

La identidad funciona desde paneles de señalética A0 hasta cuadernos de bolsillo impresos.`,
    },
    tech: ['Illustrator', 'InDesign', 'Print', 'Brand Identity'],
    role: {
      en: ['Visual Identity', 'Event Design', 'Editorial Design'],
      es: ['Identidad Visual', 'Diseño de Evento', 'Diseño Editorial'],
    },
    images: [
      { url: '/assets/projects/digital-health/asd.jpg',        width: 170 },
      { url: '/assets/projects/digital-health/letterboard.png', width: 170 },
      { url: '/assets/projects/digital-health/cinta.jpg',      width: 170 },
      { url: '/assets/projects/digital-health/bocetos.png',    width: 170 },
      { url: '/assets/projects/digital-health/cuaderno.png',   width: 170 },
      { url: '/assets/projects/digital-health/notebooks.jpeg', width: 170 },
      { url: '/assets/projects/digital-health/team.jpeg',      width: 170 },
    ],
    imageLayout: [
      // 3-col grid: dx 125 / 320 / 515, right edge 685, 25px gutters
      // Row 1 — bottom-aligned at cy-40
      { dx:  88, dy: -272 },  // asd.jpg         — 202px tall
      { dx: 293, dy: -275 },  // letterboard.png  — 205px tall
      { dx: 515, dy: -191 },  // cinta.jpg        — 121px tall
      // Row 2
      { dx: 515, dy:  -40 },  // bocetos.png      — right col, 162px tall
      // Row 3
      { dx:  88, dy:  235 },  // cuaderno.png     — left col, 255px tall
      { dx: 293, dy:  235 },  // notebooks.jpeg   — center col, 302px tall
      { dx: 515, dy:  195 },  // team.jpeg        — right col, 227px tall
    ],
    bgVideo:       '/assets/projects/digital-health/white.mp4',
    bgVideoOffset: { dx: 80, dy: -40 },   // row 2, slightly left of col A to split cable from cuaderno
    linkOffset:    { dx: 589, dy: 460 },  // below team bottom (cy+408), bottom≈notebooks bottom (cy+537)
    linkUrl:   'https://www.behance.net/gallery/240990209/National-Digital-Health-Strategy-2025',
    linkLabel: { en: 'View on Behance', es: 'Ver en Behance' },
  },

  bilos: {
    id: 'bilos',
    tech: ['TouchDesigner', 'ComfyUI', 'Stable Diffusion 1.5', 'TensorRT', 'Unreal Engine 5'],
    role: {
      en: ['Direction', 'Visual Design', 'Real-time Rendering'],
      es: ['Dirección', 'Diseño visual', 'Renderizado en tiempo real'],
    },
    tracks: [
      {
        headingBold:  'Habitaciones Traseras — Bilos',
        headingLight: 'Visualizer',
        description: {
          en: `Habitaciones Traseras opens the second record of Bilos, an underground duo from Buenos Aires. Co-produced with bassist Augusto Mastropablo.

The visualizer runs Stable Diffusion 1.5 in real time over a scene built in Unreal Engine 5, filtered through a single prompt: "Backrooms" — a concept so saturated in the model's training data that it has developed its own visual grammar. The result isn't hallucination: it's recognition. Every frame passes through the accumulated weight of thousands of images that share that specific uncanny quality — long corridors, fluorescent light, wrong carpet.`,
          es: `Habitaciones Traseras abre el segundo disco de Bilos, dúo del under porteño. Coproducido con su bajista, Augusto Mastropablo.

El visualizer corre Stable Diffusion 1.5 en tiempo real sobre una escena construida en Unreal Engine 5, filtrada por un único prompt: "Backrooms" — un concepto tan saturado en los datos de entrenamiento del modelo que desarrolló su propia gramática visual. El resultado no es alucinación: es reconocimiento. Cada frame pasa por el peso acumulado de miles de imágenes que comparten esa incomodidad específica — pasillos largos, luz de tubo, alfombra equivocada.`,
        },
        videoUrl:    '/videos/habitaciones_traseras.mp4',
        videoPoster: '/videos/ht_poster.jpg',
        videoWidth:  560,
      },
      {
        headingBold:  'Tren — Bilos',
        headingLight: 'Visualizer',
        description: {
          en: `Tren is the closing track. The visualizer explores the latent space in glyphs — what happens when you let Stable Diffusion 1.5 decide how much it wants to recognize a letterform and how much it'd rather hallucinate something else.

CFG scale drifts in real time with the music — high enough for the model to hold the typography, low enough for it to dissolve. The topology of the text warps, collapses, and sometimes comes back.`,
          es: `Tren es el track de cierre. El visualizer explora el espacio latente en los glifos — qué pasa cuando dejás que Stable Diffusion 1.5 decida cuánto quiere reconocer una letra y cuánto prefiere alucinar otra cosa.

El CFG scale deriva en tiempo real con la música — lo suficientemente alto para que el modelo sostenga la tipografía, lo suficientemente bajo para que la abandone. La topología del texto se deforma, se disuelve, y a veces se recompone.`,
        },
        videoUrl:    '/videos/Tren_Proteus_cut.mp4',
        videoPoster: '/videos/tren_poster.jpg',
        videoWidth:  315,
      },
    ],
  },

  saludent: {
    id: 'saludent',
    tech: ['Angular', 'Ionic', 'TypeScript', 'SCSS', 'PWA', 'Capacitor'],
    role: {
      en: ['UI Design', 'UX Design', 'Frontend Dev'],
      es: ['Diseño UI', 'Diseño UX', 'Frontend Dev'],
    },
    headingBold:  'SaludENT',
    headingLight: 'v1 demo',
    description: {
      en: `SaludENT is a clinical decision support tool for primary care physicians and health workers at Argentina's Ministry of Health. It consolidates the national clinical guidelines (GPC) for the most prevalent chronic diseases — hypertension, diabetes, COPD, obesity, and more — into a navigable, offline-capable app.

The interface is built for the field: fast lookup, no friction, works without connectivity. Each module follows the GPC structure — epidemiology, evaluation, targets, management — with embedded algorithms, calculators, and clinical pathways.

Only the Cardiología module (Hypertension) is available in this demo. The full app covers 12 programs across the national chronic disease agenda.`,
      es: `SaludENT es una herramienta de apoyo a la decisión clínica para médicos de cabecera y agentes sanitarios del Ministerio de Salud de la Nación. Consolida las guías de práctica clínica (GPC) nacionales para las enfermedades crónicas prevalentes — hipertensión, diabetes, EPOC, obesidad y más — en una app navegable y con capacidad offline.

La interfaz está pensada para el campo: búsqueda rápida, sin fricción, funciona sin conectividad. Cada módulo sigue la estructura de la GPC — epidemiología, evaluación, metas, manejo — con algoritmos embebidos, calculadoras y vías clínicas.

Solo el módulo de Cardiología (Hipertensión) está disponible en este demo. La app completa cubre 12 programas del plan nacional de enfermedades crónicas.`,
    },
    appUrl: '/saludent-demo/browser/index.html',
  },

  generacion: {
    id: 'generacion',
    headingBold:  'Generación Desarrollo',
    headingLight: '— identidad visual',
    description: {
      en: `[Copy pendiente — completar con Mel]`,
      es: `[Copy pendiente — completar con Mel]`,
    },
    tech: ['Illustrator', 'InDesign'],
    role: {
      en: ['Visual Identity', 'Brand Design', 'Editorial Design'],
      es: ['Identidad Visual', 'Diseño de Marca', 'Diseño Editorial'],
    },
    images: [
      { url: '/assets/projects/generacion/patron.jpg', width: 340 },
    ],
  },
}
