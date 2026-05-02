# Roadmap

## Fase 1 - Foundation

- Next.js 15 App Router setup
- TypeScript strict mode
- TailwindCSS and shadcn/ui
- Clerk auth routes and protected middleware
- Landing page
- Dashboard shell
- Prisma schema
- Docker and GitHub Actions

## Fase 2 - CV Upload and Parsing

- PDF/DOCX drag and drop
- File validation
- Resume preview
- Text extraction
- Parsed profile extraction: name, skills, experience, education, technologies, years of experience
- Save draft analysis to PostgreSQL
- Show recent analysis history

## Fase 3 - OpenAI and ATS Analysis

- OpenAI service adapter
- ATS scoring prompt
- Keyword extraction
- Score breakdown
- Persist analysis results
- Fallback heuristic analysis when OpenAI is not configured

## Fase 4 - AI Optimization

- Bullet rewrite engine
- Professional summary improvement
- Action verb suggestions
- Metric suggestions
- Generate optimized CV
- Regenerate optimized CV from the analysis detail page

## Fase 5 - Product UX

- Charts
- History filters
- Profile settings
- Loading skeletons
- Empty states
- Error handling and toast notifications
- Analysis detail page
- Dedicated history and profile routes

## Fase 6 - Production

- Docker hardening
- CI/CD polish
- Deployment guide
- Monitoring plan
- README screenshots
