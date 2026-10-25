import emailjs from '@emailjs/browser'
import { emailConfig, emailEnabled } from './emailConfig'

export type HiringForm = {
  name: string
  email: string
  phone: string
  company: string
  location: string
  role: string
  message: string
}

type IpInfo = Record<string, string | number | boolean | null>

/** Visitor network details from ipapi.co; never blocks sending if it fails. */
export async function fetchVisitorInfo(): Promise<IpInfo | null> {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 5000)
    const res = await fetch('https://ipapi.co/json/', { signal: ctrl.signal })
    clearTimeout(t)
    if (!res.ok) return null
    const data = await res.json()
    return data.error ? null : data
  } catch {
    return null
  }
}

const v = (x: unknown) => (x === undefined || x === null || x === '' ? '—' : String(x))

/** Flatten the form, ipapi.co result and browser details into template variables. */
export function buildParams(form: HiringForm, ip: IpInfo | null) {
  const now = new Date()
  return {
    to_email: emailConfig.toEmail,
    // Sender
    from_name: form.name,
    from_email: form.email,
    reply_to: form.email,
    phone: form.phone,
    company: form.company,
    location: form.location,
    role: v(form.role),
    message: v(form.message),
    // Submission
    submitted_at: now.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Asia/Kolkata' }),
    page_url: window.location.href,
    referrer: v(document.referrer),
    // Browser
    user_agent: navigator.userAgent,
    browser_language: navigator.language,
    browser_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${screen.width}×${screen.height} @${window.devicePixelRatio}x`,
    platform: v((navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform),
    // ipapi.co (every field)
    ip_status: ip ? 'Resolved via ipapi.co' : 'ipapi.co lookup unavailable',
    ip: v(ip?.ip),
    ip_network: v(ip?.network),
    ip_version: v(ip?.version),
    ip_city: v(ip?.city),
    ip_region: v(ip?.region),
    ip_region_code: v(ip?.region_code),
    ip_postal: v(ip?.postal),
    ip_country: v(ip?.country_name),
    ip_country_code: v(ip?.country_code),
    ip_country_iso3: v(ip?.country_code_iso3),
    ip_country_capital: v(ip?.country_capital),
    ip_country_tld: v(ip?.country_tld),
    ip_continent: v(ip?.continent_code),
    ip_in_eu: v(ip?.in_eu),
    ip_latitude: v(ip?.latitude),
    ip_longitude: v(ip?.longitude),
    ip_map_url: ip?.latitude ? `https://www.google.com/maps?q=${ip.latitude},${ip.longitude}` : 'https://www.google.com/maps',
    ip_timezone: v(ip?.timezone),
    ip_utc_offset: v(ip?.utc_offset),
    ip_calling_code: v(ip?.country_calling_code),
    ip_currency: ip ? `${v(ip.currency)} (${v(ip.currency_name)})` : '—',
    ip_languages: v(ip?.languages),
    ip_country_area: v(ip?.country_area),
    ip_country_population: v(ip?.country_population),
    ip_asn: v(ip?.asn),
    ip_org: v(ip?.org),
    ip_raw_json: ip ? JSON.stringify(ip, null, 2) : 'unavailable',
  }
}

/** FormSubmit renders keys as row labels, so send human-readable names. */
function formSubmitPayload(p: ReturnType<typeof buildParams>) {
  return {
    _subject: `New hiring request · ${p.from_name} from ${p.company}`,
    _replyto: p.from_email,
    _template: 'table',
    _captcha: 'false',
    'Name': p.from_name,
    'Email': p.from_email,
    'Contact number': p.phone,
    'Company': p.company,
    'Location (entered)': p.location,
    'Role / opportunity': p.role,
    'Message': p.message,
    'Submitted (IST)': p.submitted_at,
    'Page': p.page_url,
    'Referrer': p.referrer,
    'IP address': `${p.ip} (${p.ip_version})`,
    'Network': p.ip_network,
    'City / region / postal': `${p.ip_city}, ${p.ip_region} (${p.ip_region_code}) · ${p.ip_postal}`,
    'Country': `${p.ip_country} (${p.ip_country_code} / ${p.ip_country_iso3}) · capital ${p.ip_country_capital} · TLD ${p.ip_country_tld}`,
    'Continent · in EU': `${p.ip_continent} · ${p.ip_in_eu}`,
    'Coordinates': `${p.ip_latitude}, ${p.ip_longitude}`,
    'Map': p.ip_map_url,
    'IP timezone': `${p.ip_timezone} (UTC ${p.ip_utc_offset})`,
    'ISP / ASN': `${p.ip_org} · ${p.ip_asn}`,
    'Calling code · currency': `${p.ip_calling_code} · ${p.ip_currency}`,
    'Country area · population': `${p.ip_country_area} km² · ${p.ip_country_population}`,
    'Languages': p.ip_languages,
    'Browser timezone · language': `${p.browser_timezone} · ${p.browser_language}`,
    'Platform · screen': `${p.platform} · ${p.screen}`,
    'User agent': p.user_agent,
    'Raw ipapi.co response': p.ip_raw_json,
  }
}

export type SendResult =
  | { status: 'sent' }
  | { status: 'failed'; mailto: string; text: string }

/** Plain-text copy of the request, used for the mailto link and "copy details". */
function fallbackFor(form: HiringForm, p: ReturnType<typeof buildParams>): SendResult {
  const text = [
    `Name: ${p.from_name}`, `Email: ${p.from_email}`, `Phone: ${p.phone}`,
    `Company: ${p.company}`, `Location: ${p.location}`, `Role: ${p.role}`, '', `Message: ${p.message}`, '',
    `IP: ${p.ip} · ${p.ip_city}, ${p.ip_region}, ${p.ip_country} · ${p.ip_org}`,
  ].join('\n')
  const subject = encodeURIComponent(`Hiring request from ${form.name} · ${form.company}`)
  return { status: 'failed', text, mailto: `mailto:${emailConfig.toEmail}?subject=${subject}&body=${encodeURIComponent(text)}` }
}

/**
 * EmailJS when configured, otherwise FormSubmit. Never navigates the page:
 * on failure it returns a mailto link and text for the dialog to offer.
 */
export async function sendHiringRequest(form: HiringForm): Promise<SendResult> {
  const ip = await fetchVisitorInfo()
  const params = buildParams(form, ip)
  try {
    if (emailEnabled) {
      await emailjs.send(emailConfig.serviceId, emailConfig.templateId, params, { publicKey: emailConfig.publicKey })
      return { status: 'sent' }
    }
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 15000)
    const res = await fetch(`https://formsubmit.co/ajax/${emailConfig.formSubmitTarget}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(formSubmitPayload(params)),
      signal: ctrl.signal,
    })
    clearTimeout(t)
    const data = await res.json().catch(() => ({}))
    // FormSubmit answers success "true" once the inbox has been activated
    if (res.ok && String(data.success) === 'true') return { status: 'sent' }
    throw new Error(data.message || `FormSubmit ${res.status}`)
  } catch (err) {
    console.warn('Hiring request email failed:', err)
    return fallbackFor(form, params)
  }
}
