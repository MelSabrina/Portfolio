import { useCallback } from 'react'
import type { TreeNode } from '../data/tree'

interface Props {
  node:        TreeNode
  pos:         { x: number; y: number }
  lang:        'en' | 'es'
  active:      boolean
  expanded:    boolean
  nodeColor:   string
  onMouseDown: (e: React.MouseEvent) => void
  onClick:     () => void
  onSize:      (w: number, h: number) => void
}

export function PortfolioNode({ node, pos, lang, active, expanded, nodeColor, onMouseDown, onClick, onSize }: Props) {
  const cls = [
    'node',
    `node--${node.kind}`,
    active || expanded ? 'active' : '',
  ].filter(Boolean).join(' ')

  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el) onSize(el.offsetWidth, el.offsetHeight)
  }, [onSize])

  return (
    <div
      ref={ref}
      className={cls}
      style={{ '--node-color': nodeColor, left: pos.x, top: pos.y, position: 'absolute', ...(node.minWidth ? { minWidth: node.minWidth } : {}) } as React.CSSProperties}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <div className="node__header">
        <div className="node__dot" />
        <span className="node__label mono">{node.label[lang]}</span>
      </div>
      <div className="node__title">{node.title[lang]}</div>
    </div>
  )
}
