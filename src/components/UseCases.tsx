import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useCases, type UseCaseStatus } from '../data/profile'
import { Reveal, Section, SectionHeading, SpotlightCard } from './ui'

const modules = ['All', 'Policy', 'Compliance', 'Risk', 'BCM'] as const
const totalAgents = useCases.reduce((n, u) => n + u.agents.length, 0)
const live = useCases.filter((u) => u.status === 'Live').length

function Status({ s }: { s: UseCaseStatus }) {
  if (s === 'Live')
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wide text-fg">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        Live
      </span>
    )
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wide text-muted ${s === 'In development' ? 'hatch' : 'border border-line'}`}>
      {s}
    </span>
  )
}

/** Agents shown as a left-to-right pipeline. */
function AgentChain({ agents }: { agents: string[] }) {
  return (
    <div className="relative flex flex-wrap items-center gap-1.5">
      {agents.map((a, i) => (
        <span key={a} className="flex items-center gap-1.5">
          <span className="rounded-md border border-line bg-bg px-2 py-1 font-mono text-[10.5px] text-fg transition-colors group-hover:border-accent/40 dark:group-hover:border-white/30">
            {a}
          </span>
          {i < agents.length - 1 && <ChevronRight size={12} className="text-muted" />}
        </span>
      ))}
    </div>
  )
}

export default function UseCases() {
  const [m, setM] = useState<(typeof modules)[number]>('All')
  const shown = useCases.filter((u) => m === 'All' || u.module === m)
  return (
    <Section id="use-cases">
      <SectionHeading
        index="05"
        label="GRC & BCM AI Use Cases"
        title="Multi-agent automation across a *GRC *product"
        subtitle="AI use cases I designed and shipped across the Policy, Compliance, Risk and BCM modules. Each one turns hours or days of analyst work into minutes."
      />

      <Reveal>
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex gap-8">
            {[[useCases.length, 'use cases'], [totalAgents, 'AI agents'], [live, 'live in product']].map(([v, l]) => (
              <div key={l as string}>
                <div className="text-3xl font-medium tracking-tight">{v}</div>
                <div className="label mt-1 text-[11px]">{l}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 rounded-[10px] border border-line bg-surface p-1">
            {modules.map((x) => (
              <button
                key={x}
                onClick={() => setM(x)}
                className={`relative rounded-md px-3.5 py-1.5 text-sm transition-colors ${m === x ? 'text-on-accent' : 'text-muted hover:text-fg'}`}
              >
                {m === x && <motion.span layoutId="uc-tab" className="absolute inset-0 rounded-md bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="relative">{x}</span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <motion.div layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((u) => (
            <motion.div
              layout
              key={u.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <SpotlightCard className="h-full">
                <div className="flex h-full flex-col p-5">
                  <div className="flex items-center justify-between">
                    <span className="label text-[10.5px]">{u.module}</span>
                    <Status s={u.status} />
                  </div>
                  <h4 className="mt-3 text-[16px] font-medium leading-snug">{u.title}</h4>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{u.description}</p>
                  <div className="mt-auto pt-5">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
                      {u.agents.length > 1 ? `${u.agents.length}-agent workflow` : 'Single agent'}
                    </p>
                    <AgentChain agents={u.agents} />
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  )
}
