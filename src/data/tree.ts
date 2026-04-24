export type NodeKind = 'root' | 'branch' | 'project'

export interface TreeNode {
  id:          string
  kind:        NodeKind
  parentId:    string | null
  label:       { en: string; es: string }
  title:       { en: string; es: string }
  branchColor?: string   // solo en branch nodes — CSS var name
  minWidth?:   number
  x: number
  y: number
}

/** Devuelve el CSS var de color de la rama a la que pertenece un nodo. */
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
  {
    id: 'salud', kind: 'branch', parentId: 'mel',
    branchColor: '--color-salud',
    label: { en: 'health systems', es: 'sistemas de salud' },
    title: { en: 'Ministerio de Salud', es: 'Ministerio de Salud' },
    minWidth: 190,
    x: 760, y: 70,
  },
  {
    id: 'sistemas', kind: 'branch', parentId: 'mel',
    branchColor: '--color-sistemas',
    label: { en: 'dev & data', es: 'dev & datos' },
    title: { en: 'Sistemas', es: 'Sistemas' },
    x: 860, y: 300,
  },
  {
    id: 'otros', kind: 'branch', parentId: 'mel',
    branchColor: '--color-otros',
    label: { en: 'other work', es: 'otros trabajos' },
    title: { en: 'Otros', es: 'Otros' },
    x: 760, y: 640,
  },
  {
    id: 'bilos', kind: 'project', parentId: 'otros',
    label: { en: 'video • local ai', es: 'video • ia local' },
    title: { en: 'Bilos', es: 'Bilos' },
    minWidth: 162,
    x: 620, y: 510,
  },
  {
    id: 'visitaps', kind: 'project', parentId: 'salud',
    label: { en: 'PWA · UI/UX', es: 'PWA · UI/UX' },
    title: { en: 'VisitAPS', es: 'VisitAPS' },
    minWidth: 172,
    x: 620, y: 40,
  },
  {
    id: 'saludent', kind: 'project', parentId: 'salud',
    label: { en: 'Angular · Ionic', es: 'Angular · Ionic' },
    title: { en: 'SaludENT', es: 'SaludENT' },
    minWidth: 172,
    x: 620, y: 160,
  },
  {
    id: 'editorial', kind: 'project', parentId: 'salud',
    label: { en: 'editorial', es: 'editorial' },
    title: { en: 'Editorial Design', es: 'Diseño Editorial' },
    minWidth: 172,
    x: 620, y: 280,
  },
]
