import { useCallback, useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../data/projects'

interface Props {
  projectId:   string
  pos:         { x: number; y: number }
  nodeColor:   string
  onMouseDown: (e: React.MouseEvent) => void
  onSize:      (w: number, h: number) => void
}

const IFRAME_INJECT = `(function(){
  /* 1. Hide native cursor */
  var st = document.createElement('style');
  st.textContent = 'html,body,*{cursor:none!important;}';
  document.head.appendChild(st);

  /* 2. Relay mouse position to parent */
  document.addEventListener('mousemove', function(e){
    window.parent.postMessage({type:'visitaps-cursor',x:e.clientX,y:e.clientY},'*');
  }, true);

  /* 3. Override scrollIntoView — redirect to scroll-body.scrollTo to prevent
     cross-frame scroll propagation that pans the portfolio canvas */
  var _siv = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function(arg){
    var sb = document.querySelector('.scroll-body');
    if(sb){
      var sbRect = sb.getBoundingClientRect();
      var elRect = this.getBoundingClientRect();
      var target = elRect.top - sbRect.top + sb.scrollTop - 12;
      var smooth = arg && typeof arg === 'object' && arg.behavior === 'smooth';
      sb.scrollTo({ top: Math.max(0, target), behavior: smooth ? 'smooth' : 'auto' });
    } else {
      _siv.call(this, arg);
    }
  };

  /* 4. preventScroll on focus() */
  var _focus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function(opts){
    return _focus.call(this, Object.assign({preventScroll:true}, opts||{}));
  };

  /* 5. Drag-to-scroll with momentum */
  var startY=null, startTop=0, sb=null, moved=false, lastY=0, lastT=0, vy=0, rafId=null;
  function cancelMomentum(){ if(rafId){ cancelAnimationFrame(rafId); rafId=null; } }
  function momentum(){
    vy*=0.92;
    if(Math.abs(vy)<0.5){ rafId=null; return; }
    if(sb) sb.scrollTop+=vy;
    rafId=requestAnimationFrame(momentum);
  }
  document.addEventListener('mousedown', function(e){
    cancelMomentum();
    window.parent.postMessage({type:'visitaps-mousedown'},'*');
    sb = document.querySelector('.scroll-body');
    if(!sb) return;
    startY=e.clientY; lastY=e.clientY; lastT=Date.now();
    startTop=sb.scrollTop; moved=false; vy=0;
  }, true);
  document.addEventListener('mousemove', function(e){
    if(startY===null||!sb) return;
    var now=Date.now(), dt=now-lastT||1;
    vy=(lastY-e.clientY)/dt*16;
    lastY=e.clientY; lastT=now;
    var d=startY-e.clientY;
    if(Math.abs(d)>4){ moved=true; sb.scrollTop=startTop+d; }
  }, true);
  document.addEventListener('click', function(e){
    if(moved){ e.stopPropagation(); e.preventDefault(); moved=false; }
  }, true);
  document.addEventListener('mouseup', function(){
    startY=null;
    if(moved&&Math.abs(vy)>1) rafId=requestAnimationFrame(momentum);
    window.parent.postMessage({type:'visitaps-mouseup'},'*');
  }, true);
})();`

export function ProjectAppNode({ projectId, pos, nodeColor, onMouseDown, onSize }: Props) {
  const project = PROJECTS[projectId]
  const [interactive, setInteractive] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el) onSize(el.offsetWidth, el.offsetHeight)
  }, [onSize])

  // Relay cursor from inside iframe → portfolio cursor element
  useEffect(() => {
    const cursorEl = document.getElementById('cursor')
    if (!cursorEl) return
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'visitaps-cursor') {
        const iframe = iframeRef.current
        if (!iframe) return
        const rect   = iframe.getBoundingClientRect()
        const scaleX = rect.width  / iframe.offsetWidth
        const scaleY = rect.height / iframe.offsetHeight
        cursorEl.style.left = (rect.left + e.data.x * scaleX) + 'px'
        cursorEl.style.top  = (rect.top  + e.data.y * scaleY) + 'px'
      } else if (e.data?.type === 'visitaps-mousedown') {
        cursorEl.classList.add('pressed')
      } else if (e.data?.type === 'visitaps-mouseup') {
        cursorEl.classList.remove('pressed')
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // When entering interactive mode, flush any stale drag/pan state in portfolio
  useEffect(() => {
    if (interactive) {
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    }
  }, [interactive])

  const onIframeLoad = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument
      if (!doc) return
      const s = doc.createElement('script')
      s.textContent = IFRAME_INJECT
      doc.head.appendChild(s)
    } catch { /* cross-origin guard */ }
  }, [])

  const onEnterLight = useCallback(() => {
    document.getElementById('cursor')?.classList.add('on-light')
  }, [])
  const onLeaveLight = useCallback(() => {
    document.getElementById('cursor')?.classList.remove('on-light')
  }, [])

  if (!project?.appUrl) return null

  return (
    <div
      ref={ref}
      className="node node--app-frame"
      style={{ '--node-color': nodeColor, left: pos.x, top: pos.y, position: 'absolute' } as React.CSSProperties}
      onMouseDown={onMouseDown}
      onMouseEnter={onEnterLight}
      onMouseLeave={onLeaveLight}
    >
      <div className="node__header app-frame__header">
        <div className="node__dot" />
        <span className="node__label mono">demo</span>
        {interactive && (
          <button
            className="app-frame__deactivate mono"
            onMouseDown={e => e.stopPropagation()}
            onClick={() => setInteractive(false)}
          >
            esc
          </button>
        )}
      </div>

      <div className="app-frame__body">
        <iframe
          ref={iframeRef}
          src={project.appUrl}
          title={`${projectId} demo`}
          className="app-frame__iframe"
          style={{ pointerEvents: interactive ? 'auto' : 'none' }}
          onLoad={onIframeLoad}
        />
        {!interactive && (
          <div
            className="app-frame__overlay"
            onClick={() => setInteractive(true)}
          >
            <span className="mono">click to interact</span>
          </div>
        )}
      </div>
    </div>
  )
}
