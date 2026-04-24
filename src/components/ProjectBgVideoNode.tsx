import { useCallback } from 'react'
import { PROJECTS } from '../data/projects'

interface Props {
  projectId:   string
  pos:         { x: number; y: number }
  nodeColor:   string
  onMouseDown: (e: React.MouseEvent) => void
  onSize:      (w: number, h: number) => void
}

export function ProjectBgVideoNode({ projectId, pos, nodeColor, onMouseDown, onSize }: Props) {
  const project = PROJECTS[projectId]
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el) onSize(el.offsetWidth, el.offsetHeight)
  }, [onSize])

  if (!project?.bgVideo) return null

  return (
    <div
      ref={ref}
      className="node node--image"
      style={{ '--node-color': nodeColor, left: pos.x, top: pos.y, position: 'absolute', width: 380 } as React.CSSProperties}
      onMouseDown={onMouseDown}
    >
      <video
        src={project.bgVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{ display: 'block', width: '100%', height: 'auto', pointerEvents: 'none' }}
        onMouseDown={e => e.stopPropagation()}
      />
    </div>
  )
}
