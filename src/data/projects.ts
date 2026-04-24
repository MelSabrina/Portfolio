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
  // single-track
  headingBold?:  string
  headingLight?: string
  description?:  { en: string; es: string }
  videoUrl?:     string
  videoPoster?:  string
  // multi-track
  tracks?:       TrackData[]
}

export const PROJECTS: Record<string, ProjectData> = {
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
}
