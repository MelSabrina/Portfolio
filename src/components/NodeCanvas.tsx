import React, { useState, useRef, useCallback, useEffect } from 'react'
import { NODES, branchColorOf, type TreeNode } from '../data/tree'
import { PROJECTS } from '../data/projects'
import { PortfolioNode } from './PortfolioNode'
import { RootNode } from './RootNode'
import { ProjectTextNode } from './ProjectTextNode'
import { ProjectAppNode } from './ProjectAppNode'
import { ProjectVideoNode } from './ProjectVideoNode'

interface Props { lang: 'en' | 'es' }

interface Vp  { x: number; y: number; scale: number }
interface Pos { x: number; y: number }

interface UIState {
  expanded: Set<string>
  active:   string | null
}

const SPAWN_GAP_X =  60   // gap horizontal entre padre y primer hijo
const SPAWN_GAP_Y =  18   // gap vertical entre hermanos
const FALLBACK_W  = 155
const FALLBACK_H  =  68

const ZOOM_FACTOR = 1.12
const ZOOM_MIN    = 0.25
const ZOOM_MAX    = 2.5

interface Size { w: number; h: number }

function spawnChildren(parentId: string, parentPos: Pos, parentSize: Size): Record<string, Pos> {
  const children = NODES.filter(n => n.parentId === parentId)
  const n   = children.length
  const out: Record<string, Pos> = {}
  children.forEach((child, i) => {
    out[child.id] = {
      x: parentPos.x + parentSize.w + SPAWN_GAP_X,
      y: parentPos.y + (i - (n - 1) / 2) * (FALLBACK_H + SPAWN_GAP_Y),
    }
  })
  return out
}

function initPositions(): Record<string, Pos> {
  const pos: Record<string, Pos> = {}
  NODES.forEach(n => {
    if (n.kind !== 'project') pos[n.id] = { x: n.x, y: n.y }
  })
  return pos
}

