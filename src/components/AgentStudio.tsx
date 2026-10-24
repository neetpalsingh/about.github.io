import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Bot, FileText, Globe, Layers, Lock, ShieldCheck, Workflow } from 'lucide-react'
import { useState } from 'react'
import { agentStudio as A } from '../data/profile'
import { Counter, Reveal, Section, SectionHeading, SpotlightCard } from './ui'

const icons = { bot: Bot, layers: Layers, shield: ShieldCheck, workflow: Workflow, file: FileText, globe: Globe, lock: Lock, chart: BarChart3 }

const layers: { label: string; nodes: string[]; hot?: boolean }[] = [
  { label: 'Clients', nodes: ['No-code Builder', 'Embed Widget', 'Agent API', 'Admin Console'] },
  { label: 'Gateway', nodes: ['Auth · HttpOnly cookies', 'CORS', 'CSRF'], hot: true },
  { label: 'Services', nodes: ['Chat', 'Agents', 'Knowledge', 'Orgs & Auth', 'Analytics'] },
  { label: 'Execution', nodes: ['RabbitMQ priority workers', 'LLM Router: OpenAI · Azure · Claude · Gemini · Groq'], hot: true },
  { label: 'Data · org_id scoped', nodes: ['MongoDB', 'Redis', 'Vector DB'] },
]

/** Vertical connector with packets flowing down between architecture layers. */
function Flowline({ count, delay }: { count: number; delay: number }) {
  return (
    <div className="grid h-9 sm:grid-cols-[110px_1fr]">
      <span className="hidden sm:block" />
      <div className="flex justify-around px-[10%]">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative w-px bg-line">
          <motion.span
            className="absolute -left-[2px] h-[5px] w-[5px] rounded-full bg-accent"
            animate={{ top: ['-10%', '100%'], opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: delay + i * 0.35, ease: 'linear' }}
          />
        </div>
      ))}
      </div>
    </div>
  )
}

function Architecture() {
  return (
    <div className="card dots relative overflow-hidden p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="label">System architecture</span>
        <span className="chip"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />live flow</span>
      </div>
      {layers.map((l, li) => (
        <div key={l.label}>
          {li > 0 && <Flowline count={Math.min(l.nodes.length, 4)} delay={li * 0.3} />}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: li * 0.12, duration: 0.5 }}
            className="grid gap-2 sm:grid-cols-[110px_1fr] sm:items-center"
          >
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted">{l.label}</span>
            <div className="flex flex-wrap gap-2">
              {l.nodes.map((n) => (
                <span
                  key={n}
                  className={`flex-1 rounded-lg sm:whitespace-nowrap border px-3 py-2 text-center font-mono text-[11.5px] ${
                    l.hot ? 'border-accent/40 bg-accent/[0.06] text-fg dark:border-white/30 dark:bg-white/[0.06]' : 'border-line bg-surface text-fg'
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  )
}

export default function AgentStudio() {
  const [tab, setTab] = useState(0)
  const d = A.decisions[tab]
  return (
    <Section id="agent-studio">
      <SectionHeading
        index="03"
        label="Flagship · Designed & built from scratch"
        title={`*Agent *Studio: a multi-tenant SaaS for building AI agents`}
        subtitle={A.summary}
      />

      {/* Metrics */}
      <div className="mb-6 grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-surface md:grid-cols-4">
        {A.metrics.map((m, i) => (
          <div key={m.label} className={`border-line p-6 ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t md:border-t-0' : ''} ${i === 2 ? 'md:border-l' : ''}`}>
            <div className="text-3xl font-medium tracking-tight sm:text-4xl"><Counter to={m.value} suffix={m.suffix} /></div>
            <div className="mt-1 text-sm text-muted">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal><Architecture /></Reveal>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {A.features.map((f, i) => {
            const Icon = icons[f.icon as keyof typeof icons]
            return (
              <Reveal key={f.title} delay={(i % 2) * 0.06}>
                <SpotlightCard className="h-full p-4">
                  <Icon size={18} className="text-accent transition-transform duration-300 group-hover:scale-110" />
                  <h4 className="mt-3 text-[15px] font-medium">{f.title}</h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{f.text}</p>
                </SpotlightCard>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* Impact */}
      <Reveal className="mt-14">
        <p className="label mb-4">Measured impact</p>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
          {A.impact.map((m) => (
            <div key={m.label} className="group bg-surface p-5 transition-colors hover:bg-accent/[0.04]">
              <div className="font-mono text-xl font-medium text-fg group-hover:text-accent">{m.value}</div>
              <div className="mt-1.5 text-[13px] leading-snug text-muted">{m.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Engineering decisions */}
      <Reveal className="mt-14">
        <p className="label mb-4">Engineering decisions & trade-offs</p>
        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <div className="flex gap-2 overflow-x-auto md:flex-col">
            {A.decisions.map((x, i) => (
              <button
                key={x.title}
                onClick={() => setTab(i)}
                className={`relative shrink-0 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  tab === i ? 'border-fg/20 bg-surface text-fg' : 'border-transparent text-muted hover:text-fg'
                }`}
              >
                {tab === i && <motion.span layoutId="dec-bar" className="absolute inset-y-2 left-0 w-[2px] rounded bg-accent" />}
                <span className="mr-2 font-mono text-xs text-muted">0{i + 1}</span>
                {x.title}
              </button>
            ))}
          </div>
          <div className="card relative min-h-[220px] overflow-hidden p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
                <h4 className="text-xl font-medium tracking-tight">{d.title}</h4>
                <dl className="mt-5 grid gap-5 sm:grid-cols-3">
                  {[['Why', d.why], ['Trade-off', d.tradeoff], ['Outcome', d.outcome]].map(([k, v]) => (
                    <div key={k}>
                      <dt className="label mb-2 text-[11px]">{k}</dt>
                      <dd className={`text-sm leading-relaxed ${k === 'Outcome' ? 'text-fg' : 'text-muted'}`}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-2">
        {A.stack.map((s) => <span key={s} className="chip">{s}</span>)}
      </div>
    </Section>
  )
}
