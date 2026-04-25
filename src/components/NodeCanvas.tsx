import React, { useState, useRef, useCallback, useEffect } from 'react'
import { NODES, branchColorOf, type TreeNode } from '../data/tree'
import { PROJECTS } from '../data/projects'
import { PortfolioNode } from './PortfolioNode'
import { RootNode } from './RootNode'
import { ProjectTextNode } from './ProjectTextNode'
import { ProjectAppNode } from './ProjectAppNode'
import { ProjectVideoNode } from './ProjectVideoNode'
import { ProjectImageNode } from './ProjectImageNode'
import { ProjectLinkNode } from './ProjectLinkNode'
import { ProjectBgVideoNode } from './ProjectBgVideoNode'
import { ProjectCarouselNode } from './ProjectCarouselNode'

interface Props { lang: 'en' | 'es' }

interface Vp  { x: number; y: number; scale: number }
interface Pos { x: number; y: number }

interface UIState {
  expanded: Set<string>
  active:   string | null
}

const SPAWN_GAP_X = 140   // gap horizontal entre padre y primer hijo
const SPAWN_GAP_Y =  90   // gap vertical entre hermanos
const FALLBACK_W  = 155
const FALLBACK_H  =  68

const ZOOM_FACTOR = 1.12
const ZOOM_MIN    = 0.25
const ZOOM_MAX    = 2.5

interface Size { w: number; h: number }

interface EdgeIndicator {
  id:    string
  color: string
  side:  'top' | 'bottom' | 'left' | 'right'
  along: number
  show:  boolean
  seed:  number
}

