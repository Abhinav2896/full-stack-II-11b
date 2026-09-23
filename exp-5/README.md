# Experiment 5 — OmniPost Composer (Full-Stack)

A two-tier social-media post composer. The React frontend talks to a Spring Boot
REST backend that persists posts to an in-memory H2 database.

## Architecture

```
exp-5/
├── backend/    Spring Boot 4 + Java 21 + Spring Data JPA (H2 in-memory)
└── frontend/   React 19 + Vite + vanilla CSS glassmorphism
```

The frontend dev server proxies `/api/*` to `http://localhost:8081`.

## Stack

**Backend** — Spring Boot, Spring Data JPA, H2 (in-memory), Gradle.
**Frontend** — React 19, Vite 8, vanilla CSS (no UI framework).

## Run

### 1. Start the backend (port 8081)

```bash
cd backend
./gradlew bootRun
```

H2 console: <http://localhost:8081/h2-console> (JDBC URL `jdbc:h2:mem:testdb`).

### 2. Start the frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>.

## Features

- Compose posts for Twitter (50), Instagram (100), or Facebook (200) word limits
- Live word-count enforcement with global error banner
- List, edit (in-place), and delete posts
- Persisted via REST to a Spring Data JPA repository
- Glassmorphism dark dashboard with animated gradients
