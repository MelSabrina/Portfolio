import { useCallback } from 'react'
import meImg from '../assets/pictures/me.png'

interface Props {
  pos:         { x: number; y: number }
  lang:        'en' | 'es'
  onMouseDown: (e: React.MouseEvent) => void
  onSize:      (w: number, h: number) => void
}

const bio = {
  en: `I work at the intersection of institutional communication, functional interfaces, and artificial intelligence. I started in editorial and identity design for public health — and ended up building the apps I used to only design. Today I integrate AI as a real part of the process: local models, data pipelines, agents. Not as a feature — as a way of working.`,
  es: `Trabajo en la intersección entre comunicación institucional, interfaces funcionales e inteligencia artificial. Empecé en diseño editorial y de identidad para salud pública — y terminé construyendo las apps que antes solo diseñaba. Hoy integro IA como parte real del proceso: modelos locales, pipelines de datos, agentes. No como feature, como forma de trabajar.`,
}

const edu = {
  en: [
    { name: 'Data Science & AI',           detail: 'ITFS N°11 · in progress' },
    { name: 'Graphic & Digital Design',     detail: 'Nueva Escuela' },
    { name: 'Philosophy',                   detail: 'UBA' },
  ],
  es: [
    { name: 'Ciencia de Datos e IA',        detail: 'ITFS N°11 · en curso' },
    { name: 'Diseño gráfico y digital',     detail: 'Nueva Escuela' },
    { name: 'Filosofía',                    detail: 'UBA' },
  ],
}

const stopDrag = (e: React.MouseEvent) => e.stopPropagation()

function EmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-10 7L2 7"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12" rx="0.5"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.09.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.479C19.138 20.165 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  )
}

export function RootNode({ pos, lang, onMouseDown, onSize }: Props) {
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el) onSize(el.offsetWidth, el.offsetHeight)
  }, [onSize])

  return (
    <div
      ref={ref}
      className="node node--root"
      style={{ left: pos.x, top: pos.y, position: 'absolute' } as React.CSSProperties}
      onMouseDown={onMouseDown}
    >
      <div className="root__avatar">
        <img src={meImg} alt="" draggable={false} />
      </div>

      <div className="root__name">Mel S. Pesce Ortiz</div>
      <div className="root__role mono">
        System Designer<span className="root__sep"> · </span>
        <span className="root__location">Buenos Aires</span>
      </div>

      <div className="root__divider" />

      <p className="root__bio">{bio[lang]}</p>

      <div className="root__divider" />

      <ul className="root__edu">
        {edu[lang].map(({ name, detail }) => (
          <li key={name}>
            <span className="root__edu-name">{name}</span>
            <span className="root__edu-detail"> — {detail}</span>
          </li>
        ))}
      </ul>

      <div className="root__divider" />

      <div className="root__links">
        <a
          href="mailto:mpesceortiz@gmail.com"
          className="root__link" title="Email"
          onMouseDown={stopDrag}
          target="_blank" rel="noopener noreferrer"
        >
          <EmailIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/melsabrina/"
          className="root__link" title="LinkedIn"
          onMouseDown={stopDrag}
          target="_blank" rel="noopener noreferrer"
        >
          <LinkedInIcon />
        </a>
        <a
          href="https://github.com/MelSabrina"
          className="root__link" title="GitHub"
          onMouseDown={stopDrag}
          target="_blank" rel="noopener noreferrer"
        >
          <GitHubIcon />
        </a>
      </div>
    </div>
  )
}
