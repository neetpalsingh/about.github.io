import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Bot, Code2, KeyRound, MessagesSquare, Plug, ShieldCheck, Workflow, Wrench } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { mcpServer as M } from '../data/profile'
import { Reveal, Section, SectionHeading, SpotlightCard } from './ui'

const pointIcons = [Wrench, KeyRound, Plug, Workflow]
const clients = [
  { name: 'Claude', icon: Bot },
  { name: 'IDE agents', icon: Code2 },
  { name: 'Chat copilots', icon: MessagesSquare },
]

/** Horizontal beam with packets moving left → right. */
function Beam({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative h-px w-full bg-line">
      <motion.span
        className="absolute -top-[2px] h-[5px] w-[5px] rounded-full bg-accent"
        animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, delay, ease: 'linear' }}
      />
    </div>
  )
}

function Topology() {
  return (
    <div className="card dots relative grid items-center gap-4 overflow-hidden p-5 sm:p-7 md:grid-cols-[1fr_60px_1.1fr_60px_1.3fr]">
      <div className="space-y-2">
        <p className="label mb-3 text-[11px]">MCP clients</p>
        {clients.map(({ name, icon: Icon }) => (
          <div key={name} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm">
            <Icon size={15} className="text-muted" /> {name}
          </div>
        ))}
      </div>
      <div className="hidden space-y-8 md:block">{[0, 1, 2].map((i) => <Beam key={i} delay={i * 0.4} />)}</div>

      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        className="relative rounded-xl border border-accent/50 bg-surface p-4 text-center shadow-[0_0_0_6px_rgb(var(--accent)/.06)] dark:border-white/40"
      >
        <motion.span
          className="absolute inset-0 rounded-xl border border-accent/40 dark:border-white/30"
          animate={{ scale: [1, 1.08], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <Plug size={22} className="mx-auto text-accent" />
        <p className="mt-2 font-medium">MCP Server</p>
        <p className="font-mono text-[11px] text-muted">350+ tools</p>
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-accent/10 px-2 py-1 font-mono text-[10.5px] text-accent dark:bg-white/10 dark:text-fg">
          <ShieldCheck size={12} /> auth · SSO · per-user scope
        </div>
      </motion.div>

      <div className="hidden space-y-8 md:block">{[0, 1, 2].map((i) => <Beam key={i} delay={0.8 + i * 0.4} />)}</div>
      <div>
        <p className="label mb-3 text-[11px]">GRC & BCM REST APIs</p>
        <div className="grid grid-cols-2 gap-2">
          {M.modules.map((m, i) => (
            <motion.span
              key={m}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="rounded-lg border border-line bg-surface px-2.5 py-2 text-center font-mono text-[11px]"
            >
              {m}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Looping console of tool calls an AI client makes through the server. */
function ToolConsole() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setN((v) => (v >= M.calls.length + 2 ? 0 : v + 1)), 1000)
    return () => clearInterval(t)
  }, [inView])
  return (
    <div ref={ref} className="card h-full overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="font-mono text-xs text-muted">user ›</span>
        <span className="truncate text-sm">“Create a BCP for Payments Ops and send it for review.”</span>
      </div>
      <div className="min-h-[260px] space-y-2 p-4 font-mono text-[12px]">
        <AnimatePresence>
          {M.calls.slice(0, n).map((c, i) => (
            <motion.div key={c.tool} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="hl">{c.tool}()</span>
              <span className="text-muted">→ {c.result}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {n > M.calls.length && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 text-fg">
            ✓ Done in 6 tool calls. No forms, no clicks.
          </motion.p>
        )}
        {n <= M.calls.length && <span className="inline-block h-3.5 w-1.5 animate-pulse bg-accent" />}
      </div>
    </div>
  )
}

export default function McpServer() {
  return (
    <Section id="mcp">
      <SectionHeading
        index="04"
        label="Custom MCP Server"
        title="350+ enterprise APIs, usable by *any *AI *agent"
        subtitle={M.summary}
      />
      <Reveal><Topology /></Reveal>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {M.points.map((p, i) => {
            const Icon = pointIcons[i]
            return (
              <Reveal key={p.title} delay={i * 0.06}>
                <SpotlightCard className="h-full p-5">
                  <Icon size={18} className="text-accent" />
                  <h4 className="mt-3 font-medium">{p.title}</h4>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{p.text}</p>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>
        <Reveal delay={0.1}><ToolConsole /></Reveal>
      </div>
    </Section>
  )
}
