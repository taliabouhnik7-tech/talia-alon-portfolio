# Talia Alon — UX/UI Portfolio

Personal portfolio site for Talia Alon, UX/UI designer. Built with Next.js
(App Router) and Tailwind CSS v4, mobile-first with light/dark mode support
via `prefers-color-scheme`.

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4
- TypeScript
- Fonts: Fraunces (serif, headings) + Inter (sans, body) via `next/font/google`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/app/page.tsx` — assembles the page from section components
- `src/components/` — Nav, Hero, WorkGrid, BakeryCaseStudy, About, ContactFooter
- `src/data/projects.ts` — content for the non-flagship project cards
- `public/images/work/` — project card images

## Deployment

Deployed via Vercel.
