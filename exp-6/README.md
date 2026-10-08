# Experiment 6 — Student Task Manager (Scalable APIs & Caching)

A full-stack Student Task Manager demonstrating scalable backend APIs, database relationships, caching, pagination, sorting, and an interactive glassmorphism UI in React.

## Features
- **Pagination & Sorting**: Retrieve tasks with page and size limits to handle large datasets cleanly (`GET /api/tasks?page=0&size=5&sort=id,desc`).
- **N+1 Problem Resolution & Caching**: Cache expensive queries using Spring `@Cacheable` and optimize queries using JPA `JOIN FETCH`.
- **Native SQL Queries**: Support for direct native queries for high-performance data extraction.
- **Interactive UI**: Glassmorphism dashboard with task completion toggling, task creation, deletion, pagination controls, and live metrics.

## Architecture
```
exp-6/
├── backend/
│   ├── src/main/java/com/example/backend/  # Spring Boot REST Application
│   │   ├── entity/                        # JPA Entities (Task, Comment)
│   │   ├── repository/                    # Spring Data JPA Repositories
│   │   ├── service/                       # Cached Service Layer
│   │   └── StudentTaskManagerApplication.java
│   ├── server.js                          # Lightweight standalone API runner
│   └── pom.xml                            # Maven Build Configuration
└── frontend/
    ├── src/                               # React 19 + Vite Application
    │   ├── App.jsx                        # Task manager dashboard
    │   └── App.css                        # Glassmorphism aesthetic & animations
    └── package.json
```

## How to Run

### 1. Start the Backend (Port 8080)
With Node.js:
```bash
cd exp-6/backend
node server.js
```
Or with Maven (Java 17+):
```bash
cd exp-6/backend
mvn spring-boot:run
```

### 2. Start the Frontend (Port 5173)
```bash
cd exp-6/frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
