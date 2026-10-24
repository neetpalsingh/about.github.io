import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Visual } from '../data/profile'

const W = 480
const H = 260
const NW = 84
const NH = 30
const FH = 180 // tighter canvas for flow diagrams so labels render larger

/** Columns of nodes joined by animated "beams" carrying data packets. */
function Flow({ columns, highlight }: { columns: string[][]; highlight: number }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const gap = (W - NW - 24) / (columns.length - 1)
  const pos = columns.map((col, ci) =>
    col.map((label, ni) => ({
      label,
      x: 12 + ci * gap,
      y: FH / 2 - ((col.length - 1) * 48) / 2 + ni * 48 - NH / 2,
    })),
  )
  const edges: { d: string; key: string; delay: number }[] = []
  pos.forEach((col, ci) => {
    if (ci === pos.length - 1) return
    col.forEach((a, ai) =>
      pos[ci + 1].forEach((b, bi) => {
        const x1 = a.x + NW, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + NH / 2
        const mx = (x1 + x2) / 2
        edges.push({ d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`, key: `${ci}-${ai}-${bi}`, delay: ci * 0.5 + (ai + bi) * 0.15 })
      }),
    )
  })

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${FH}`} className="h-full w-full">
      {edges.map((e) => (
        <g key={e.key}>
          <motion.path
            d={e.d}
            fill="none"
            className="stroke-line"
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 0.8, delay: e.delay * 0.6 }}
          />
          {inView && (
            <circle r={3} className="fill-accent">
              <animateMotion dur="2.4s" begin={`${0.8 + e.delay}s`} repeatCount="indefinite" path={e.d} />
              <animate attributeName="opacity" values="0;1;1;0" dur="2.4s" begin={`${0.8 + e.delay}s`} repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}
      {pos.flat().map((n, i) => {
        const hot = pos.findIndex((c) => c.includes(n)) === highlight
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            style={{ transformOrigin: `${n.x + NW / 2}px ${n.y + NH / 2}px` }}
          >
            {hot && (
              <rect x={n.x - 4} y={n.y - 4} width={NW + 8} height={NH + 8} rx={12} className="fill-accent/15">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
              </rect>
            )}
            <rect x={n.x} y={n.y} width={NW} height={NH} rx={9} className={hot ? 'fill-accent' : 'fill-surface stroke-line'} strokeWidth={1} />
            <text
              x={n.x + NW / 2}
              y={n.y + NH / 2 + 3.5}
              textAnchor="middle"
              className={`font-mono text-[10px] ${hot ? 'fill-on-accent' : 'fill-fg'}`}
            >
              {n.label}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}

/** Natural language → typed SQL → animated bar chart. */
function SqlVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-60px' })
  const q = 'SELECT dept, COUNT(*) FROM risks\nWHERE status = \'open\' GROUP BY dept;'
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    setN(0)
    const t = setInterval(() => setN((v) => (v > q.length + 40 ? 0 : v + 1)), 45)
    return () => clearInterval(t)
  }, [inView])
  const done = n >= q.length
  const bars = [62, 88, 45, 74, 30]
  return (
    <div ref={ref} className="flex h-full flex-col gap-3 p-5 font-mono text-[11px]">
      <div className="rounded-lg border border-line bg-bg/60 px-3 py-2 text-fg">
        <span className="text-accent">ask › </span>open risks by department?
      </div>
      <pre className="min-h-[44px] whitespace-pre-wrap text-muted">
        {q.slice(0, n)}
        {!done && <span className="inline-block h-3 w-1.5 animate-pulse bg-accent align-middle" />}
      </pre>
      <div className="mt-auto flex h-24 items-end gap-2.5">
        {bars.map((b, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-md bg-accent"
            style={{ opacity: 0.35 + i * 0.13 }}
            animate={{ height: done ? `${b}%` : '4%' }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          />
        ))}
      </div>
    </div>
  )
}

/** Embedding points drifting into semantic clusters. */
function VectorVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-60px' })
  const [clustered, setClustered] = useState(false)
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setClustered((c) => !c), 2600)
    return () => clearInterval(t)
  }, [inView])
  const pts = useRef(
    Array.from({ length: 42 }, (_, i) => {
      const c = i % 3
      const centers = [[25, 35], [72, 30], [50, 72]]
      return {
        rx: 8 + Math.random() * 84, ry: 10 + Math.random() * 80,
        cx: centers[c][0] + (Math.random() - 0.5) * 18, cy: centers[c][1] + (Math.random() - 0.5) * 18, c,
      }
    }),
  ).current
  return (
    <div ref={ref} className="relative h-full w-full">
      <div className="absolute left-4 top-3 font-mono text-[10px] text-muted">collection: regulations · 1536-d</div>
      {pts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full bg-accent"
          style={{ opacity: 0.4 + p.c * 0.25 }}
          animate={{ left: `${clustered ? p.cx : p.rx}%`, top: `${clustered ? p.cy : p.ry}%` }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.01 }}
        />
      ))}
      {clustered && [[25, 35], [72, 30], [50, 72]].map(([x, y], i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/50"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  )
}

/** Training loss curve drawing itself, with LoRA rank badge. */
function FinetuneVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { margin: '-60px' })
  const d = 'M20,40 C60,60 80,150 130,170 S220,200 270,208 S380,214 460,216'
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
      {[60, 110, 160, 210].map((y) => <line key={y} x1={20} x2={460} y1={y} y2={y} className="stroke-line" strokeDasharray="3 5" />)}
      <text x={20} y={26} className="fill-muted font-mono text-[10px]">train_loss · LoRA r=16 · QLoRA 4-bit</text>
      <motion.path
        d={d}
        fill="none"
        className="stroke-accent"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: [0, 1, 1] } : {}}
        transition={{ duration: 4, times: [0, 0.7, 1], repeat: Infinity, repeatDelay: 0.5 }}
      />
      {inView && (
        <circle r={5} className="fill-accent">
          <animateMotion dur="4.5s" repeatCount="indefinite" path={d} keyPoints="0;1;1" keyTimes="0;0.62;1" calcMode="linear" />
        </circle>
      )}
      <g transform="translate(330 70)">
        <rect width={130} height={52} rx={10} className="fill-surface stroke-line" />
        <text x={12} y={21} className="fill-muted font-mono text-[10px]">base · LLaMA 7B</text>
        <text x={12} y={39} className="fill-accent font-mono text-[11px] font-semibold">+ adapter 0.4%</text>
      </g>
    </svg>
  )
}

/** MRI-style scan with sweeping line and class probabilities. */
function VisionVisual() {
  const classes = [['Non-demented', 12], ['Very mild', 9], ['Mild', 71], ['Moderate', 8]] as const
  return (
    <div className="flex h-full items-center gap-5 p-5">
      <div className="relative aspect-square h-full max-h-44 overflow-hidden rounded-xl border border-line bg-bg">
        <div className="absolute inset-[14%] rounded-[45%] border-2 border-accent/40" />
        <div className="absolute inset-[26%] rounded-[45%] border border-accent/30" />
        <div className="absolute inset-[38%] rounded-full bg-accent/20 blur-md" />
        <motion.div
          className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-accent/40 to-transparent"
          animate={{ top: ['-20%', '100%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="flex-1 space-y-2.5 font-mono text-[10.5px]">
        {classes.map(([c, v], i) => (
          <div key={c}>
            <div className="mb-1 flex justify-between text-muted"><span>{c}</span><span>{v}%</span></div>
            <div className="h-1.5 rounded-full bg-line">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                whileInView={{ width: `${v}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 + i * 0.12 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Mini browser: admin + public portal panels assembling. */
function PlatformVisual() {
  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-line bg-bg/60">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          {[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-line" />)}
          <span className="ml-3 h-3 flex-1 rounded bg-line/60" />
        </div>
        <div className="grid flex-1 grid-cols-[70px_1fr] gap-2 p-2">
          <motion.div initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="space-y-1.5 rounded-lg bg-surface p-2">
            {[0, 1, 2, 3].map((i) => <div key={i} className={`h-2 rounded ${i === 1 ? 'bg-accent' : 'bg-line'}`} />)}
          </motion.div>
          <div className="grid grid-cols-2 gap-2">
            {['AI Assistant', 'Calendar', 'Articles', 'Leads'].map((t, i) => (
              <motion.div
                key={t}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="flex flex-col justify-between rounded-lg border border-line bg-surface p-2"
              >
                <span className="font-mono text-[9px] text-muted">{t}</span>
                <motion.div
                  className="h-1.5 rounded bg-accent/70"
                  animate={{ width: ['30%', '85%', '30%'] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const flows: Partial<Record<Visual, { columns: string[][]; highlight: number }>> = {
  rag: { columns: [['Query'], ['Vector DB', 'Graph DB', 'BM25'], ['Reranker'], ['LLM + RBAC']], highlight: 3 },
}

export default function ProjectVisual({ type }: { type: Visual }) {
  const flow = flows[type]
  if (flow) return <div className="h-full p-3"><Flow {...flow} /></div>
  if (type === 'sql') return <SqlVisual />
  if (type === 'vector') return <VectorVisual />
  if (type === 'finetune') return <FinetuneVisual />
  if (type === 'vision') return <VisionVisual />
  return <PlatformVisual />
}
