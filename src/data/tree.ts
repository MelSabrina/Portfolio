export type NodeKind = 'root' | 'branch' | 'project'

export interface TreeNode {
  id:          string
  kind:        NodeKind
  parentId:    string | null
  label:       { en: string; es: string }
  title:       { en: string; es: string }
  branchColor?: string
  minWidth?:   number
  x: number
  y: number
}

export function branchColorOf(nodeId: string): string {
  let node = NODES.find(n => n.id === nodeId)
  while (node) {
    if (node.branchColor) return `var(${node.branchColor})`
    if (!node.parentId) break
    node = NODES.find(n => n.id === node!.parentId)
  }
  return 'var(--border)'
}

export const NODES: TreeNode[] = [
  {
    id: 'mel', kind: 'root', parentId: null,
    label: { en: 'System Designer', es: 'System Designer' },
    title: { en: 'Mel Pesce Ortiz', es: 'Mel Pesce Ortiz' },
    x: 145, y: 110,
  },

  // ── Branches ──────────────────────────────────────────────────────────────
  {
    id: 'interfaces', kind: 'branch', parentId: 'mel',
    branchColor: '--color-interfaces',
    label: { en: 'digital products', es: 'productos digitales' },
    title: { en: 'Interfaces', es: 'Interfaces' },
    minWidth: 175,
    x: 760, y: 60,
  },
  {
    id: 'editorial', kind: 'branch', parentId: 'mel',
    branchColor: '--color-editorial',
    label: { en: 'editorial & graphic', es: 'editorial & gráfica' },
    title: { en: 'Editorial', es: 'Editorial' },
    minWidth: 185,
    x: 860, y: 330,
  },
  {
    id: 'otros', kind: 'branch', parentId: 'mel',
    branchColor: '--color-otros',
    label: { en: 'other work', es: 'otros trabajos' },
    title: { en: 'Otros', es: 'Otros' },
    x: 760, y: 590,
  },

  // ── Interfaces ────────────────────────────────────────────────────────────
  {
    id: 'visitaps', kind: 'project', parentId: 'interfaces',
    label: { en: 'PWA · UI/UX', es: 'PWA · UI/UX' },
    title: { en: 'VisitAPS', es: 'VisitAPS' },
    minWidth: 172,
    x: 620, y: 40,
  },
  {
    id: 'saludent', kind: 'project', parentId: 'interfaces',
    label: { en: 'Angular · Ionic', es: 'Angular · Ionic' },
    title: { en: 'SaludENT', es: 'SaludENT' },
    minWidth: 172,
    x: 620, y: 160,
  },

  // ── Editorial ─────────────────────────────────────────────────────────────
  {
    id: 'rutas', kind: 'project', parentId: 'editorial',
    label: { en: 'editorial · MSAL', es: 'editorial · MSAL' },
    title: { en: 'Clinical Pathways', es: 'Vías Clínicas' },
    minWidth: 172,
    x: 620, y: 260,
  },
  {
    id: 'manuales', kind: 'project', parentId: 'editorial',
    label: { en: 'editorial · MSAL', es: 'editorial · MSAL' },
    title: { en: 'Selected Manuals', es: 'Manuales seleccionados' },
    minWidth: 172,
    x: 620, y: 380,
  },
  {
    id: 'estrategia', kind: 'project', parentId: 'editorial',
    label: { en: 'SUMMIT · MSAL', es: 'SUMMIT · MSAL' },
    title: { en: 'Digital Health 2025', es: 'Salud Digital 2025' },
    minWidth: 172,
    x: 620, y: 500,
  },
  {
    id: 'variaciones', kind: 'project', parentId: 'editorial',
    label: { en: 'book · essay', es: 'libro · ensayo' },
    title: { en: 'Las Variaciones Rosas', es: 'Las Variaciones Rosas' },
    minWidth: 200,
    x: 620, y: 620,
  },
  {
    id: 'lourdes', kind: 'project', parentId: 'editorial',
    label: { en: 'brand · identity', es: 'marca · identidad' },
    title: { en: 'Paseo Lourdes', es: 'Paseo Lourdes' },
    minWidth: 172,
    x: 620, y: 740,
  },
  {
    id: 'generacion', kind: 'project', parentId: 'editorial',
    label: { en: 'editorial · identity', es: 'editorial · identidad' },
    title: { en: 'Generación Desarrollo', es: 'Generación Desarrollo' },
    minWidth: 195,
    x: 620, y: 860,
  },

  // ── Otros ─────────────────────────────────────────────────────────────────
  {
    id: 'bilos', kind: 'project', parentId: 'otros',
    label: { en: 'video • local ai', es: 'video • ia local' },
    title: { en: 'Bilos', es: 'Bilos' },
    minWidth: 162,
    x: 620, y: 510,
  },
  {
    id: 'acostactics', kind: 'project', parentId: 'otros',
    label: { en: 'computer vision · ML', es: 'visión artificial · ML' },
    title: { en: 'Acostactics', es: 'Acostactics' },
    minWidth: 180,
    x: 620, y: 630,
  },
]
