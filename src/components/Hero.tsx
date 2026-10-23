import { AnimatePresence, motion, useInView } from 'framer-motion'
import { ArrowRight, CheckCircle2, Download, Github, Linkedin, Loader2, Mail, MapPin, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { heroStats, profile } from '../data/profile'
import { ease } from './motion'
import { Corners, Counter, Magnetic } from './ui'

/** Pixel grid where cells glow in drifting waves, in the current accent color. */
function PixelField() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const S = 12 // cell pitch
    let w = 0, h = 0, raf = 0, last = 0
    const mouse = { x: -1e3, y: -1e3 }
    const resize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const color = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim().split(' ').join(',')
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (t - last < 40) return // ~25fps is plenty for this effect
      last = t
      const c = color()
      ctx.clearRect(0, 0, w, h)
      const time = t / 1400
      for (let x = 0; x < w; x += S) {
        for (let y = 0; y < h; y += S) {
          const v = Math.sin(x * 0.012 + time) + Math.sin(y * 0.018 - time * 0.8) + Math.sin((x + y) * 0.006 + time * 0.6)
          const d = Math.hypot(x - mouse.x, y - mouse.y)
          const boost = d < 140 ? (1 - d / 140) * 0.55 : 0
          const a = Math.max(0, (v - 1.2) / 1.8) * 0.5 + boost
          if (a < 0.03) continue
          ctx.fillStyle = `rgba(${c},${a.toFixed(3)})`
          ctx.fillRect(x, y, S - 3, S - 3)
        }
      }
    }
    const onMove = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top }
    resize()
    if (reduce) draw(1e4); else raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
}

const json = `{
  "name": "Neetpal Singh",
  "role": "AI Engineer",
  "company": "Ascent Business Technology",
  "location": "Gurugram, India",
  "experience_years": 2,
  "builds": [
    "Multi-tenant AI agent platform (Agent Studio)",
    "Custom MCP server · 350+ REST tools",
    "Multi-agent GRC & BCM automation",
    "Hybrid RAG · vector + graph + lexical",
    "Async workers & provider-agnostic LLM routing",
    "Domain LLM fine-tuning (LoRA / QLoRA)"
  ],
  "stack": {
    "ai": ["LangGraph", "LangChain", "MCP", "OpenAI", "Claude", "Gemini"],
    "backend": ["Python", "FastAPI", "RabbitMQ", "Redis", "Docker"],
    "data": ["MongoDB", "PostgreSQL", "Milvus", "Qdrant", "Neo4j"]
  },
  "open_to_work": true
}`
const lineCount = json.split('\n').length

type Phase = 'idle' | 'sending' | 'success' | 'streaming' | 'done'

