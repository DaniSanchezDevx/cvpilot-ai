# Security

CVPilot AI handles private resume content and API credentials. Do not commit real `.env` files, resumes, logs, screenshots with personal data, or production secrets.

## Secrets

Required secrets must live in `.env` locally and in the deployment provider's environment variable manager in production.

- `OPENAI_API_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `DATABASE_URL`

If a secret is exposed, rotate it immediately in the provider dashboard.

## Resume Data

Uploaded CV text is stored in PostgreSQL for analysis history. For production, add retention controls, user deletion flows, and file storage policies before handling real users.

## Reporting

For this portfolio project, open a private issue or contact the maintainer directly if you find a security problem.

