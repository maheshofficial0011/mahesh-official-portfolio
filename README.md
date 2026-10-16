# Mahesh Official — Portfolio

Creative, responsive portfolio for Mahesh Official, built with React, TypeScript, Vite, Framer Motion, and Lucide icons.

## Features
- Responsive layout and mobile navigation
- Animated hero artwork and subtle motion
- Searchable and filterable project cards with technology-aware search
- Project status labels that distinguish active builds from learning work
- About, skills, learning process, WhatsApp, email, and contact-form sections
- Responsive contact form routed through FormSubmit (first-use email activation may be required)
- SEO description, canonical URL, and social-sharing metadata
- Back-to-top shortcut and no-results state for project search
- Reduced-motion accessibility support
- GitHub Pages deployment workflow

## Run locally

Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Open **Settings → Pages** and choose **GitHub Actions** as the deployment source.
2. The workflow in `.github/workflows/deploy.yml` builds the project and deploys the `dist` folder whenever changes are pushed to `main`.
3. Check the **Actions** tab for build and deployment status.

## Projects

Project status badges communicate current development/learning status and should be checked against the source repositories before being described as complete.

- [SurakshaDrishti AI](https://github.com/maheshofficial0011/SurakshaDrishti-AI)
- [SikshaSetu](https://github.com/maheshofficial0011/Siksha_Setu)
- [SkillSaathi](https://github.com/maheshofficial0011/skillsaathi-campus-peer-learning)
- [DSA-JAVA](https://github.com/maheshofficial0011/DSA-JAVA)
- [WasteVoice AI](https://github.com/maheshofficial0011/wastevoice-ai)
- [Helpdesk 360](https://github.com/maheshofficial0011/helpdesk-360)

## Before publishing

- Confirm the FormSubmit activation email before expecting contact-form submissions.
- Verify every project's latest status and links.
- Google Fonts are loaded remotely; local fallback fonts are provided.
