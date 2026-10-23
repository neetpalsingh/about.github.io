import { motion, useScroll } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { useRef } from 'react'
import { experience, focusAreas, marquee, profile, skillGroups } from '../data/profile'
import { Reveal, Rich, Section, SectionHeading, SpotlightCard } from './ui'

export function About() {
  return (
    <Section id="about">
      <SectionHeading index="01" label="About" title="I turn LLMs into *reliable *systems that enterprises run on" />
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <div className="space-y-5 text-[17px] leading-relaxed text-muted">
            {profile.summary.map((p, i) => <p key={i}><Rich text={p} /></p>)}
          </div>
          {profile.photo && <img src={profile.photo} alt={profile.name} className="card mt-8 aspect-[4/3] w-full max-w-sm object-cover" />}
        </Reveal>
        <div className="overflow-hidden rounded-xl border border-line">
          {focusAreas.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className={`group flex gap-4 bg-surface p-5 transition-colors hover:bg-accent/[0.04] ${i ? 'border-t border-line' : ''}`}>
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <div className="flex-1">
                  <h3 className="flex items-center justify-between font-medium">
                    {f.title}
                    <ArrowUpRight size={15} className="text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="mask-fade-x group flex overflow-hidden">
      <div className={`flex shrink-0 gap-2 pr-2 ${reverse ? 'animate-marquee-slow [animation-direction:reverse]' : 'animate-marquee'} group-hover:[animation-play-state:paused]`}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className="whitespace-nowrap rounded-lg border border-line bg-surface px-4 py-2 font-mono text-[13px] text-muted transition hover:text-fg">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading index="07" label="Skills" title="The stack behind the agents" subtitle="From model fine-tuning to production APIs, queues and the data layer underneath." />
      <div className="-mx-4 mb-12 space-y-2 sm:-mx-10">
        <Marquee items={marquee} />
        <Marquee items={[...marquee].reverse()} reverse />
      </div>
      <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={g.title} delay={(i % 3) * 0.06} className="bg-surface">
            <div className="h-full p-6">
              <p className="label mb-4 flex items-center gap-2 text-[11px]"><span className="h-1.5 w-1.5 bg-accent" />{g.title}</p>
              <motion.div className="flex flex-wrap gap-1.5" initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ staggerChildren: 0.03 }}>
                {g.items.map((s) => (
                  <motion.span
                    key={s}
                    variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                    className="rounded-md border border-line px-2.5 py-1 text-[13px] text-fg transition-colors hover:border-fg/30"
                  >
                    {s}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  return (
    <Section id="experience">
      <SectionHeading index="02" label="Experience" title="Where I build" />
      {experience.map((job) => (
        <div key={job.company} ref={ref} className="grid gap-8 md:grid-cols-[260px_1fr]">
          <Reveal>
            <div className="md:sticky md:top-28">
              <p className="font-mono text-xs uppercase tracking-wider text-accent">{job.period}</p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight">{job.role}</h3>
              <p className="mt-1 text-fg">{job.company}</p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted"><MapPin size={14} /> {job.location}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">{job.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            </div>
          </Reveal>
          <div className="relative pl-8">
            <div className="absolute bottom-0 left-[5px] top-0 w-px bg-line" />
            <motion.div className="absolute left-[5px] top-0 h-full w-px origin-top bg-accent" style={{ scaleY: scrollYProgress }} />
            <ul className="space-y-3">
              {job.highlights.map((h, i) => (
                <Reveal key={i} delay={0.02 * i}>
                  <li className="relative">
                    <span className="absolute -left-[31px] top-6 h-[11px] w-[11px] border border-accent bg-bg" />
                    <SpotlightCard className="p-5 text-[15px] leading-relaxed text-muted"><Rich text={h} /></SpotlightCard>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </Section>
  )
}
