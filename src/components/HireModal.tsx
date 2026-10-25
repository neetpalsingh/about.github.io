import { AnimatePresence, motion } from 'framer-motion'
import { Building2, CheckCircle2, Loader2, Mail, MapPin, Phone, Send, User, X, Briefcase } from 'lucide-react'
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { HireContext } from '../lib/hire'
import { sendHiringRequest, type HiringForm, type SendResult } from '../lib/hiringRequest'
import { ease } from './motion'
import { emailConfig } from '../lib/emailConfig'

const emailTo = emailConfig.toEmail

const empty: HiringForm = { name: '', email: '', phone: '', company: '', location: '', role: '', message: '' }

const fields: { key: keyof HiringForm; label: string; type?: string; icon: typeof User; required?: boolean; placeholder: string }[] = [
  { key: 'name', label: 'Full name', icon: User, required: true, placeholder: 'Jane Doe' },
  { key: 'email', label: 'Work email', type: 'email', icon: Mail, required: true, placeholder: 'jane@company.com' },
  { key: 'phone', label: 'Contact number', type: 'tel', icon: Phone, required: true, placeholder: '+91 98765 43210' },
  { key: 'company', label: 'Company name', icon: Building2, required: true, placeholder: 'Acme Inc.' },
  { key: 'location', label: 'Location', icon: MapPin, required: true, placeholder: 'Gurugram, India' },
  { key: 'role', label: 'Role / opportunity', icon: Briefcase, placeholder: 'Senior AI Engineer' },
]

type State = 'idle' | 'sending' | 'sent' | 'failed'

function Dialog({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState(empty)
  const [state, setState] = useState<State>('idle')
  const [fallback, setFallback] = useState<Extract<SendResult, { status: 'failed' }> | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setState('sending')
    const result = await sendHiringRequest(form)
    if (result.status === 'sent') setState('sent')
    else { setFallback(result); setState('failed') }
  }

  const input = 'w-full rounded-[10px] border border-line bg-bg py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/15 dark:focus:border-white dark:focus:ring-white/10'
  const copyDetails = async () => {
    try { await navigator.clipboard.writeText(fallback?.text ?? ''); setCopied(true) } catch { /* clipboard blocked */ }
  }

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hire-title"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.35, ease }}
        className="card relative max-h-[92svh] w-full max-w-xl overflow-y-auto rounded-b-none sm:rounded-xl"
      >
        <div className="dots flex items-start justify-between border-b border-line px-6 py-5">
          <div>
            <p className="label mb-2 flex items-center gap-2 text-[11px]"><span className="h-1.5 w-1.5 bg-accent" />Hiring request</p>
            <h3 id="hire-title" className="text-2xl font-medium tracking-tight">Let's work together</h3>
            <p className="mt-1 text-sm text-muted">Share a few details and I'll get back to you within 24 hours.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line bg-surface text-muted hover:text-fg">
            <X size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {state === 'failed' && fallback ? (
            <motion.div key="failed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-10 text-center">
              <Mail size={40} className="mx-auto text-accent" />
              <h4 className="mt-4 text-xl font-medium">Couldn't send automatically</h4>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                Your details are ready. Send them from your email app, or copy them and email {emailTo}.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <a href={fallback.mailto} target="_blank" rel="noreferrer" className="btn-primary">Open email app <Send size={14} /></a>
                <button onClick={copyDetails} className="btn-ghost">{copied ? 'Copied ✓' : 'Copy details'}</button>
              </div>
              <button onClick={() => setState('idle')} className="mt-5 text-sm text-muted underline-offset-4 hover:text-fg hover:underline">Try again</button>
            </motion.div>
          ) : state === 'sent' ? (
            <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
                <CheckCircle2 size={48} className="mx-auto text-accent" />
              </motion.div>
              <h4 className="mt-4 text-xl font-medium">Request sent!</h4>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                Thanks {form.name.split(' ')[0]}, your details reached my inbox. I'll reply to {form.email} soon.
              </p>
              <button onClick={onClose} className="btn-ghost mt-6">Close</button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} className="space-y-4 px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map(({ key, label, type, icon: Icon, required, placeholder }) => (
                  <label key={key} className="block">
                    <span className="mb-1.5 block text-[13px] font-medium">
                      {label} {required ? <span className="text-accent">*</span> : <span className="font-normal text-muted">(optional)</span>}
                    </span>
                    <span className="relative block">
                      <Icon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type={type ?? 'text'}
                        required={required}
                        value={form[key]}
                        placeholder={placeholder}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className={input}
                      />
                    </span>
                  </label>
                ))}
              </div>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium">Message <span className="font-normal text-muted">(optional)</span></span>
                <textarea
                  rows={3}
                  value={form.message}
                  placeholder="Tell me about the role, team or project…"
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${input} resize-none !pl-3`}
                />
              </label>
              <button disabled={state === 'sending'} className="btn-primary w-full justify-center !py-3 disabled:opacity-70">
                {state === 'sending' ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <>Send hiring request <Send size={15} /></>}
              </button>
              <p className="text-center font-mono text-[10.5px] uppercase tracking-wide text-muted">Your details go only to my inbox</p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function HireProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const show = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])
  return (
    <HireContext.Provider value={show}>
      {children}
      <AnimatePresence>{open && <Dialog onClose={close} />}</AnimatePresence>
    </HireContext.Provider>
  )
}
