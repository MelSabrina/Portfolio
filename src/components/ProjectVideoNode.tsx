import { useCallback } from 'react'
import { PROJECTS } from '../data/projects'

interface Props {
  projectId:   string
  pos:         { x: number; y: number }
  nodeColor:   string
  trackIndex?: number
  onMouseDown: (e: React.MouseEvent) => void
  onSize:      (w: number, h: number) => void
}

export function ProjectVideoNode({ projectId, pos, nodeColor, trackIndex, onMouseDown, onSize }: Props) {
  const project = PROJECTS[projectId]
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el) onSize(el.offsetWidth, el.offsetHeight)
  }, [onSize])

  if (!project) return null

  const isTrack    = trackIndex !== undefined && project.tracks
  const trackData  = isTrack ? project.tracks![trackIndex!] : null
  const videoUrl   = trackData ? trackData.videoUrl   : project.videoUrl
  const posterUrl  = trackData ? trackData.videoPoster : project.videoPoster
  const nodeWidth  = isTrack ? (trackData!.videoWidth ?? 400) : undefined

  if (!videoUrl) return null

  return (
    <div
      ref={ref}
      className={`node node--video${isTrack ? ' node--track' : ''}`}
      style={{ '--node-color': nodeColor, left: pos.x, top: pos.y, position: 'absolute', ...(nodeWidth ? { width: nodeWidth } : {}) } as React.CSSProperties}
      onMouseDown={onMouseDown}
    >
      <div className="node__header">
        <div className="node__dot" />
        <span className="node__label mono">video</span>
      </div>
      <div className="video-node__body">
        <video
          className="video-node__player"
          src={videoUrl}
          poster={posterUrl}
          controls
          playsInline
          preload="metadata"
          onMouseDown={e => e.stopPropagation()}
        />
      </div>
    </div>
  )
}
