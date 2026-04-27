import { useState, useRef, useCallback } from 'react'
import { PROJECTS } from '../data/projects'

interface Props {
  projectId:     string
  carouselIndex: number
  pos:           { x: number; y: number }
  nodeColor:     string
  onMouseDown:   (e: React.MouseEvent) => void
  onSize:        (w: number, h: number) => void
}

export function ProjectCarouselNode({ projectId, carouselIndex, pos, nodeColor, onMouseDown, onSize }: Props) {
  const project  = PROJECTS[projectId]
  const carousel = project?.carousels?.[carouselIndex]
  const [current, setCurrent] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef  = useRef<{ startX: number; startCurrent: number } | null>(null)

  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el) onSize(el.offsetWidth, el.offsetHeight)
  }, [onSize])

  const total  = carousel?.images.length ?? 0
  const width  = carousel?.width  ?? 280
  const height = carousel?.height ?? Math.round(width * 0.75)

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(total - 1, index))
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.28s ease'
      trackRef.current.style.transform  = `translateX(${-clamped * width}px)`
    }
    setCurrent(clamped)
  }, [total, width])

  const handleImgMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (!trackRef.current) return
    trackRef.current.style.transition = 'none'
    dragRef.current = { startX: e.clientX, startCurrent: current }

    const onMove = (me: MouseEvent) => {
      if (!dragRef.current || !trackRef.current) return
      const dx   = me.clientX - dragRef.current.startX
      const base = -dragRef.current.startCurrent * width
      // clamp so you can't drag past first/last
      const clamped = Math.max(-((total - 1) * width), Math.min(0, base + dx))
      trackRef.current.style.transform = `translateX(${clamped}px)`
    }

    const onUp = (ue: MouseEvent) => {
      if (!dragRef.current) return
      const dx           = ue.clientX - dragRef.current.startX
      const startCurrent = dragRef.current.startCurrent
      dragRef.current    = null
      let next = startCurrent
      if (dx < -40) next = Math.min(startCurrent + 1, total - 1)
      else if (dx > 40) next = Math.max(startCurrent - 1, 0)
      goTo(next)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [current, width, total, goTo])

  if (!carousel) return null

  return (
    <div
      ref={ref}
      className="node node--carousel"
      style={{ '--node-color': nodeColor, left: pos.x, top: pos.y, position: 'absolute', width } as React.CSSProperties}
      onMouseDown={onMouseDown}
    >
      <div className="node__header">
        <div className="node__dot" />
        <span className="node__label mono">{carousel.label ?? 'images'}</span>
      </div>

      <div
        className="carousel__viewport"
        style={{ width, height, overflow: 'hidden' }}
        onMouseDown={handleImgMouseDown}
      >
        <div
          ref={trackRef}
          className="carousel__track"
          style={{
            display:   'flex',
            width:     total * width,
            transform: `translateX(${-current * width}px)`,
            willChange: 'transform',
          }}
        >
          {carousel.images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              draggable={false}
              decoding="async"
              loading={i <= 1 ? 'eager' : 'lazy'}
              style={{
                width,
                height,
                objectFit:  'contain',
                flexShrink: 0,
                background: 'var(--node-bg)',
                display:    'block',
              }}
            />
          ))}
        </div>
      </div>

      <div className="carousel__nav">
        <button
          className="carousel__btn mono"
          onClick={e => { e.stopPropagation(); goTo(current - 1) }}
          disabled={current === 0}
        >←</button>
        <span className="carousel__counter mono">{current + 1} / {total}</span>
        <button
          className="carousel__btn mono"
          onClick={e => { e.stopPropagation(); goTo(current + 1) }}
          disabled={current === total - 1}
        >→</button>
      </div>
    </div>
  )
}
