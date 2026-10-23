import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { useHire } from '../lib/hire'

const links = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'agent-studio', label: 'Agent Studio' },
  { id: 'mcp', label: 'MCP' },
  { id: 'use-cases', label: 'AI Use Cases' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch { /* storage unavailable */ }
  }, [dark])
  return [dark, () => setDark((d) => !d)] as const
}

export function ThemeToggle() {
  const [dark, toggle] = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-md border border-line bg-surface text-fg transition-colors hover:border-fg/30"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ y: -20, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: 20, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {dark ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export default function Navbar() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const hire = useHire()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach((l) => { const el = document.getElementById(l.id); if (el) io.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect() }
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div className="absolute inset-x-0 top-0 h-[2px] origin-left bg-accent" style={{ scaleX: progress }} />
      <div className={`border-b transition-colors duration-300 ${scrolled ? 'border-line bg-bg/80 backdrop-blur-xl' : 'border-transparent'}`}>
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-accent font-mono text-[11px] font-bold text-on-accent">NS</span>
            <span className="hidden text-[15px] font-medium tracking-tight sm:inline">{profile.name}</span>
          </a>
          <ul className="hidden items-center gap-0.5 lg:flex">
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className={`relative rounded-md px-3 py-1.5 text-[13.5px] transition-colors ${active === l.id ? 'text-fg' : 'text-muted hover:text-fg'}`}>
                  {active === l.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-md bg-fg/[0.06]" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={hire} className="btn-primary hidden !px-4 !py-2 sm:inline-flex">Hire me</button>
            <button className="grid h-9 w-9 place-items-center rounded-md border border-line lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card mx-4 mt-2 grid gap-1 p-2 lg:hidden"
            >
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={() => setOpen(false)} className="block rounded-lg px-4 py-3 text-sm hover:bg-fg/5">{l.label}</a>
                </li>
              ))}
              <li>
                <button onClick={() => { setOpen(false); hire() }} className="btn-primary mt-1 w-full justify-center">Hire me</button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