/** Tint keys, strings, numbers and booleans in a (possibly partial) JSON string. */
function highlight(src: string) {
  return src
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/("[^"]*")(\s*:)/g, '<span class="text-fg">$1</span>$2')
    .replace(/:\s*(true|false|\d+)(?=[,\n]|$)/g, ': <span class="hl">$1</span>')
    .replace(/(\[|,|\n)(\s*)("[^"]*")/g, '$1$2<span class="hl">$3</span>')
}

/** Simulated API call: request → loading → 200 OK → streamed JSON response, on a loop. */
function ApiCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [phase, setPhase] = useState<Phase>('idle')
  const [n, setN] = useState(0)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (!inView) return
    setPhase('idle'); setN(0)
    const timers = [
      setTimeout(() => setPhase('sending'), 500),
      setTimeout(() => setPhase('success'), 1900),
      setTimeout(() => setPhase('streaming'), 2700),
    ]
    return () => timers.forEach(clearTimeout)
  }, [inView, run])

  useEffect(() => {
    if (phase !== 'streaming') return
    const t = setInterval(() => setN((v) => {
      if (v >= json.length) { clearInterval(t); setPhase('done'); return v }
      return v + 4
    }), 16)
    return () => clearInterval(t)
  }, [phase])

  // Replay the whole call a few seconds after the response finishes
  useEffect(() => {
    if (phase !== 'done') return
    const t = setTimeout(() => setRun((r) => r + 1), 7000)
    return () => clearTimeout(t)
  }, [phase])

  const ok = phase === 'success' || phase === 'streaming' || phase === 'done'
  return (
    <div ref={ref} className="card overflow-hidden text-left shadow-[0_24px_60px_-30px_rgb(0_0_0/.25)]">
      {/* Request bar */}
      <div className="flex items-center gap-2 border-b border-line p-2.5">
        <span className="rounded-md bg-accent/10 px-2 py-1 font-mono text-[11px] font-semibold text-accent dark:bg-white/10 dark:text-fg">GET</span>
        <span className="flex-1 truncate rounded-md border border-line bg-bg px-3 py-1.5 font-mono text-[12px] text-fg">
          /api/v1/engineers/<span className="hl">neetpal-singh</span>
        </span>
        <motion.button
          onClick={() => setRun((r) => r + 1)}
          animate={phase === 'sending' ? { scale: [1, 0.94, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="btn-primary !gap-1.5 !px-3 !py-1.5 !text-[12px]"
          aria-label="Send request"
        >
          {phase === 'sending' ? <Loader2 size={13} className="animate-spin" /> : <Send size={12} />}
          {phase === 'sending' ? 'Sending' : 'Send'}
        </motion.button>
      </div>

      {/* Progress line */}
      <div className="relative h-[2px] overflow-hidden bg-line">
        <AnimatePresence>
          {phase === 'sending' && (
            <motion.span
              className="absolute inset-y-0 left-0 bg-accent"
              initial={{ width: '0%' }}
              animate={{ width: '92%' }}
              exit={{ width: '100%', opacity: 0 }}
              transition={{ duration: 1.3, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-2 font-mono text-[11px] text-muted">
        <span className="text-fg">Response</span>
        <span className="hidden sm:inline">Headers (8)</span>
        <span className="ml-auto flex items-center gap-3">
          <AnimatePresence mode="wait">
            {ok ? (
              <motion.span key="ok" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} className="flex items-center gap-1.5 rounded bg-accent/10 px-1.5 py-0.5 text-accent dark:bg-white/10 dark:text-fg">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> 200 OK
              </motion.span>
            ) : (
              <motion.span key="wait" exit={{ opacity: 0 }}>{phase === 'sending' ? 'pending…' : 'ready'}</motion.span>
            )}
          </AnimatePresence>
          {ok && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>128 ms · 1.2 KB</motion.span>}
        </span>
      </div>

      {/* Body */}
      <div className="relative">
        <AnimatePresence>
          {phase === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-1/2 top-6 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-[13px] shadow-lg"
            >
              <CheckCircle2 size={16} className="text-accent" /> Profile fetched successfully
            </motion.div>
          )}
        </AnimatePresence>
        {phase === 'sending' && (
          <div className="absolute inset-x-5 top-5 space-y-2.5">
            {[70, 45, 85, 60, 35].map((w, i) => (
              <motion.div key={i} className="h-3 rounded bg-line" style={{ width: `${w}%` }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.1 }} />
            ))}
          </div>
        )}
        <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-[1.7] text-muted" style={{ minHeight: `calc(${lineCount} * 1.7em + 2.5rem)` }}>
          <code dangerouslySetInnerHTML={{ __html: highlight(json.slice(0, n)) }} />
          {phase === 'streaming' && <span className="inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-accent" />}
        </pre>
      </div>
    </div>
  )
}

export default function Hero() {
  const item = {
    hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
  }
  return (
    <section id="top" className="section overflow-hidden pt-28">
      <div className="absolute inset-0 mask-fade-b opacity-80"><PixelField /></div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_55%_45%_at_50%_42%,rgb(var(--bg))_35%,transparent_100%)]" />

      <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.1 }} className="relative px-4 pb-16 pt-10 text-center sm:px-10 md:pt-16">
        <motion.div variants={item} className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11.5px] uppercase tracking-wide text-muted">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Open to AI engineering roles
        </motion.div>
        <motion.h1 variants={item} className="text-[3.2rem] font-semibold leading-none tracking-[-0.05em] sm:text-7xl lg:text-[6.2rem]">
          {profile.name}
        </motion.h1>
        <motion.p variants={item} className="mx-auto mt-5 max-w-3xl text-[1.6rem] font-medium leading-[1.15] tracking-[-0.03em] text-fg sm:text-4xl">
          I build <span className="hl">AI agents</span>, platforms
          <br className="hidden sm:block" /> & MCP servers for the enterprise.
        </motion.p>
        <motion.p variants={item} className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {profile.tagline}
        </motion.p>
        <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <a href="#agent-studio" className="btn-primary group">
              Explore my work <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </Magnetic>
          <Magnetic>
            <a href={profile.resume} download className="btn-ghost"><Download size={15} /> Resume</a>
          </Magnetic>
        </motion.div>
        <motion.div variants={item} className="mt-7 flex items-center justify-center gap-5 text-muted">
          {[
            { href: profile.socials.github, icon: Github, label: 'GitHub' },
            { href: profile.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
            { href: profile.socials.email, icon: Mail, label: 'Email' },
          ].map(({ href, icon: Icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="transition hover:-translate-y-0.5 hover:text-fg">
              <Icon size={18} />
            </a>
          ))}
          <span className="h-4 w-px bg-line" />
          <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide"><MapPin size={13} /> {profile.location}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <ApiCard />
        </motion.div>
      </motion.div>

      {/* Framed stats strip */}
      <div className="relative grid grid-cols-2 border-t border-line bg-surface/70 backdrop-blur md:grid-cols-4">
        <Corners />
        {heroStats.map((s, i) => (
          <div key={s.label} className={`px-6 py-7 sm:px-10 ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t md:border-t-0' : ''} ${i === 2 ? 'md:border-l' : ''} border-line`}>
            <div className="text-3xl font-medium tracking-tight sm:text-4xl"><Counter to={s.value} suffix={s.suffix} /></div>
            <div className="label mt-2 normal-case tracking-normal">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
