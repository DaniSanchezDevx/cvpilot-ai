# CVPilot AI

CVPilot AI is a full-stack SaaS application that analyzes resumes against job descriptions and helps candidates improve ATS compatibility, keyword coverage, and interview readiness.

It is built as a portfolio-grade product, not a tutorial app: authenticated dashboard, PostgreSQL persistence, PDF/DOCX parsing, OpenAI-powered structured analysis, optimized CV generation, charts, history, and a clean feature-first architecture.

## Preview

Screenshots should be added before publishing the final portfolio version:

- `docs/screenshots/landing.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/analysis.png`

## Features

- Modern SaaS landing page
- Clerk authentication
- Authenticated dashboard
- PDF, DOCX, and TXT resume upload
- Fallback manual CV text input
- Job description comparison
- ATS score breakdown
- Keyword analysis
- AI suggestions for resume improvements
- Optimized CV generation
- Analysis history
- Analysis detail page
- User profile page
- Local heuristic fallback when OpenAI quota is unavailable
- PostgreSQL persistence through Prisma
- Docker Compose database setup
- GitHub Actions CI

## Stack

- Next.js 15 App Router
- TypeScript
- TailwindCSS v4
- shadcn/ui
- Framer Motion
- Clerk
- PostgreSQL
- Prisma ORM
- OpenAI API
- Zod
- React Hook Form
- Zustand
- Recharts
- Docker
- GitHub Actions

## Product Routes

- `/` - marketing landing page
- `/demo` - unauthenticated visual demo
- `/dashboard` - analysis workspace
- `/dashboard/history` - saved analyses
- `/dashboard/analyses/[id]` - analysis detail, suggestions, optimized CV
- `/dashboard/profile` - profile and usage

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Start PostgreSQL:

```bash
docker compose up -d db
```

Apply migrations:

```bash
npm run db:migrate
```

Run the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

Never commit real values. Use `.env.example` as the public template.

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cvpilot_ai"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4.1-mini"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/dashboard"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/dashboard"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

If `OPENAI_API_KEY` is missing or the account has no quota, CVPilot AI falls back to deterministic local heuristics so the product remains demoable.

## Architecture

The project follows a feature-first Clean Architecture style:

```txt
src/
  app/                         Next.js routes and route handlers
  components/
    ui/                        shadcn/ui primitives
    marketing/                 landing components
    app-shell/                 dashboard shell
    providers/                 app-wide providers
  features/
    resume-analysis/
      domain/                  business types
      application/             use cases, schemas, actions
      infrastructure/          file parsing and persistence adapters
      presentation/            feature UI
  hooks/                       reusable client hooks
  lib/
    ai/                        OpenAI client
    auth/                      Clerk user profile sync
    db/                        Prisma client
    env/                       environment validation
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Deployment Notes

For production deployment:

- Use a managed PostgreSQL database.
- Set environment variables in Vercel or your deployment provider.
- Rotate local test keys before publishing or deploying.
- Do not upload `.env`, logs, local PDFs, or screenshots with private data.
- Add rate limiting before opening the app to public users.

## Roadmap

- Export optimized CV to PDF/DOCX
- Background jobs for long AI analyses
- File storage with signed uploads
- User data deletion flow
- Billing with Stripe
- Team workspaces
- Embedding-based similarity scoring
- Multi-language resume optimization

## License

MIT