function nodeHash(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

function computeEdgeIndicators(
  nodes:          TreeNode[],
  positions:      Record<string, Pos>,
  sizes:          Record<string, Size>,
  vp:             Vp,
  activeId:       string | null,
  activeBranchId: string | null | undefined,
): EdgeIndicator[] {
  const W = window.innerWidth
  const H = window.innerHeight
  const DEADZONE = 30
  const out: EdgeIndicator[] = []

  for (const node of nodes) {
    const pos  = positions[node.id]
    const size = sizes[node.id] ?? { w: FALLBACK_W, h: FALLBACK_H }
    if (!pos) continue

    const cx = pos.x * vp.scale + vp.x + (size.w * vp.scale) / 2
    const cy = pos.y * vp.scale + vp.y + (size.h * vp.scale) / 2

    const dLeft   = -cx
    const dRight  = cx - W
    const dTop    = -cy
    const dBottom = cy - H

    const offScreen = Math.max(dLeft, dRight, dTop, dBottom) >= DEADZONE
    const dimmed    = activeId !== null
      && node.id !== activeId
      && node.parentId === activeBranchId
    const show = offScreen && !dimmed

    const color = branchColorOf(node.id)

    let side: EdgeIndicator['side']
    let along: number
    if (dLeft >= dRight && dLeft >= dTop && dLeft >= dBottom) {
      side = 'left';   along = Math.max(12, Math.min(H - 12, cy))
    } else if (dRight > dLeft && dRight >= dTop && dRight >= dBottom) {
      side = 'right';  along = Math.max(12, Math.min(H - 12, cy))
    } else if (dTop >= dBottom) {
      side = 'top';    along = Math.max(12, Math.min(W - 12, cx))
    } else {
      side = 'bottom'; along = Math.max(12, Math.min(W - 12, cx))
    }

    out.push({ id: node.id, color, side, along, show, seed: nodeHash(node.id) })
  }

  return out
}

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

  // DOM refs for zero-React-overhead pan/zoom
  const canvasWorldRef = useRef<HTMLDivElement>(null)
  const canvasEdgesRef = useRef<SVGSVGElement>(null)
  const canvasDotsRef  = useRef<HTMLDivElement>(null)
  const vpSyncRef      = useRef<ReturnType<typeof setTimeout>>()

  // Apply vp directly to DOM — bypasses React render during active interaction
  const commitVp = useCallback((v: Vp) => {
    vpRef.current = v
    const t = `translate(${v.x}px,${v.y}px) scale(${v.scale})`
    if (canvasWorldRef.current) canvasWorldRef.current.style.transform = t
    if (canvasEdgesRef.current) canvasEdgesRef.current.style.transform  = t
    if (canvasDotsRef.current) {
      const gs = 28 * v.scale
      const op = Math.min(1, Math.max(0, (v.scale - 0.4) / 0.2))
      canvasDotsRef.current.style.backgroundSize     = `${gs}px ${gs}px`
      canvasDotsRef.current.style.backgroundPosition = `${v.x}px ${v.y}px`
      canvasDotsRef.current.style.opacity            = String(op)
    }
  }, [])

  useEffect(() => () => clearTimeout(vpSyncRef.current), [])

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
    if (suppressNextClick.current) { suppressNextClick.current = false; return }
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
          const rx    = parentPos.x + parentSize.w + 130
          const vx    = parentPos.x + parentSize.w + 545
          const cy    = parentPos.y + parentSize.h / 2
          const ROW_H = 520
          if (proj.tracks) {
            const offsets: Record<string, { x: number; y: number }> = {}
            // subtract half track-node height (~175px) so row centers are symmetric around bilos center
            proj.tracks.forEach((track, i) => {
              const ry = cy - ((proj.tracks!.length - 1) * ROW_H) / 2 + i * ROW_H - 175 + (track.spawnDy ?? 0)
              offsets[`${id}-text-${i}`]  = { x: rx, y: ry }
              offsets[`${id}-video-${i}`] = { x: vx, y: ry }
            })
            setPositions(p => ({ ...p, ...offsets }))
          } else {
            const imgOffsets: Record<string, Pos> = {}
            if (proj.images?.length) {
              const COLS  = 2
              const COL_W = 400
              const ROW_H = 260
              const rows  = Math.ceil(proj.images.length / COLS)
              const imgX0 = rx + 380 + (proj.clusterOffset?.dx ?? 0)
              const imgCy = cy + (proj.clusterOffset?.dy ?? 0)
              proj.images.forEach((_, i) => {
                const layout = proj.imageLayout?.[i]
                const imgDelta = proj.imageOffsets?.[i]
                if (layout) {
                  imgOffsets[`${id}-img-${i}`] = {
                    x: imgX0 + layout.dx + (imgDelta?.dx ?? 0),
                    y: imgCy + layout.dy + (imgDelta?.dy ?? 0),
                  }
                } else {
                  const col  = i % COLS
                  const row  = Math.floor(i / COLS)
                  const seed = nodeHash(`${id}-img-${i}`)
                  imgOffsets[`${id}-img-${i}`] = {
                    x: imgX0 + col * COL_W + (seed % 40) - 20 + (proj.imageColumnOffsets?.[col] ?? 0) + (imgDelta?.dx ?? 0),
                    y: imgCy - (rows * ROW_H) / 2 + row * ROW_H + (seed % 50) - 25 + (imgDelta?.dy ?? 0),
                  }
                }
              })
              // Link node: explicit offset takes priority, else anchored below last right-column image
              if (proj.linkUrl) {
                if (proj.linkOffset) {
                  imgOffsets[`${id}-link`] = { x: imgX0 + proj.linkOffset.dx, y: imgCy + proj.linkOffset.dy }
                } else {
                  const lastRight = imgOffsets[`${id}-img-${proj.images.length - 1}`]
                  if (lastRight) {
                    const lastW = proj.images[proj.images.length - 1].width ?? 320
                    const gapY  = proj.imageLayout ? 50 : ROW_H + 30
                    const linkX = proj.imageLayout ? lastRight.x + lastW - 96 : lastRight.x
                    imgOffsets[`${id}-link`] = { x: linkX, y: lastRight.y + gapY }
                  }
                }
              }
              // BgVideo node: custom offset or right of grid fallback
              if (proj.bgVideo) {
                const bgOff = proj.bgVideoOffset
                imgOffsets[`${id}-bgvideo`] = bgOff
                  ? { x: imgX0 + bgOff.dx, y: imgCy + bgOff.dy }
                  : { x: imgX0 + 2 * COL_W + 60, y: imgCy - 200 }
              }
            }
            // Carousel positions
            const carouselOffsets: Record<string, Pos> = {}
            if (proj.carousels?.length) {
              const CAROUSEL_H   = 335
              const CAROUSEL_GAP = 20
              const n      = proj.carousels.length
              const totalH = n * CAROUSEL_H + (n - 1) * CAROUSEL_GAP
              const carouselX = rx + 420
              const carouselDy = proj.carouselDy ?? 0
              proj.carousels.forEach((_, i) => {
                carouselOffsets[`${id}-carousel-${i}`] = {
                  x: carouselX,
                  y: cy - totalH / 2 + carouselDy + i * (CAROUSEL_H + CAROUSEL_GAP),
                }
              })
            }

            setPositions(p => ({
              ...p,
              [`${id}-text`]:  { x: rx, y: cy - 120 + (proj.textDy ?? 0) },
              ...(proj.appUrl   ? { [`${id}-app`]:   { x: vx, y: cy - 280 } } : {}),
              ...(proj.videoUrl ? { [`${id}-video`]: { x: vx, y: cy - 220 } } : {}),
              // bgVideo fallback when no images
              ...(!proj.images?.length && proj.bgVideo ? {
                [`${id}-bgvideo`]: proj.bgVideoOffset
                  ? { x: rx + 380 + proj.bgVideoOffset.dx, y: cy + proj.bgVideoOffset.dy }
                  : { x: vx, y: cy - 220 },
              } : {}),
              ...imgOffsets,
              ...carouselOffsets,
            }))
          }
        }
      }
    }
  }, [])

  // ── Drag nodo ─────────────────────────────────────────────────────────────
  const dragRef = useRef<{ id: string; offX: number; offY: number; followers: string[]; moved: boolean } | null>(null)
  const suppressNextClick = useRef(false)

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
          ...(proj.appUrl   ? [`${activeId}-app`]    : []),
          ...(proj.videoUrl ? [`${activeId}-video`]  : []),
          ...(proj.linkUrl  ? [`${activeId}-link`]   : []),
          ...(proj.bgVideo  ? [`${activeId}-bgvideo`] : []),
          ...(proj.images?.map((_, i) => `${activeId}-img-${i}`) ?? []),
          ...(proj.carousels?.map((_, i) => `${activeId}-carousel-${i}`) ?? []),
        ]
      }
    }

    dragRef.current = {
      id,
      offX: (e.clientX - x) / scale - pos.x,
      offY: (e.clientY - y) / scale - pos.y,
      followers,
      moved: false,
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
      const v = vpRef.current
      const newScale = Math.min(Math.max(v.scale * factor, ZOOM_MIN), ZOOM_MAX)
      const ratio    = newScale / v.scale
      const next: Vp = {
        x:     e.clientX - (e.clientX - v.x) * ratio,
        y:     e.clientY - (e.clientY - v.y) * ratio,
        scale: newScale,
      }
      // GPU layer: scale is compositor-only → smooth zoom, pixels update after
      if (canvasWorldRef.current) canvasWorldRef.current.style.willChange = 'transform'
      commitVp(next)
      // Sync React state + release GPU layer when zoom settles → browser re-rasterises
      clearTimeout(vpSyncRef.current)
      vpSyncRef.current = setTimeout(() => {
        setVp(vpRef.current)
        if (canvasWorldRef.current) canvasWorldRef.current.style.willChange = 'auto'
      }, 150)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [commitVp])

  // ── Mouse move / up global ────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragRef.current) {
        dragRef.current.moved = true
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
        commitVp({ ...vpRef.current, x: vpX + (e.clientX - startX), y: vpY + (e.clientY - startY) })
      }
    }
    const onUp = () => {
      if (dragRef.current?.moved) suppressNextClick.current = true
      dragRef.current = null
      if (panRef.current) setVp({ ...vpRef.current })  // sync React state when pan ends
      panRef.current = null
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup',   onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup',   onUp)
    }
  }, [commitVp])

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
      return [{ id: `${fromId}→${toId}`, d: `M ${x1},${y1} C ${x1+t},${y1} ${x2-t},${y2} ${x2},${y2}`, color, dimmed: false }]
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
    const imgFb = { w: 320, h: 200 }
    return [
      ...makeSeg(active,  txtId,             pFb,   txtFb),
      ...(proj.appUrl    ? makeSeg(txtId, `${active}-app`,   txtFb, medFb) : []),
      ...(proj.videoUrl  ? makeSeg(txtId, `${active}-video`, txtFb, medFb) : []),
      ...(proj.images?.flatMap((_, i) => makeSeg(txtId, `${active}-img-${i}`, txtFb, imgFb)) ?? []),
      ...(proj.carousels?.flatMap((_, i) => makeSeg(txtId, `${active}-carousel-${i}`, txtFb, { w: 336, h: 335 })) ?? []),
      ...(proj.linkUrl   ? makeSeg(txtId, `${active}-link`,   txtFb, { w: 200, h: 64  }) : []),
      ...(proj.bgVideo   ? makeSeg(txtId, `${active}-bgvideo`, txtFb, { w: 380, h: 240 }) : []),
    ]
  })()

  // ── Bezier edges ──────────────────────────────────────────────────────────
  const activeNode = ui.active ? NODES.find(n => n.id === ui.active) : null

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
    const dimmed = ui.active !== null
      && n.kind === 'project'
      && n.id !== ui.active
      && n.parentId === activeNode?.parentId
    return { id: n.id, d, color, dimmed }
  })

  const allIndicators = computeEdgeIndicators(
    NODES.filter(n => visible(n) && n.kind === 'project'),
    positions, sizes, vp,
    ui.active, activeNode?.parentId,
  )

  const { x: vpX, y: vpY, scale } = vp
  const gridSize   = 28 * scale
  const dotOpacity = Math.min(1, Math.max(0, (scale - 0.4) / 0.2))

  return (
    <div
      className="canvas-root"
      onMouseDown={onCanvasMouseDown}
    >
      <div
        ref={canvasDotsRef}
        className="canvas-dots"
        style={{
          backgroundSize:     `${gridSize}px ${gridSize}px`,
          backgroundPosition: `${vpX}px ${vpY}px`,
          opacity: dotOpacity,
        }}
      />
      <svg
        ref={canvasEdgesRef}
        className="canvas-edges"
        style={{ transform: `translate(${vpX}px,${vpY}px) scale(${scale})` }}
        width="4000" height="4000" viewBox="0 0 4000 4000"
      >
        {/* Glow pass — lit edges */}
        <g style={{ filter: 'blur(6px)' }}>
          {[...edges, ...contentEdges].filter(e => !e.dimmed).map(e => (
            <path key={`${e.id}-glow`} d={e.d} stroke={e.color} strokeWidth="5" fill="none" opacity="0.55" />
          ))}
        </g>
        {/* Glow pass — dimmed edges, neutral grey */}
        <g style={{ filter: 'blur(4px)' }}>
          {[...edges, ...contentEdges].filter(e => e.dimmed).map(e => (
            <path key={`${e.id}-glow`} d={e.d} stroke="var(--text-muted)" strokeWidth="3" fill="none" opacity="0.45" />
          ))}
        </g>
        {/* Sharp line pass */}
        {[...edges, ...contentEdges].map(e => (
          <path key={e.id} d={e.d} stroke={e.dimmed ? 'var(--text-muted)' : e.color} strokeWidth="1.5" fill="none" opacity={e.dimmed ? 0.55 : 0.90} />
        ))}
      </svg>

      {/* Edge indicators — before canvas-world → behind all nodes */}
      {allIndicators.map(ind => {
        const size   = 240 + (ind.seed % 6) * 8          // 240–280px per instance
        const offset = 68 + (ind.seed % 5) * 7           // 68–96px outward (less intrusion)
        const delay  = `${-(ind.seed % 4200) / 1000}s`   // stagger phase 0 to –4.2s
        return (
          <div
            key={`${ind.id}-wrap`}
            style={{
              position:      'absolute',
              left:          ind.side === 'right'  ? window.innerWidth  : ind.side === 'left'   ? 0 : ind.along,
              top:           ind.side === 'bottom' ? window.innerHeight : ind.side === 'top'    ? 0 : ind.along,
              width: 0, height: 0,
              opacity:       ind.show ? 1 : 0,
              transition:    'opacity 0.7s ease',
              pointerEvents: 'none',
            }}
          >
            <div
              className={`edge-indicator ind--${ind.side}`}
              style={{
                '--ind-color':  ind.color,
                '--ind-offset': `${offset}px`,
                '--ind-delay':  delay,
                width:          size,
                height:         size,
                animationDelay: delay,
              } as React.CSSProperties}
            />
          </div>
        )
      })}

      <div
        ref={canvasWorldRef}
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
            return proj.tracks.map((track, i) => (
              <React.Fragment key={i}>
                <ProjectTextNode
                  projectId={id} trackIndex={i}
                  scrollable={track.scrollable}
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

        {ui.active && PROJECTS[ui.active]?.linkUrl && (
          <ProjectLinkNode
            key={`${ui.active}-link`}
            projectId={ui.active}
            pos={positions[`${ui.active}-link`] ?? { x: 0, y: 0 }}
            nodeColor={branchColorOf(ui.active)}
            onMouseDown={e => onNodeMouseDown(e, `${ui.active!}-link`)}
            onSize={(w, h) => handleSize(`${ui.active!}-link`, w, h)}
            onClick={() => {
              if (suppressNextClick.current) { suppressNextClick.current = false; return }
              const url = PROJECTS[ui.active!]?.linkUrl
              if (url) window.open(url, '_blank', 'noopener,noreferrer')
            }}
          />
        )}

        {ui.active && PROJECTS[ui.active]?.bgVideo && (
          <ProjectBgVideoNode
            key={`${ui.active}-bgvideo`}
            projectId={ui.active}
            pos={positions[`${ui.active}-bgvideo`] ?? { x: 0, y: 0 }}
            nodeColor={branchColorOf(ui.active)}
            onMouseDown={e => onNodeMouseDown(e, `${ui.active!}-bgvideo`)}
            onSize={(w, h) => handleSize(`${ui.active!}-bgvideo`, w, h)}
          />
        )}

        {ui.active && PROJECTS[ui.active]?.images?.map((_, i) => {
          const id = ui.active!
          return (
            <ProjectImageNode
              key={`${id}-img-${i}`}
              projectId={id}
              imgIndex={i}
              pos={positions[`${id}-img-${i}`] ?? { x: 0, y: 0 }}
              nodeColor={branchColorOf(id)}
              onMouseDown={e => onNodeMouseDown(e, `${id}-img-${i}`)}
              onSize={(w, h) => handleSize(`${id}-img-${i}`, w, h)}
            />
          )
        })}

        {ui.active && PROJECTS[ui.active]?.carousels?.map((_, i) => {
          const id = ui.active!
          return (
            <ProjectCarouselNode
              key={`${id}-carousel-${i}`}
              projectId={id}
              carouselIndex={i}
              pos={positions[`${id}-carousel-${i}`] ?? { x: 0, y: 0 }}
              nodeColor={branchColorOf(id)}
              onMouseDown={e => onNodeMouseDown(e, `${id}-carousel-${i}`)}
              onSize={(w, h) => handleSize(`${id}-carousel-${i}`, w, h)}
            />
          )
        })}
      </div>

    </div>
  )
}
