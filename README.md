## Prostate Symptom Assessment (Next.js)

### Overview
A mobile‑friendly, multi‑step I‑PSS assessment built with Next.js. It includes a smooth 4‑step progress bar, animated transitions, and an Odoo CRM integration that creates leads with detailed assessment summaries.

### Features
- Multi‑step flow: Demographics → Questions → Contact → Medical → Processing → Results
- 4‑step progress bar with smooth animations (Framer Motion)
- SSR‑safe, responsive UI (Tailwind + shadcn/ui)
- Prisma + PostgreSQL persistence
- Odoo CRM integration via JSON‑RPC:
  - Ensures contact (by email), ensures tags, creates a lead with bullet‑point description, posts an internal note
  - Non‑blocking; errors are logged but don’t break the flow

### Tech stack
- Next.js 15, React 19
- Tailwind CSS, shadcn/ui, Framer Motion
- Prisma ORM, PostgreSQL
- Odoo JSON‑RPC

### Getting started

- Prerequisites:
  - Node 18+ and npm
  - PostgreSQL database
  - Odoo instance (URL, DB name, user, API key)

- Environment
  - Create `.env.local` (local) or set in your hosting environment:
    ```
    DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME

    # Odoo JSON-RPC
    ODOO_URL=https://your-odoo-host-or-domain
    ODOO_DB=your_odoo_database
    ODOO_USERNAME=your_user_email@domain.com
    ODOO_PASSWORD=your_odoo_api_key_or_password

    # Optional (DEV ONLY): separate shadow DB to avoid collisions in migrate dev
    SHADOW_DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/prisma_shadow
    ```
- Install and run (first time)
  ```bash
  npm install
  npx prisma migrate dev       # applies migrations locally and creates DB if missing
  npm run dev                  # http://localhost:3000
  ```

### Build and deploy
```bash
# Build (generates Prisma client too via scripts)
npm run build

# Start
npm start
```

- Production migration application:
  ```bash
  export DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME
  npx prisma migrate deploy
  ```
- Do not run migrate dev or reset in production.

### Project structure
- `app/`
  - `api/submit-assessment/route.ts`: saves assessment; triggers Odoo lead creation (non-blocking)
  - `api/assessments/route.ts`: list recent assessments
- `components/`
  - `HealthAssessmentFlow.jsx`: orchestrates the multi‑step UI
  - `ProgressBar.tsx`: 4‑step animated progress bar
  - `ProcessingPage.jsx`: friendly “getting results ready” screen
  - `SymptomsPage.jsx`, `DemographicsPage.jsx`, `NameEmailPage.jsx`, `MedicalHistoryPage.jsx`, `ResultsPage.jsx`
- `lib/`
  - `odoo.ts`: JSON‑RPC client (`odooAuthenticate`, `ensureTag`, `ensurePartner`, `createLead`, `postNote`)
  - `utils.ts`: helpers (e.g., classnames)
- `prisma/`
  - `schema.prisma`, `migrations/`

### API

- POST `/api/submit-assessment`
  - Request:
    ```json
    {
      "demographics": { "age": "54", "sex": "male" },
      "medicalHistory": {
        "conditions": ["Hypertension"],
        "medications": "Amlodipine",
        "familyHistory": "no",
        "surgeries": "None"
      },
      "responses": [1,2,3,1,0,2,1],
      "contact": { "fullName": "John Tester", "email": "john.tester@example.com" }
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "score": 10,
      "severity": "Mild",
      "severityColor": "mild",
      "ageContext": "...",
      "medicalContext": ["..."],
      "recommendations": "...",
      "redFlags": ["..."]
    }
    ```

- GET `/api/assessments?limit=20`
  - Returns the latest saved assessments.

### Odoo integration details
- Dedupes contacts by email (`res.partner`)
- Tags ensured: “Prostate Assessment” and “I‑PSS: <Severity>”
- Lead name: `I‑PSS Assessment - <Severity>`
- Description: human‑readable bullet points (no HTML) with personal info, results, and responses
- Errors are caught and logged; the user experience is never blocked

### Accessibility and mobile
- Fully responsive layout and controls
- Respects reduced‑motion preferences in all animations
- Large touch targets and single‑column layouts on mobile

### Scripts
- `npm run dev`: start dev server
- `npm run build`: build the app
- `npm start`: run production server
- `npx prisma migrate dev`: apply migrations locally (dev only)
- `npx prisma migrate deploy`: apply migrations in prod/staging
