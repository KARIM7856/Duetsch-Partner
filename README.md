# DeutschFlow: AI-Powered German Conversational Trainer

DeutschFlow is a full-stack platform designed to bridge the gap between A1 German grammar and real-world fluency. It uses STT (Speech-to-Text) and LLMs to provide granular, word-level feedback on spoken and written German.

## Key Features

- **Dynamic Subject Prompts:** Context-aware prompts to force production.
- **Granular Grammar Analysis:** Real-time correction with color-coded hyperlinks to German grammar rules.
- **Multiplayer Live Sessions:** Real-time WebRTC audio rooms with live fluency scoring.
- **DevOps Ready:** Fully containerized and orchestrated via Docker Compose.

## Tech Stack

- **Frontend:** Next.js (TypeScript), Tailwind CSS, Framer Motion
- **Backend:** FastAPI (Python 3.11+), PostgreSQL (SQLAlchemy)
- **AI/ML:** OpenAI Whisper (ASR), Gemini 1.5 Flash (Analysis)
- **Real-time:** LiveKit (WebRTC), WebSockets
- **Infra:** Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.11+ (for local backend dev)

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

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `POST /api/analyze` - Analyze German text for grammar errors
- `POST /api/transcribe` - Transcribe audio and analyze the result
