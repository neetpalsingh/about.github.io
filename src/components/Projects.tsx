import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import { useState } from 'react'
import { profile, projects, repos } from '../data/profile'
import ProjectVisual from './ProjectVisual'
import { Reveal, Section, SectionHeading, SpotlightCard } from './ui'

const topics = ['All', 'Agents', 'RAG', 'Tools', 'ML']

export default function Projects() {
  const [topic, setTopic] = useState('All')
  const shown = repos.filter((r) => topic === 'All' || r.topic === topic)

  return (
    <Section id="projects">
      <SectionHeading
        index="06"
        label="More projects"
        title="Other systems I've built"
        subtitle="Retrieval, analytics, open-source tooling and deep learning. Each diagram is a live sketch of how it works."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 3) * 0.08}>
            <SpotlightCard className="h-full transition-transform duration-500 hover:-translate-y-1">
              <div className="flex h-full flex-col">
                <div className="dots relative h-48 overflow-hidden border-b border-line">
                  <ProjectVisual type={p.visual} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="label text-[10.5px]">{p.kicker}</p>
                  <h3 className="mt-2 text-lg font-medium tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{p.description}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
                    {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-sm font-medium hover:text-accent">
                        Code <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <div className="mt-20">
        <Reveal>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="label mb-2 flex items-center gap-2"><span className="h-1.5 w-1.5 bg-accent" />Open source</p>
              <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">On GitHub</h3>
            </div>
            <div className="flex flex-wrap gap-1 rounded-[10px] border border-line bg-surface p-1">
              {topics.map((t) => (
                <button key={t} onClick={() => setTopic(t)} className={`relative rounded-md px-3.5 py-1.5 text-sm transition-colors ${topic === t ? 'text-on-accent' : 'text-muted hover:text-fg'}`}>
                  {topic === t && <motion.span layoutId="repo-tab" className="absolute inset-0 rounded-md bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="relative">{t}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <motion.div layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((r) => (
              <motion.a
                layout
                key={r.name}
                href={`${profile.socials.github}/${r.name}`}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <SpotlightCard className="h-full p-5">
                  <div className="flex items-start justify-between">
                    <Github size={17} className="text-muted group-hover:text-fg" />
                    <ArrowUpRight size={15} className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>
                  <h4 className="mt-4 break-words font-mono text-[14px] font-medium">{r.name}</h4>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{r.desc}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" />{r.lang}</span>
                    <span className="chip py-0.5">{r.topic}</span>
                  </div>
                </SpotlightCard>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
        <Reveal className="mt-8 text-center">
          <a href={`${profile.socials.github}?tab=repositories`} target="_blank" rel="noreferrer" className="btn-ghost">
            <Github size={15} /> All repositories <ArrowUpRight size={14} />
          </a>
        </Reveal>
      </div>
    </Section>
  )
}
