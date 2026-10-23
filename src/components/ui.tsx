import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react'

import { ease } from './motion'

/** Fade + lift into view once. */
export function Reveal({ children, delay = 0, y = 20, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/** Word-by-word blur-in text. Words wrapped in *asterisks* get the accent color. */
export function WordReveal({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split(' ').map((w, i) => {
        const hot = w.startsWith('*')
        return (
          <motion.span
            key={i}
            className={`inline-block ${hot ? 'hl' : ''}`}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: delay + i * 0.05, ease }}
          >
            {w.replace(/\*/g, '')}&nbsp;
          </motion.span>
        )
      })}
    </span>
  )
}

/** "+" markers on the frame intersections, a firecrawl.dev signature. */
export function Corners() {
  const c = 'pointer-events-none absolute z-10 h-[9px] w-[9px] text-fg/30'
  const plus = (
    <svg viewBox="0 0 9 9" className="h-full w-full" aria-hidden>
      <path d="M4.5 0v9M0 4.5h9" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
  return (
    <>
      <span className={`${c} -left-[5px] -top-[5px]`}>{plus}</span>
      <span className={`${c} -right-[5px] -top-[5px]`}>{plus}</span>
    </>
  )
}

/** Section wrapper: full-width horizontal rule + framed content. */
export function Section({ id, children, className = '' }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`section ${className}`}>
      <Corners />
      <div className="px-4 py-20 sm:px-10 md:py-28">{children}</div>
    </section>
  )
}

export function SectionHeading({ index, label, title, subtitle }: { index: string; label: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-12 max-w-3xl md:mb-16">
      <Reveal>
        <p className="label mb-5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="h-1.5 w-1.5 bg-accent" />
          <span className="whitespace-nowrap text-fg">[ {index} ]</span>
          <span>·</span>
          {label}
        </p>
      </Reveal>
      <h2 className="text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] sm:text-5xl">
        <WordReveal text={title} />
      </h2>
      {subtitle && (
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}

/** Card with a soft spotlight that follows the cursor. */
export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    ref.current!.style.setProperty('--x', `${e.clientX - r.left}px`)
    ref.current!.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <div ref={ref} onMouseMove={onMove} className={`group card relative overflow-hidden transition-colors duration-300 hover:border-fg/20 ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(380px circle at var(--x) var(--y), rgb(var(--accent) / .07), transparent 45%)' }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}

/** Element that drifts toward the cursor. */
export function Magnetic({ children, className = '' }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.2)
        y.set((e.clientY - r.top - r.height / 2) * 0.2)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

/** Count up when scrolled into view. */
export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{val}{suffix}</span>
}

/** Render **bold** segments from plain strings. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
        p.startsWith('**') ? <strong key={i} className="font-medium text-fg">{p.slice(2, -2)}</strong> : p,
      )}
    </>
  )
}