export function NodeCanvas({ lang }: Props) {
  const [vp, setVp] = useState<Vp>({ x: 120, y: 100, scale: 1 })
  const vpRef  = useRef(vp)
  useEffect(() => { vpRef.current = vp }, [vp])

  const [positions, setPositions] = useState<Record<string, Pos>>(initPositions)
  const posRef = useRef(positions)
  useEffect(() => { posRef.current = positions }, [positions])

  const [sizes, setSizes] = useState<Record<string, Size>>({})
  const sizesRef = useRef(sizes)
  useEffect(() => { sizesRef.current = sizes }, [sizes])

  const handleSize = useCallback((id: string, w: number, h: number) => {
    setSizes(s => (s[id]?.w === w && s[id]?.h === h) ? s : { ...s, [id]: { w, h } })
  }, [])

  const [ui, setUi] = useState<UIState>({ expanded: new Set(), active: null })
  const uiRef = useRef(ui)
  useEffect(() => { uiRef.current = ui }, [ui])

  const visible = useCallback((n: TreeNode) => {
    if (n.kind === 'root' || n.kind === 'branch') return true
    return n.parentId ? ui.expanded.has(n.parentId) : false
  }, [ui.expanded])

  const handleNodeClick = useCallback((id: string, kind: string) => {
    if (kind === 'branch') {
      setUi(s => {
        const wasExpanded = s.expanded.has(id)
        const next = new Set(s.expanded)
        if (wasExpanded) {
          next.delete(id)
        } else {
          next.clear()   // cierra todas las otras ramas
          next.add(id)
          // Spawn hijos en la posición actual del padre
          const parentPos  = posRef.current[id]
          const parentSize = sizesRef.current[id] ?? { w: FALLBACK_W, h: FALLBACK_H }
          if (parentPos) {
            setPositions(p => ({ ...p, ...spawnChildren(id, parentPos, parentSize) }))
          }
        }
        return { ...s, expanded: next, active: null }
      })
    } else if (kind === 'project') {
      const wasActive = uiRef.current.active === id
      setUi(s => ({ ...s, active: wasActive ? null : id }))
      if (!wasActive && PROJECTS[id]) {
        const parentPos  = posRef.current[id]
        const parentSize = sizesRef.current[id] ?? { w: FALLBACK_W, h: FALLBACK_H }
        if (parentPos) {
          const proj  = PROJECTS[id]
          const rx    = parentPos.x + parentSize.w + 50
          const vx    = parentPos.x + parentSize.w + 465
          const cy    = parentPos.y + parentSize.h / 2
          const ROW_H = 520
          if (proj.tracks) {
            const offsets: Record<string, { x: number; y: number }> = {}
            // subtract half track-node height (~175px) so row centers are symmetric around bilos center
            proj.tracks.forEach((_, i) => {
              const ry = cy - ((proj.tracks!.length - 1) * ROW_H) / 2 + i * ROW_H - 175
              offsets[`${id}-text-${i}`]  = { x: rx, y: ry }
              offsets[`${id}-video-${i}`] = { x: vx, y: ry }
            })
            setPositions(p => ({ ...p, ...offsets }))
          } else {
            setPositions(p => ({
              ...p,
              [`${id}-text`]:  { x: rx, y: cy - 120 },
              ...(proj.appUrl   ? { [`${id}-app`]:   { x: vx, y: cy - 280 } } : {}),
              ...(proj.videoUrl ? { [`${id}-video`]: { x: vx, y: cy - 220 } } : {}),
            }))
          }
        }
      }
    }
  }, [])

  // ── Drag nodo ─────────────────────────────────────────────────────────────
  const dragRef = useRef<{ id: string; offX: number; offY: number; followers: string[] } | null>(null)

  const onNodeMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (e.button !== 0) return
    e.stopPropagation()
    const { x, y, scale } = vpRef.current
    const pos = posRef.current[id]

    // Text nodes drag their paired media nodes as followers
    let followers: string[] = []
    const activeId = uiRef.current.active
    if (activeId && PROJECTS[activeId]) {
      const proj = PROJECTS[activeId]
      if (proj.tracks) {
        proj.tracks.forEach((_, i) => {
          if (id === `${activeId}-text-${i}`) followers = [`${activeId}-video-${i}`]
        })
      } else if (id === `${activeId}-text`) {
        followers = [
          ...(proj.appUrl   ? [`${activeId}-app`]   : []),
          ...(proj.videoUrl ? [`${activeId}-video`] : []),
        ]
      }
    }

    dragRef.current = {
      id,
      offX: (e.clientX - x) / scale - pos.x,
      offY: (e.clientY - y) / scale - pos.y,
      followers,
    }
  }, [])

  // ── Pan canvas ────────────────────────────────────────────────────────────
  const panRef = useRef<{ startX: number; startY: number; vpX: number; vpY: number } | null>(null)

  const onCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      const { x, y } = vpRef.current
      panRef.current = { startX: e.clientX, startY: e.clientY, vpX: x, vpY: y }
    }
  }, [])

  // ── Zoom ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR
      setVp(v => {
        const newScale = Math.min(Math.max(v.scale * factor, ZOOM_MIN), ZOOM_MAX)
        const ratio    = newScale / v.scale
        return {
          x:     e.clientX - (e.clientX - v.x) * ratio,
          y:     e.clientY - (e.clientY - v.y) * ratio,
          scale: newScale,
        }
      })
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  // ── Mouse move / up global ────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const { id, offX, offY, followers } = dragRef.current
        const { x, y, scale } = vpRef.current
        const nx = (e.clientX - x) / scale - offX
        const ny = (e.clientY - y) / scale - offY
        setPositions(p => {
          const dx = nx - p[id].x
          const dy = ny - p[id].y
          const next: typeof p = { ...p, [id]: { x: nx, y: ny } }
          for (const fid of followers) {
            if (p[fid]) next[fid] = { x: p[fid].x + dx, y: p[fid].y + dy }
          }
          return next
        })
        return
      }
      if (panRef.current) {
        const { startX, startY, vpX, vpY } = panRef.current
        setVp(v => ({ ...v, x: vpX + (e.clientX - startX), y: vpY + (e.clientY - startY) }))
      }
    }
    const onUp = () => { dragRef.current = null; panRef.current = null }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
    }
  }, [])

  // ── Content node edges ────────────────────────────────────────────────────
  const contentEdges = (() => {
    const active = ui.active
    if (!active || !PROJECTS[active]) return []
    const projectPos  = positions[active]
    const projectSize = sizes[active] ?? { w: FALLBACK_W, h: FALLBACK_H }
    if (!projectPos) return []
    const color = branchColorOf(active)
    const proj  = PROJECTS[active]

    const makeSeg = (fromId: string, toId: string, fromFallback: Size, toFallback: Size) => {
      const fPos  = positions[fromId]
      const fSize = sizes[fromId] ?? fromFallback
      const tPos  = positions[toId]
      const tSize = sizes[toId]  ?? toFallback
      if (!fPos || !tPos) return []
      const x1 = fPos.x + fSize.w
      const y1 = fPos.y + fSize.h / 2
      const x2 = tPos.x
      const y2 = tPos.y + tSize.h / 2
      const t  = Math.max(Math.abs(x2 - x1) * 0.5, 60)
      return [{ id: `${fromId}→${toId}`, d: `M ${x1},${y1} C ${x1+t},${y1} ${x2-t},${y2} ${x2},${y2}`, color }]
    }

    const pFb   = { w: FALLBACK_W, h: FALLBACK_H }
    const txtFb = { w: 340, h: 349 }
    const medFb = { w: 360, h: 349 }

    if (proj.tracks) {
      return proj.tracks.flatMap((_, i) => [
        ...makeSeg(active,                  `${active}-text-${i}`,  pFb,   txtFb),
        ...makeSeg(`${active}-text-${i}`,   `${active}-video-${i}`, txtFb, medFb),
      ])
    }
    const txtId = `${active}-text`
    return [
      ...makeSeg(active,  txtId,             pFb,   txtFb),
      ...(proj.appUrl   ? makeSeg(txtId, `${active}-app`,   txtFb, medFb) : []),
      ...(proj.videoUrl ? makeSeg(txtId, `${active}-video`, txtFb, medFb) : []),
    ]
  })()

  // ── Bezier edges ──────────────────────────────────────────────────────────
  const edges = NODES.filter(n => n.parentId && visible(n) && positions[n.id] && positions[n.parentId!]).map(n => {
    const from  = positions[n.parentId!]
    const to    = positions[n.id]
    const fromSz = sizes[n.parentId!] ?? { w: FALLBACK_W, h: FALLBACK_H }
    const toSz   = sizes[n.id]       ?? { w: FALLBACK_W, h: FALLBACK_H }
    const x1 = from.x + fromSz.w
    const y1 = from.y + fromSz.h / 2
    const x2 = to.x
    const y2 = to.y + toSz.h / 2
    const t  = Math.max(Math.abs(x2 - x1) * 0.5, 60)
    const d     = `M ${x1},${y1} C ${x1 + t},${y1} ${x2 - t},${y2} ${x2},${y2}`
    const color = branchColorOf(n.id)
    return { id: n.id, d, color }
  })

  const { x: vpX, y: vpY, scale } = vp
  const gridSize   = 28 * scale
  const dotOpacity = Math.min(1, Math.max(0, (scale - 0.4) / 0.2))

  return (
    <div
      className="canvas-root"
      onMouseDown={onCanvasMouseDown}
    >
      <div
        className="canvas-dots"
        style={{
          backgroundSize:     `${gridSize}px ${gridSize}px`,
          backgroundPosition: `${vpX}px ${vpY}px`,
          opacity: dotOpacity,
        }}
      />
      <svg
        className="canvas-edges"
        style={{ transform: `translate(${vpX}px,${vpY}px) scale(${scale})` }}
        width="4000" height="4000" viewBox="0 0 4000 4000"
      >
        {[...edges, ...contentEdges].map(e => (
          <g key={e.id}>
            <path d={e.d} stroke={e.color} strokeWidth="6"  fill="none" opacity="0.18" />
            <path d={e.d} stroke={e.color} strokeWidth="1.5" fill="none" opacity="0.85" />
          </g>
        ))}
      </svg>

      <div
        className="canvas-world"
        style={{ transform: `translate(${vpX}px,${vpY}px) scale(${scale})` }}
      >
        {NODES.filter(visible).map(n =>
          n.kind === 'root' ? (
            <RootNode
              key={n.id}
              pos={positions[n.id] ?? { x: 0, y: 0 }}
              lang={lang}
              onMouseDown={e => onNodeMouseDown(e, n.id)}
              onSize={(w, h) => handleSize(n.id, w, h)}
            />
          ) : (
            <PortfolioNode
              key={n.id}
              node={n}
              pos={positions[n.id] ?? { x: 0, y: 0 }}
              lang={lang}
              active={ui.active === n.id}
              expanded={ui.expanded.has(n.id)}
              nodeColor={branchColorOf(n.id)}
              onMouseDown={e => onNodeMouseDown(e, n.id)}
              onClick={() => handleNodeClick(n.id, n.kind)}
              onSize={(w, h) => handleSize(n.id, w, h)}
            />
          )
        )}

        {ui.active && PROJECTS[ui.active] && (() => {
          const proj = PROJECTS[ui.active!]
          const id   = ui.active!
          if (proj.tracks) {
            return proj.tracks.map((_, i) => (
              <React.Fragment key={i}>
                <ProjectTextNode
                  projectId={id} trackIndex={i}
                  pos={positions[`${id}-text-${i}`] ?? { x: 0, y: 0 }}
                  lang={lang} nodeColor={branchColorOf(id)}
                  onMouseDown={e => onNodeMouseDown(e, `${id}-text-${i}`)}
                  onSize={(w, h) => handleSize(`${id}-text-${i}`, w, h)}
                />
                <ProjectVideoNode
                  projectId={id} trackIndex={i}
                  pos={positions[`${id}-video-${i}`] ?? { x: 0, y: 0 }}
                  nodeColor={branchColorOf(id)}
                  onMouseDown={e => onNodeMouseDown(e, `${id}-video-${i}`)}
                  onSize={(w, h) => handleSize(`${id}-video-${i}`, w, h)}
                />
              </React.Fragment>
            ))
          }
          return <>
            <ProjectTextNode
              key={`${id}-text`}
              projectId={id}
              pos={positions[`${id}-text`] ?? { x: 0, y: 0 }}
              lang={lang} nodeColor={branchColorOf(id)}
              onMouseDown={e => onNodeMouseDown(e, `${id}-text`)}
              onSize={(w, h) => handleSize(`${id}-text`, w, h)}
            />
            <ProjectAppNode
              key={`${id}-app`}
              projectId={id}
              pos={positions[`${id}-app`] ?? { x: 0, y: 0 }}
              nodeColor={branchColorOf(id)}
              onMouseDown={e => onNodeMouseDown(e, `${id}-app`)}
              onSize={(w, h) => handleSize(`${id}-app`, w, h)}
            />
            <ProjectVideoNode
              key={`${id}-video`}
              projectId={id}
              pos={positions[`${id}-video`] ?? { x: 0, y: 0 }}
              nodeColor={branchColorOf(id)}
              onMouseDown={e => onNodeMouseDown(e, `${id}-video`)}
              onSize={(w, h) => handleSize(`${id}-video`, w, h)}
            />
          </>
        })()}
      </div>
    </div>
  )
}
