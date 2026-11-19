# Taskline

A Trello / Linear-style kanban task manager that runs entirely in the browser.

**Stack:** React 18 · React Router (HashRouter) · Tailwind CSS v4 · Recharts · LocalStorage · Vite · Vitest + Testing Library

## Features
- Register / login (front-end only), per-user data
- Dashboard: KPI cards, progress bar, status bar chart, priority donut chart, next-due list
- Kanban board with drag & drop between four statuses
- Create / edit / delete tasks (title, description, status, priority, due date)
- Search, priority filter and status filter
- Dark / light mode (remembered)
- Responsive layout

## Getting started
    npm install
    npm run dev        # development
    npm test           # 31 tests
    npm run build      # production build in dist/

## Project structure
    src/
      App.jsx                routes
      constants.js           statuses & priorities
      styles.js              shared Tailwind class strings
      context/AppContext.jsx auth, tasks, theme and modal state (+ LocalStorage persistence)
      pages/                 Auth, Dashboard, Board
      components/            Layout, TaskCard, TaskModal, Select, DatePicker, EmptyState, Logo
      hooks/useDismiss.js    outside-click / Escape handling shared by Select and DatePicker
      utils/                 dates, storage, id
      data/sample.js         optional sample tasks ("Load sample tasks")
      __tests__/ + test/     unit and integration tests

## Design decisions
- **Custom Select and DatePicker.** Native `<select>` popups and `<input type="date">` are rendered by the OS/browser and cannot be styled consistently (especially in dark mode). Small custom components give the same look and behaviour everywhere, and they are covered by tests.
- **HashRouter + relative base.** The build works on GitHub Pages or any static host, under any sub-path, without server rewrites.
- **Native HTML5 drag & drop** instead of a library: fewer dependencies, enough for column-to-column moves.
- **Context instead of a state library.** The state is small (user, tasks, theme, modal), so a single context keeps things simple.
- **Local dates, not UTC.** "Today" and "overdue" are computed in the user's timezone (an early version used UTC and was off by one day around midnight).

## Limitations
- Auth is a UI demo: accounts and passwords live in the browser's LocalStorage, unencrypted. Don't use real credentials.
- Data is per-browser; clearing site data removes it.
- Drag & drop works with a mouse. On touch devices, change a task's status from its edit dialog.

## Deploy
    npm run build
Upload `dist/` to GitHub Pages (or Netlify / Vercel).
