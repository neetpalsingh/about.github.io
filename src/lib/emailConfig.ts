// Hiring-request emails are sent straight from the browser (no backend).
//
// Default: FormSubmit (https://formsubmit.co), which needs no account or keys. The first
// submission emails `toEmail` an activation link; click it once and every
// request after that lands in the inbox.
//
// Optional upgrade: fill in the EmailJS IDs below to send the custom HTML
// template in email-templates/hiring-request.html instead. These are PUBLIC
// identifiers, safe to commit; Gmail credentials stay inside EmailJS.
export const emailConfig = {
  serviceId: '', // e.g. 'service_abc123'  (Email Services → your Gmail service)
  templateId: '', // e.g. 'template_xyz789' (Email Templates → hiring request)
  publicKey: '', // e.g. 'AbCdEf123456'     (Account → General → Public Key)
  toEmail: 'neetpalsingh750@gmail.com',
  // After activating FormSubmit you may swap the address for the random alias
  // it gives you (e.g. 'a1b2c3d4e5...') to keep the email out of the page source.
  formSubmitTarget: 'neetpalsingh750@gmail.com',
}

export const emailEnabled = Boolean(emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey)
