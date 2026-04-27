import { useState, useCallback, useRef } from 'react'

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string

interface Props {
  pos:         { x: number; y: number }
  lang:        'en' | 'es'
  width:       number
  onMouseDown: (e: React.MouseEvent) => void
  onSize:      (w: number, h: number) => void
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

const copy = {
  label:       { en: 'contact',       es: 'contacto' },
  name:        { en: 'name',          es: 'nombre' },
  email:       { en: 'email',         es: 'email' },
  message:     { en: 'message',       es: 'mensaje' },
  send:        { en: 'send',          es: 'enviar' },
  sending:     { en: 'sending…',      es: 'enviando…' },
  sent:        { en: 'message sent ✓', es: 'mensaje enviado ✓' },
  error:       { en: 'something went wrong', es: 'algo salió mal' },
}

export function ContactNode({ pos, lang, width, onMouseDown, onSize }: Props) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [status,  setStatus]  = useState<Status>('idle')

  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el) onSize(el.offsetWidth, el.offsetHeight)
  }, [onSize])

  const stopProp = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  const t = (k: keyof typeof copy) => copy[k][lang]

  return (
    <div
      ref={ref}
      className="node node--contact"
      style={{ left: pos.x, top: pos.y, position: 'absolute', width }}
      onMouseDown={onMouseDown}
    >
      <div className="node__header">
        <div className="node__dot" />
        <span className="node__label mono">{t('label')}</span>
      </div>

      {status === 'sent' ? (
        <div className="contact__sent mono">{t('sent')}</div>
      ) : (
        <form className="contact__form" onSubmit={handleSubmit}>
          <input
            className="contact__input mono"
            type="text"
            placeholder={t('name')}
            value={name}
            onChange={e => setName(e.target.value)}
            onMouseDown={stopProp}
            disabled={status === 'sending'}
            autoComplete="off"
          />
          <input
            className="contact__input mono"
            type="email"
            placeholder={t('email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            onMouseDown={stopProp}
            disabled={status === 'sending'}
            autoComplete="off"
          />
          <textarea
            className="contact__textarea mono"
            placeholder={t('message')}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onMouseDown={stopProp}
            onWheel={e => e.stopPropagation()}
            disabled={status === 'sending'}
            rows={4}
          />
          {status === 'error' && (
            <span className="contact__error mono">{t('error')}</span>
          )}
          <button
            className="contact__btn mono"
            type="submit"
            onMouseDown={stopProp}
            disabled={status === 'sending' || !name.trim() || !email.trim() || !message.trim()}
          >
            {status === 'sending' ? t('sending') : t('send')}
          </button>
        </form>
      )}
    </div>
  )
}
