# DeutschFlow: AI-Powered German Conversational Trainer

DeutschFlow is a full-stack platform designed to bridge the gap between A1 German grammar and real-world fluency. It uses STT (Speech-to-Text) and LLMs to provide granular, word-level feedback on spoken and written German.

## Key Features

- **Dynamic Subject Prompts:** Context-aware prompts to force production.
- **Granular Grammar Analysis:** Real-time correction with color-coded hyperlinks to German grammar rules.
- **Multiplayer Live Sessions:** Real-time WebRTC audio rooms with live fluency scoring.
- **DevOps Ready:** Fully containerized and orchestrated via Docker Compose.

## Tech Stack

- **App:** Next.js (TypeScript, App Router) — frontend and API routes in a single deployable
- **Database:** PostgreSQL (for upcoming users / history / achievements)
- **AI/ML:** OpenAI Whisper (ASR), Gemini 2.5 Flash (Analysis)
- **Infra:** Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd deutschflow
   ```

2. Copy the environment file and add your API keys:
   ```bash
   cp .env.example .env
   ```

3. Start all services:
   ```bash
   docker-compose up
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Local Development (without Docker)

```bash
cd frontend
npm install
npm run dev
```

Set `GEMINI_API_KEY` and `OPENAI_API_KEY` in either the project-root `.env` (read by `docker-compose`) or `frontend/.env.local` (read by `next dev`).

## API Endpoints

Served by Next.js route handlers under `frontend/src/app/api/`:

- `POST /api/analyze` — analyze German text for grammar errors
- `POST /api/transcribe` — transcribe audio and analyze the result
