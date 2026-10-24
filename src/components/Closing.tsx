import { motion } from 'framer-motion'
import { ArrowRight, ArrowUp, ArrowUpRight, Award, Check, Copy, Github, GraduationCap, Linkedin, Mail, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { certifications, education, profile } from '../data/profile'
import { useHire } from '../lib/hire'
import { Counter, Magnetic, Reveal, Section, SectionHeading, SpotlightCard, WordReveal } from './ui'

export function Credentials() {
  return (
    <Section id="credentials">
      <SectionHeading index="08" label="Credentials" title="Education & certifications" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="label mb-4 flex items-center gap-2"><GraduationCap size={15} className="text-accent" /> Education</p>
          <div className="space-y-3">
            {education.map((e, i) => (
              <Reveal key={e.degree} delay={i * 0.08}>
                <SpotlightCard className="p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-lg font-medium tracking-tight">{e.degree}</h4>
                    <span className="font-mono text-xs text-muted">{e.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{e.school}</p>
                  <span className="chip mt-4">{e.score}</span>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
        <div>
          <p className="label mb-4 flex items-center gap-2"><Award size={15} className="text-accent" /> Certifications</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {certifications.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <SpotlightCard className="h-full p-5">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-accent">{c.issuer}</p>
                  <h4 className="mt-2 font-medium leading-snug">{c.title}</h4>
                  <p className="mt-2 text-[13.5px] text-muted">{c.note}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <a
              href={profile.socials.certifications}
              target="_blank"
              rel="noreferrer"
              className="group mt-3 flex items-center justify-between gap-4 rounded-xl border border-dashed border-fg/20 bg-surface p-5 transition-colors hover:border-accent hover:bg-accent/[0.04] dark:hover:border-white"
            >
              <span className="flex items-center gap-4">
                <span className="text-3xl font-medium tracking-tight text-accent"><Counter to={30} suffix="+" /></span>
                <span>
                  <span className="block font-medium">More certificates</span>
                  <span className="text-[13px] text-muted">See all licenses & certifications on LinkedIn</span>
                </span>
              </span>
              <span className="btn-primary shrink-0 !px-4 !py-2">
                <Linkedin size={15} /> View all <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const hire = useHire()
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* clipboard blocked */ }
  }
  // No backend: compose the message in the visitor's mail client
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const subject = encodeURIComponent(`Portfolio enquiry from ${f.get('name')}`)
    const body = encodeURIComponent(`${f.get('message')}\n\n${f.get('name')} · ${f.get('email')}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }
  const input = 'w-full rounded-[10px] border border-line bg-bg px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/15 dark:focus:border-white dark:focus:ring-white/10'

  return (
    <Section id="contact" className="overflow-hidden">
      <div className="hatch pointer-events-none absolute inset-y-0 right-0 hidden w-24 opacity-60 lg:block" />
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="label mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-accent" /><span className="text-fg">[ 09 ]</span> · Contact
            </p>
          </Reveal>
          <h2 className="text-4xl font-medium leading-[1.05] tracking-[-0.035em] sm:text-6xl">
            <WordReveal text="Let's build something *intelligent." />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-lg text-muted">
              Open to AI engineering roles, GenAI consulting and collaborations on agent platforms, MCP tooling and enterprise automation.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <button onClick={hire} className="btn-primary group mt-8">
              Send a hiring request <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </Reveal>
          <Reveal delay={0.3}>
            <button onClick={copy} className="group mt-4 inline-flex items-center gap-3 rounded-xl border border-line bg-surface px-5 py-4 text-left transition hover:border-fg/30">
              <Mail size={18} className="text-accent" />
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-wide text-muted">{copied ? 'Copied' : 'Click to copy'}</span>
                <span className="font-medium">{profile.email}</span>
              </span>
              <span className="ml-2 text-muted group-hover:text-fg">{copied ? <Check size={16} /> : <Copy size={16} />}</span>
            </button>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-5 flex gap-2">
              {[
                { href: profile.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
                { href: profile.socials.github, icon: Github, label: 'GitHub' },
              ].map(({ href, icon: Icon, label }) => (
                <Magnetic key={label}>
                  <a href={href} target="_blank" rel="noreferrer" className="btn-ghost"><Icon size={15} /> {label}</a>
                </Magnetic>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <form onSubmit={submit} className="card space-y-3 p-6 sm:p-8">
            <p className="label mb-2 text-[11px]">Send a message</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="name" required placeholder="Your name" className={input} />
              <input name="email" type="email" required placeholder="Your email" className={input} />
            </div>
            <textarea name="message" required rows={6} placeholder="Tell me about your project or role…" className={`${input} resize-none`} />
            <motion.button whileTap={{ scale: 0.98 }} className="btn-primary w-full justify-center !py-3">
              Send message <Send size={15} />
            </motion.button>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}

export function Footer() {
  return (
    <footer className="frame">
      <div className="flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-10">
        <p className="font-mono text-xs uppercase tracking-wide">© {new Date().getFullYear()} {profile.name} · AI Engineer</p>
        <a href="#top" className="inline-flex items-center gap-1.5 hover:text-fg">Back to top <ArrowUp size={14} /></a>
      </div>
    </footer>
  )
}
