import { useCallback, useRef } from 'react'
import { PROJECTS } from '../data/projects'

interface Props {
  projectId:   string
  imgIndex:    number
  pos:         { x: number; y: number }
  nodeColor:   string
  onMouseDown: (e: React.MouseEvent) => void
  onSize:      (w: number, h: number) => void
}

function imgHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function ProjectImageNode({ projectId, imgIndex, pos, nodeColor, onMouseDown, onSize }: Props) {
  const project = PROJECTS[projectId]
  const nodeRef = useRef<HTMLDivElement>(null)
  const ref = useCallback((el: HTMLDivElement | null) => {
    (nodeRef as React.MutableRefObject<HTMLDivElement | null>).current = el
    if (el) onSize(el.offsetWidth, el.offsetHeight)
  }, [onSize])

  const handleLoad = useCallback(() => {
    const el = nodeRef.current
    if (el) onSize(el.offsetWidth, el.offsetHeight)
  }, [onSize])

  if (!project?.images?.[imgIndex]) return null
  const img = project.images[imgIndex]

  const seed   = imgHash(`${projectId}-img-${imgIndex}`)
  const rotate = ((seed % 28) - 14) / 10  // −1.4° to +1.4°

  return (
    <div
      ref={ref}
      className="node node--image"
      style={{
        '--node-color': nodeColor,
        left:           pos.x,
        top:            pos.y,
        position:       'absolute',
        width:          img.width ?? 320,
        transform:      `rotate(${rotate}deg)`,
        transformOrigin: 'center center',
      } as React.CSSProperties}
      onMouseDown={onMouseDown}
    >
      <img src={img.url} alt="" draggable={false} decoding="async" loading="eager" onLoad={handleLoad} />
    </div>
  )
}
