// Hiring-request emails are sent straight from the browser (no backend).
//
// Primary: EmailJS, which sends the custom HTML template in
// email-templates/hiring-request.html (plus the auto-reply in
// email-templates/auto-reply.html, configured in the EmailJS dashboard).
// These are PUBLIC identifiers, safe to commit; Gmail credentials stay inside EmailJS.
//
// Fallback: FormSubmit (https://formsubmit.co) is used only if the EmailJS IDs are emptied.
export const emailConfig = {
  serviceId: 'service_k3wf2hw', // Email Services → Gmail service
  templateId: 'template_uz6re2s', // Email Templates → hiring request
  publicKey: '7sXB1Pm3h2phOy5EtlgiW', // Account → General → Public Key
  toEmail: 'neetpalsingh750@gmail.com',
  // FormSubmit alias for neetpalsingh750@gmail.com (keeps the address out of the request URL)
  formSubmitTarget: '2984b86b09c556f3eef24c44fd4f67f0',
}

export const emailEnabled = Boolean(emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey)
