import { useCallback } from 'react'
import { PROJECTS } from '../data/projects'

interface Props {
  projectId:    string
  pos:          { x: number; y: number }
  lang:         'en' | 'es'
  nodeColor:    string
  trackIndex?:  number
  onMouseDown:  (e: React.MouseEvent) => void
  onSize:       (w: number, h: number) => void
}

export function ProjectTextNode({ projectId, pos, lang, nodeColor, trackIndex, onMouseDown, onSize }: Props) {
  const project = PROJECTS[projectId]
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el) onSize(el.offsetWidth, el.offsetHeight)
  }, [onSize])

  if (!project) return null

  const isMultiTrack = trackIndex !== undefined && project.tracks
  const track        = isMultiTrack ? project.tracks![trackIndex!] : null
  const heading      = track ? track : project
  const desc         = track ? track.description[lang] : project.description?.[lang] ?? ''
  const paragraphs   = desc.split('\n\n')
  const showMeta     = !isMultiTrack || trackIndex === 0

  return (
    <div
      ref={ref}
      className={`node node--text-content${isMultiTrack ? ' node--track' : ''}`}
      style={{ '--node-color': nodeColor, left: pos.x, top: pos.y, position: 'absolute' } as React.CSSProperties}
      onMouseDown={onMouseDown}
    >
      <div className="node__header">
        <div className="node__dot" />
        <span className="node__label mono">
          {lang === 'en' ? 'project overview' : 'descripción'}
        </span>
      </div>

      <div className="text-content__body">
        {heading.headingBold && (
          <div className="text-content__heading">
            <span className="text-content__heading-bold">{heading.headingBold}</span>
            {heading.headingLight && (
              <span className="text-content__heading-light">{heading.headingLight}</span>
            )}
          </div>
        )}
        {paragraphs.map((p, i) => (
          <p key={i} className="text-content__para">{p}</p>
        ))}

        {showMeta && <>
          <div className="text-content__divider" />
          <div className="text-content__tags">
            {project.tech.map(t => (
              <span key={t} className="text-content__tag mono">{t}</span>
            ))}
          </div>
          <div className="text-content__role mono">
            {project.role[lang].join(' · ')}
          </div>
        </>}
      </div>
    </div>
  )
}
