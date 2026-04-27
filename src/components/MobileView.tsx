import { useState, useCallback } from 'react'
import meImg from '../assets/pictures/me.png'
import { NODES } from '../data/tree'
import { PROJECTS, ProjectData } from '../data/projects'

interface Props {
  lang:          'en' | 'es'
  theme:         'dark' | 'light'
  onToggleLang:  () => void
  onToggleTheme: () => void
}

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string

type Status = 'idle' | 'sending' | 'sent' | 'error'

const contactCopy = {
  label:   { en: 'contact',          es: 'contacto' },
  name:    { en: 'name',             es: 'nombre' },
  email:   { en: 'email',            es: 'email' },
  message: { en: 'message',          es: 'mensaje' },
  send:    { en: 'send',             es: 'enviar' },
  sending: { en: 'sending…',         es: 'enviando…' },
  sent:    { en: 'message sent ✓',   es: 'mensaje enviado ✓' },
  error:   { en: 'something went wrong', es: 'algo salió mal' },
}

function MobileContact({ lang }: { lang: 'en' | 'es' }) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [status,  setStatus]  = useState<Status>('idle')

  const t = (k: keyof typeof contactCopy) => contactCopy[k][lang]

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setStatus('sending')
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        mode:   'no-cors',
        body:   new URLSearchParams({ name, email, message }),
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }, [name, email, message])

  return (
    <div className="mob-contact">
      <div className="mob-divider" />
      <div className="mob-contact-header mono">{t('label')}</div>
      {status === 'sent' ? (
        <p className="mob-contact-sent mono">{t('sent')}</p>
      ) : (
        <form className="mob-contact-form" onSubmit={handleSubmit}>
          <input
            className="mob-contact-input mono"
            type="text"
            placeholder={t('name')}
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={status === 'sending'}
            autoComplete="off"
          />
          <input
            className="mob-contact-input mono"
            type="email"
            placeholder={t('email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={status === 'sending'}
            autoComplete="off"
          />
          <textarea
            className="mob-contact-input mob-contact-textarea mono"
            placeholder={t('message')}
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={status === 'sending'}
            rows={4}
          />
          {status === 'error' && <span className="mob-contact-error mono">{t('error')}</span>}
          <button
            className="mob-contact-btn mono"
            type="submit"
            disabled={status === 'sending' || !name.trim() || !email.trim() || !message.trim()}
          >
            {status === 'sending' ? t('sending') : t('send')}
          </button>
        </form>
      )}
    </div>
  )
}

const bio = {
  en: `I work at the intersection of institutional communication, functional interfaces, and artificial intelligence. I started in editorial and identity design for public health — and ended up building the apps I used to only design. Today I integrate AI as a real part of the process: local models, data pipelines, agents. Not as a feature — as a way of working.`,
  es: `Trabajo en la intersección entre comunicación institucional, interfaces funcionales e inteligencia artificial. Empecé en diseño editorial y de identidad para salud pública — y terminé construyendo las apps que antes solo diseñaba. Hoy integro IA como parte real del proceso: modelos locales, pipelines de datos, agentes. No como feature, como forma de trabajar.`,
}

const edu = {
  en: [
    { name: 'Data Science & AI',       detail: 'ITFS N°11 · in progress' },
    { name: 'Graphic & Digital Design', detail: 'Nueva Escuela' },
    { name: 'Philosophy',               detail: 'UBA' },
  ],
  es: [
    { name: 'Ciencia de Datos e IA',    detail: 'ITFS N°11 · en curso' },
    { name: 'Diseño gráfico y digital', detail: 'Nueva Escuela' },
    { name: 'Filosofía',                detail: 'UBA' },
  ],
}

function getProjectImages(proj: ProjectData): string[] {
  if (proj.images?.length)    return proj.images.map(i => i.url)
  if (proj.carousels?.length) return proj.carousels.flatMap(c => c.images.slice(0, 2))
  if (proj.tracks?.length)    return proj.tracks.map(t => t.videoPoster).filter((p): p is string => !!p)
  return []
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2"  x2="12" y2="5"/>   <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/> <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
      <line x1="2"  y1="12" x2="5"  y2="12"/>  <line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/> <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12" rx="0.5"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.09.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.479C19.138 20.165 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  )
}

function BehanceIcon() {
  return (
    <svg width="16" height="16" viewBox="250 600 2050 1300" fill="currentColor">
      <path d="M883.1,683.6c53.9,0,103.1,4.8,147.6,14.3s82.5,25.1,114.2,46.8,56.3,50.5,73.8,86.5,26.2,80.4,26.2,133.3c0,57.1-13,104.7-38.9,142.8s-64.3,69.3-115,93.6c69.8,20.1,121.9,55.3,156.3,105.5s51.6,110.8,51.6,181.7c0,57.1-11.1,106.6-33.3,148.4s-52.1,75.9-89.7,102.3c-37.6,26.5-80.4,46-128.5,58.7-48.4,12.7-98.3,19.1-148.3,19H350V683.6h533.1ZM851.4,1142.1c44.4,0,80.9-10.6,109.5-31.7,28.6-21.2,42.9-55.5,42.8-103.1,0-26.4-4.8-48.1-14.3-65s-22.2-30.2-38.1-39.7c-15.9-9.5-34.1-16.1-54.7-19.8-21.2-3.7-42.7-5.6-64.3-5.5h-233.1v265l252.2-.2h0ZM865.7,1622.8c23.5.1,46.9-2.3,69.8-7.1,22.2-4.8,41.8-12.7,58.7-23.8,16.9-11.1,30.4-26.2,40.5-45.2,10-19,15.1-43.4,15.1-73,0-58.1-16.4-99.7-49.2-124.5-32.8-24.9-76.2-37.3-130.1-37.3h-271.3v311l266.5-.1h0ZM1612.3,1599c33.8,32.8,82.5,49.2,146,49.2,45.5,0,84.6-11.4,117.4-34.1s52.9-46.8,60.3-72.2h198.3c-31.7,98.4-80.4,168.7-146,211-65.6,42.3-144.9,63.5-238,63.5-64.5,0-122.7-10.3-174.5-30.9s-95.7-50-131.7-88.1-63.8-83.5-83.3-136.4-29.3-111.1-29.3-174.5,10-118.4,30.1-171.3,48.7-98.6,85.7-137.2,81.2-69,132.5-91.2,108.2-33.3,170.6-33.3c69.8,0,130.6,13.5,182.5,40.5,51.8,27,94.4,63.2,127.7,108.7,33.3,45.5,57.4,97.3,72.2,155.5s20.1,119,15.9,182.5h-591.8c3.1,72.7,21.6,125.6,55.4,158.3h0ZM1867,1167.5c-27-29.6-68-44.4-123-44.4-36,0-65.9,6.1-89.6,18.2-23.8,12.2-42.8,27.2-57.1,45.2-14.3,18-24.3,37-30.1,57.1-5.8,20.1-9.3,38.1-10.3,53.9h366.5c-10.7-57-29.5-100.4-56.4-130h0ZM1518.3,741.1h457.9v127h-457.9v-127Z"/>
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l4 4 4-4"/>
    </svg>
  )
}

interface InlineDetailProps {
  proj:  ProjectData
  lang:  'en' | 'es'
  color: string
}

function MobileProjectInline({ proj, lang, color }: InlineDetailProps) {
  const images = getProjectImages(proj)

  const desc = proj.tracks
    ? proj.tracks.map(t => t.description[lang]).join('\n\n───\n\n')
    : proj.description?.[lang] ?? ''

  return (
    <div className="mob-project-detail" style={{ '--branch-color': color } as React.CSSProperties}>
      {images.length > 0 && (
        <div className="mob-project-gallery">
          {images.map((url, i) => (
            <img key={i} src={url} alt="" className="mob-gallery-img" draggable={false} />
          ))}
        </div>
      )}
      {desc && <p className="mob-project-desc">{desc}</p>}
      <div className="mob-project-tags">
        {proj.tech.map(t => <span key={t} className="mob-project-tag mono">{t}</span>)}
      </div>
      <div className="mob-project-role mono">{proj.role[lang].join(' · ')}</div>
      {(proj.appUrl || proj.linkUrl) && (
        <div className="mob-project-actions">
          {proj.appUrl && (
            <a href={proj.appUrl} className="mob-action-btn mob-action-btn--primary mono" target="_blank" rel="noopener noreferrer">
              {lang === 'en' ? 'Open demo' : 'Abrir demo'}
            </a>
          )}
          {proj.linkUrl && (
            <a href={proj.linkUrl} className="mob-action-btn mob-action-btn--secondary mono" target="_blank" rel="noopener noreferrer">
              {proj.linkLabel?.[lang] ?? (lang === 'en' ? 'View link' : 'Ver enlace')}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export function MobileView({ lang, theme, onToggleLang, onToggleTheme }: Props) {
  const [openBranch,  setOpenBranch]  = useState<string | null>(null)
  const [openProject, setOpenProject] = useState<string | null>(null)

  const branches = NODES.filter(n => n.kind === 'branch')

  return (
    <div className="mob-root">
      <div className="mob-topbar">
        <button className="mob-ctrl-btn mono" onClick={onToggleLang}>
          {lang === 'en' ? 'ES' : 'EN'}
        </button>
        <button className="mob-ctrl-btn mob-ctrl-icon" onClick={onToggleTheme}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <div className="mob-scroll">
        {/* Profile card */}
        <div className="mob-profile">
          <div className="mob-avatar">
            <img src={meImg} alt="" draggable={false} />
          </div>
          <h1 className="mob-name">Mel S. Pesce Ortiz</h1>
          <p className="mob-role mono">
            System Designer<span style={{ opacity: 0.4 }}> · </span>Buenos Aires
          </p>
          <div className="mob-divider" />
          <p className="mob-bio">{bio[lang]}</p>
          <div className="mob-divider" />
          <ul className="mob-edu">
            {edu[lang].map(({ name, detail }) => (
              <li key={name}>
                <span className="mob-edu-name">{name}</span>
                <span className="mob-edu-detail"> — {detail}</span>
              </li>
            ))}
          </ul>
          <div className="mob-divider" />
          <div className="mob-links">
            <a href="mailto:mpesceortiz@gmail.com" className="mob-link" target="_blank" rel="noopener noreferrer"><EmailIcon /></a>
            <a href="https://www.linkedin.com/in/melsabrina/" className="mob-link" target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a>
            <a href="https://github.com/MelSabrina" className="mob-link" target="_blank" rel="noopener noreferrer"><GitHubIcon /></a>
            <a href="https://www.behance.net/MelSabrina" className="mob-link" target="_blank" rel="noopener noreferrer"><BehanceIcon /></a>
          </div>
        </div>

        {/* Branch accordion */}
        <div className="mob-branches">
          {branches.map(branch => {
            const color      = `var(${branch.branchColor})`
            const isBranchOpen = openBranch === branch.id
            const projects   = NODES.filter(n => n.kind === 'project' && n.parentId === branch.id)

            return (
              <div key={branch.id} className="mob-branch-wrap">
                <button
                  className="mob-branch-card"
                  style={{ '--branch-color': color } as React.CSSProperties}
                  onClick={() => {
                    setOpenBranch(isBranchOpen ? null : branch.id)
                    setOpenProject(null)
                  }}
                >
                  <div className="mob-branch-cable" />
                  <div className="mob-branch-content">
                    <div className="mob-branch-header">
                      <span className="mob-branch-dot" />
                      <span className="mob-branch-label mono">{branch.label[lang]}</span>
                    </div>
                    <div className="mob-branch-title">{branch.title[lang]}</div>
                  </div>
                  <div className={`mob-branch-chevron${isBranchOpen ? ' mob-branch-chevron--open' : ''}`}>
                    <ChevronIcon />
                  </div>
                </button>

                {isBranchOpen && (
                  <div className="mob-projects">
                    {projects.map(proj => {
                      const hasContent  = !!PROJECTS[proj.id]
                      const projData    = PROJECTS[proj.id]
                      const isProjOpen  = openProject === proj.id

                      return (
                        <div key={proj.id} className="mob-project-wrap">
                          <button
                            className={`mob-project-card${!hasContent ? ' mob-project-card--empty' : ''}${isProjOpen ? ' mob-project-card--open' : ''}`}
                            style={{ '--branch-color': color } as React.CSSProperties}
                            onClick={() => hasContent && setOpenProject(isProjOpen ? null : proj.id)}
                            disabled={!hasContent}
                          >
                            <div className="mob-project-info">
                              <span className="mob-project-label mono">{proj.label[lang]}</span>
                              <span className="mob-project-title">{proj.title[lang]}</span>
                            </div>
                            {hasContent && (
                              <div className={`mob-project-chevron${isProjOpen ? ' mob-project-chevron--open' : ''}`}>
                                <ChevronIcon />
                              </div>
                            )}
                          </button>

                          {isProjOpen && projData && (
                            <MobileProjectInline proj={projData} lang={lang} color={color} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <MobileContact lang={lang} />
      </div>
    </div>
  )
}
