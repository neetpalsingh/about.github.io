# Neetpal Singh · AI/ML Engineer Portfolio

One-page portfolio built with **React + TypeScript + Vite**, **Tailwind CSS** and **Framer Motion**.

- Dark / light mode (remembers your choice, defaults to system setting)
- Single indigo accent across the whole UI
- Animated hero with a live neural-graph canvas and a looping "agent run" terminal
- Every featured project has its own animated diagram (RAG fusion, agent routing, text-to-SQL, embedding clusters, LoRA loss curve, MRI scan…)
- Scroll-linked timeline, spotlight cards, magnetic buttons, marquees and counters

## Edit content

All text lives in [`src/data/profile.ts`](src/data/profile.ts): profile, skills, experience, projects, repos, education and certifications.
To add a photo, put it in `public/` and set `photo: 'your-photo.jpg'`. Replace `public/Neetpal_Singh_Resume.pdf` to update the resume.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
In the repo, go to **Settings → Pages → Source** and choose **GitHub Actions**.
Because `vite.config.ts` uses a relative base, the site works both at `username.github.io` and at `username.github.io/<repo>/`.

## Hiring request emails

The **Hire me** button opens a form (name, email, contact number, company, location, role, message).
On submit, the browser looks up the visitor's network details from `https://ipapi.co/json/` and emails
everything to `neetpalsingh750@gmail.com`, with no backend.

**Default: FormSubmit (no keys needed).** The form posts to `https://formsubmit.co/ajax/neetpalsingh750@gmail.com`.

1. Deploy the site and submit the form once yourself.
2. FormSubmit emails you an **activation link**. Click it.
3. From then on, every request arrives as a formatted table with all form fields plus every ipapi.co field.
4. Optional: the activation email gives you a random alias. Put it in `formSubmitTarget` in
   `src/lib/emailConfig.ts` so your address isn't visible in the page source.

**Optional upgrade: EmailJS + custom HTML design.** To get the designed email in `email-templates/hiring-request.html`:

1. emailjs.com → **Email Services → Add New Service → Gmail** → connect your Gmail. Copy the **Service ID**.
2. **Email Templates → Create New Template** → Code editor → paste `email-templates/hiring-request.html`.
   Subject `New hiring request · {{from_name}} from {{company}}`, To Email `{{to_email}}`,
   From Name `Portfolio Hiring Request`, Reply To `{{reply_to}}`. Copy the **Template ID**.
3. **Account → General** → copy the **Public Key**.
4. Fill `serviceId`, `templateId` and `publicKey` in `src/lib/emailConfig.ts`. EmailJS is then used instead of FormSubmit.

If sending ever fails, the form falls back to opening the visitor's email app pre-filled.
