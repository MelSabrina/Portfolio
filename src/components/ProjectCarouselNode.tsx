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

  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el) onSize(el.offsetWidth, el.offsetHeight)
  }, [onSize])

  const swipeRef = useRef<{ startX: number } | null>(null)

  const handleImgMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    swipeRef.current = { startX: e.clientX }
    const onUp = (ue: MouseEvent) => {
      if (swipeRef.current) {
        const dx = ue.clientX - swipeRef.current.startX
        if (Math.abs(dx) > 40) {
          setCurrent(c =>
            dx < 0
              ? Math.min(c + 1, carousel!.images.length - 1)
              : Math.max(c - 1, 0)
          )
        }
        swipeRef.current = null
      }
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mouseup', onUp)
  }, [carousel])

  if (!carousel) return null

  const total  = carousel.images.length
  const width  = carousel.width ?? 280
  const height = carousel.height ?? Math.round(width * 0.75)

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
        className="carousel__image-wrap"
        style={{
          height,
          backgroundImage: `url(${carousel.images[current]})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        onMouseDown={handleImgMouseDown}
      />
      <div className="carousel__nav">
        <button
          className="carousel__btn mono"
          onClick={e => { e.stopPropagation(); setCurrent(c => Math.max(0, c - 1)) }}
          disabled={current === 0}
        >←</button>
        <span className="carousel__counter mono">{current + 1} / {total}</span>
        <button
          className="carousel__btn mono"
          onClick={e => { e.stopPropagation(); setCurrent(c => Math.min(total - 1, c + 1)) }}
          disabled={current === total - 1}
        >→</button>
      </div>
    </div>
  )
}
