npm install
npm run build# Project Navigator AI

AI Project Idea Generator & Mentor

A web application designed to help final-year engineering and computer science students transition from vague ideas to fully planned, evaluation-ready capstone projects. The platform leverages Generative AI to deliver tailored project concepts, complete tech stack recommendations, phased implementation roadmaps, and viva/examination preparation.

Technical Scope & Functional Requirements

1. Student Input Engine

The application collects user profiles through a structured, step-by-step form to ensure high context for AI generation.

Academic Background: Degree program (e.g., B.Tech CS, BCA, IT), current semester, and academic proficiency level.

Tech Stack Preferences: Known languages (e.g., Python, JavaScript, C++), frameworks (e.g., React, Django, Flutter), and databases (e.g., PostgreSQL, MongoDB).

Domain Interests: Primary and secondary domains (e.g., AI/ML, Cybersecurity, Cloud Native, IoT, Web3, FinTech).

Career Goals: Preferred job roles post-graduation (e.g., Frontend Developer, Data Scientist, DevOps Engineer) to ensure project alignment with resume building.

Team & Scope Constraints: Team size (Individual vs. Group of 2–4), expected project duration (e.g., 8 weeks, 16 weeks), and target complexity level.

2. Project Generation Engine

Based on student inputs, the platform generates 3 to 5 realistic, high-impact project concepts. Each proposal includes:

Project Title: Industry-standard title avoiding generic phrasing.

Problem Statement: Clear articulation of the real-world problem being solved.

Proposed Solution: Concise operational summary of the system.

Domain & Difficulty Badges: Visual tags indicating core fields and difficulty (Beginner, Intermediate, Advanced).

Relevance Score: Brief explanation of why this project fits the student's exact skill set and career goals.

3. Full Mentorship Plan (Roadmap & Execution)

For any chosen project idea, the platform expands the concept into a complete execution plan:

A. Key Features & Functionality

Core MVP Features: Essential functional requirements needed for a working baseline demo.

Advanced/Bonus Features: Stretch goals designed to score higher marks during academic evaluations.

User Roles: Clear definition of system personas (e.g., Admin, End User, Auditor).

B. Tech Stack Architecture

Frontend: Recommended frameworks, styling solutions, and state management tools.

Backend: Application framework, API architecture (REST/GraphQL), and authentication mechanisms.

Database & Storage: Primary data storage, caching layers, and file storage strategies.

Third-Party APIs & Libraries: AI models, external services, and utility libraries.

C. Step-by-Step Development Roadmap

Chronological timeline organized into four structured phases:

[Phase 1: Planning & Setup] ➔ [Phase 2: Core Development] ➔ [Phase 3: Integration] ➔ [Phase 4: Testing & Viva]

  (Weeks 1-2)                   (Weeks 3-6)                  (Weeks 7-8)               (Weeks 9-10)

Phase 1: Requirements & Architecture Setup

Database schema design and ER diagrams.

API contract definition and environment configuration.

Phase 2: Core MVP Development

Authentication setup and core UI building.

Primary backend services and database operations.

Phase 3: AI/Advanced Feature Integration

Integrating external APIs, ML models, or complex business logic.

UI polish, error handling, and state management optimization.

Phase 4: Testing, Deployment & Documentation

Deployment to hosting platforms (e.g., Vercel, Render, AWS).

Creating the final project report, system architecture diagrams, and viva Q&A prep.

D. Academic Evaluation & Viva Prep

Expected Technical Questions: 3–5 potential questions internal/external examiners might ask regarding trade-offs, scalability, and security.

Live Demo Strategy: Checklist on how to structure the 10-minute presentation to impress evaluators.

Suggested System Architecture & Tech Stack

   ┌──────────────────┐               ┌──────────────────┐               ┌──────────────────┐

   │  React / Next.js │ ──(REST/JSON)─►│  FastAPI / Node  │ ──(API Call)─►│ Google Gemini    │

   │  Tailwind CSS UI │ ◄─(Structured)─│  Backend Gateway │ ◄─(JSON Schema)│ API (2.5 Flash)  │

   └──────────────────┘               └──────────────────┘               └──────────────────┘

LayerToolingFrontend UIReact 18, Vite, Tailwind CSS, TypeScriptBackend APIFastAPI (Python) or Express (Node.js)AI ModelGoogle Gemini API (gemini-2.5-flash) via Google AI StudioStructured OutputJSON Schema validation via Gemini Native Structured Outputs

Data Flow Diagram

[Student Input Form]

        │

        ▼

[Payload Validation]

        │

        ▼

[Gemini Prompt Engine (Structured JSON)]

        │

        ├───────────────────────────┐

        ▼                           ▼

[Generate Project Cards]    [Generate Full Roadmap]

        │                           │

        └─────────────┬─────────────┘

                      ▼

            [Interactive Dashboard]

AI generation uses the Google Gemini API through Google AI Studio. The API key is read server-side and is never exposed to the browser.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Run the dependency-free smoke tests:

```sh
npm test
```

Test the deployed URL as well:

```sh
set LIVE_URL=https://your-worker.workers.dev
npm run test:live
```

Create `.env.local` for local AI generation:

```sh
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-2.5-flash
```

For deployment, set the same variables in the hosting provider's server environment, then run:

```sh
npm run build
```

Use `npm run build` for a production build and the hosting provider's detected start command for the generated TanStack Start server.
