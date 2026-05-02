# Architecture

CVPilot AI uses a feature-first Clean Architecture approach.

## Layers

`domain`

Pure business language: ATS score, keyword analysis, resume profile, optimized resume.

`application`

Use cases, schemas, service interfaces, and repository ports. This layer should not know Prisma, Clerk, OpenAI, or React.

`infrastructure`

Adapters for Prisma, OpenAI, file parsers, storage, and external APIs.

`presentation`

React components and route-facing UI for a feature.

## Initial Modules

- `resume-analysis`: CV parsing, ATS scoring, keyword analysis, AI suggestions, optimized CV generation.
- `auth`: Clerk handles hosted login/register and protected routes.
- `billing`: planned for fake pricing first, Stripe later.

## Data Flow

1. User uploads CV and pastes a job description.
2. Presentation validates form input with React Hook Form and Zod.
3. Application service coordinates parsing and analysis.
4. Infrastructure adapters call OpenAI and persist results through Prisma.
5. Dashboard displays score, keywords, suggestions, and history.

## Conventions

- Keep Server Components as the default.
- Push client components to the smallest interactive surface.
- Validate external input with Zod.
- Initialize external SDKs lazily.
- Keep route handlers thin and delegate to application services.

