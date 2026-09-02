# Experiment 4 — Interactive Calendar Scheduler

A React + Vite experiment that visualizes a development workload as a drag-and-drop
calendar. Tasks are categorized as **Optimization** (memoization, lazy loading, …)
or **Non-Optimization** (nested loops, repeated rendering, …) so the impact of
render-aware techniques can be inspected live.

## Tech

- React 18 (functional components, hooks)
- Vite 5 (dev server + build)
- Plain CSS (custom properties, grid layout, dark glass dashboard aesthetic)

## Run

```bash
npm install
npm run dev      # http://localhost:5174
npm run build
npm run preview
```

## Features

- Month grid with previous/next/today navigation
- Drag a task to a different day to reschedule
- Click a task to inspect date, time, and duration
- Toggle between Optimization and Non-Optimization workloads
- Live render counter to make re-render cost visible
