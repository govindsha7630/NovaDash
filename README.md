# NovaDash

<div align="center">

![NovaDash Banner](https://placehold.co/1200x300/080C14/7C5CFC?text=NovaDash&font=montserrat)

**Your tasks. Your stories. One dashboard.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Appwrite](https://img.shields.io/badge/Appwrite-23.0-FD366E?style=for-the-badge&logo=appwrite&logoColor=white)](https://appwrite.io)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-In_Development-orange?style=for-the-badge)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

[Live Demo](#) · [Report Bug](https://github.com/govindsha7630/TaskFlow/issues) · [Request Feature](https://github.com/govindsha7630/TaskFlow/issues)

</div>

---

## 📖 About NovaDash

**NovaDash** is a premium, full-stack productivity SaaS platform that combines task management and content publishing into a single, beautiful dark-themed dashboard. Built for developers, creators, and digital professionals who want a unified workspace to manage their todos and publish articles — without switching between multiple tools.

### The Problem It Solves

Professionals today juggle multiple tools — Notion for notes, Todoist for tasks, Medium for writing. NovaDash eliminates this fragmentation by providing a single, cohesive workspace with:

- **Task Management** — Create, prioritize, and track todos with priority levels, due dates, and tags
- **Content Publishing** — Write and publish articles with a rich text editor
- **Analytics** — Visualize productivity trends and content performance in one dashboard

### Who It's For

- 👨‍💻 **Developers** building in public and tracking project tasks
- ✍️ **Content Creators** who write and manage editorial workflows
- 🚀 **Indie Hackers** needing a productivity hub without enterprise complexity
- 🎓 **Students** learning to build production-grade SaaS applications

---

## ✅ Features Already Built

### Authentication
- [x] Email & Password signup with full form validation
- [x] Password strength indicator (4-level: Weak → Fair → Good → Strong)
- [x] Confirm password matching validation
- [x] Email session login with Appwrite
- [x] Protected routes — unauthenticated users redirected to login
- [x] Guest route protection — logged-in users can't revisit login/signup
- [x] Persistent auth state via Zustand + localStorage
- [x] Auto-login after account creation

### UI & Design System
- [x] Premium dark-mode-first design with custom color tokens
- [x] Light mode support with full theme toggle (Moon/Sun joined pill button)
- [x] Glassmorphism cards with violet accent borders
- [x] Responsive layout — desktop, tablet, mobile breakpoints
- [x] Custom Geist Variable font via `@fontsource-variable`
- [x] Violet-to-cyan gradient branding throughout
- [x] Custom scrollbar (thin, violet-tinted)
- [x] Animated password strength bar (red → orange → yellow → green)
- [x] Toast notifications (success, error, warning) via Sonner

### Navigation & Layout
- [x] Sticky top navbar with logo, search bar (Ctrl+K badge), notification bell, theme toggle, and user avatar
- [x] Collapsible left sidebar (240px expanded → 56px icon-only)
- [x] Sidebar with grouped navigation: Dashboard, Todos, Articles, Analytics, Profile, Settings
- [x] Collapsible Todos sub-menu with priority filters (High/Medium/Low/By Date)
- [x] Active route highlighting in sidebar
- [x] Shadcn Sidebar with tooltip support when collapsed
- [x] Upgrade to Pro banner card in sidebar footer
- [x] User mini-profile with avatar initials in sidebar footer
- [x] AppShell layout — Navbar + Sidebar + Outlet (shared across all authenticated pages)

### Dashboard
- [x] Time-based greeting ("Good morning/afternoon/evening, [Name] 👋")
- [x] Today's date formatted (e.g. "Monday, April 9, 2026")
- [x] Stat cards — Total Todos, Completed, Pending, Total Articles
- [x] Real data from Appwrite via TanStack Query
- [x] Loading skeleton states on stat cards
- [x] Recent Todos list (last 4, with priority badge and checkbox)
- [x] Recent Articles list (last 3, with status badge and date)
- [x] Download Report and Create New Task buttons

### Data Layer
- [x] TanStack Query v5 for all server state
- [x] `useTodos` — fetch, create, update, toggle, delete
- [x] `useArticles` — fetch, create, update, delete
- [x] Cache invalidation after every mutation
- [x] `staleTime` of 5 minutes to prevent over-fetching
- [x] Zustand auth store with `persist` middleware
- [x] Zustand theme store with `persist` middleware
- [x] Clean separation: API layer → Hook layer → Page layer → Component layer

### Pages Built
- [x] Login page — split screen, glassmorphism form, OAuth buttons placeholder
- [x] Signup page — split screen, feature cards with hover animation, password strength
- [x] Dashboard page — stat cards + recent todos/articles
- [x] Placeholder pages for Todos, Articles, Analytics, Profile, Settings

---

## 🚀 Roadmap / Coming Soon

### Phase 1 — Core Features (In Progress)
- [ ] **Create Todo modal** — Title, description, priority buttons, due date picker, tags chips, subtasks with `useFieldArray`
- [ ] **All Todos page** — Full list with filter tabs (All, Active, Completed, High Priority, Due Today)
- [ ] **Edit Todo** — Pre-filled form, destructive delete option
- [ ] **Todo completion toggle** — Animated checkbox with strikethrough
- [ ] **Completed Todos page** — With restore option and "Clear all" button
- [ ] **Pending Todos page** — Todos where `completed = false`

### Phase 2 — Articles
- [ ] **Create Article page** — Tiptap rich text editor with full toolbar
- [ ] **All Articles page** — Grid view with cover image, status badge, read time
- [ ] **Article read view** — Clean typeset reading layout with Table of Contents
- [ ] **Draft Articles page** — With word count progress and "Continue editing" CTA
- [ ] **Cover image upload** — Appwrite Storage integration
- [ ] **SEO preview** — Meta title and description fields

### Phase 3 — Analytics
- [ ] **Analytics page** — KPI cards, line chart (tasks over time), bar chart (articles per month)
- [ ] **Activity heatmap** — GitHub-style contribution graph in violet
- [ ] **Donut chart** — Todos by priority
- [ ] **Top articles by views** — Ranked list

### Phase 4 — User & Settings
- [ ] **Profile page** — Avatar upload, stats grid, activity timeline, articles tab
- [ ] **Settings page** — Account, Appearance, Notifications, Integrations, Danger Zone
- [ ] **Account deletion** — With confirmation modal
- [ ] **Notification panel** — Slide-in drawer with read/unread states

### Phase 5 — Polish & Launch
- [ ] **⌘K Command palette** — Full-screen search overlay
- [ ] **Framer Motion animations** — Page transitions, modal entrances, checkbox springs
- [ ] **Real OAuth** — Google and GitHub login via Appwrite OAuth2
- [ ] **PDF report download** — Export todos and articles summary
- [ ] **Pricing page** — Pro plan upgrade flow
- [ ] **Mobile bottom tab bar** — 5 icons for mobile navigation
- [ ] **Deploy to Vercel** — Production deployment with environment variables

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19 | UI library |
| [TypeScript](https://typescriptlang.org) | 5.9 | Type safety |
| [Vite](https://vitejs.dev) | 8.0 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4.2 | Utility-first styling |
| [Shadcn/ui](https://ui.shadcn.com) | Latest | Pre-built accessible components |
| [Lucide React](https://lucide.dev) | Latest | Icon library |
| [Geist Font](https://vercel.com/font) | Variable | Typography |

### State & Data
| Technology | Version | Purpose |
|---|---|---|
| [TanStack Query](https://tanstack.com/query) | 5 | Server state management & caching |
| [Zustand](https://zustand-demo.pmnd.rs) | 5 | Client state (auth, theme) |
| [React Hook Form](https://react-hook-form.com) | 7 | Form state & validation |
| [React Router DOM](https://reactrouter.com) | 7 | Client-side routing |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [Appwrite](https://appwrite.io) | 23 | Auth, Database, Storage |

### Editors & Media
| Technology | Purpose |
|---|---|
| [Tiptap](https://tiptap.dev) | Rich text editor for articles |
| [Recharts](https://recharts.org) | Charts for analytics dashboard |
| [Sonner](https://sonner.emilkowal.ski) | Toast notifications |
| [Framer Motion](https://www.framer.com/motion) | Animations (planned) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `>= 20.0.0`
- **npm** `>= 10.0.0`
- An **Appwrite** account at [cloud.appwrite.io](https://cloud.appwrite.io)

### 1. Clone the Repository

```bash
git clone https://github.com/govindsha7630/NovaDash.git
cd NovaDash
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Appwrite

1. Create a new project at [cloud.appwrite.io](https://cloud.appwrite.io)
2. Add a **Web Platform** with hostname `localhost`
3. Create a **Database** named `novadash-db`
4. Create two **Tables** inside the database:

**`todos` collection(table) attributes:**

| Attribute | Type | Required | Default |
|---|---|---|---|
| `title` | Text | ✅ | — |
| `description` | Text | ❌ | — |
| `completed` | Boolean | ❌ | `false` |
| `priority` | Text | ❌ | `medium` |
| `dueDate` | DateTime | ❌ | — |
| `userId` | Text | ✅ | — |
| `tags` | Text[] | ❌ | — |

**`articles` collection(table) attributes:**

| Attribute | Type | Required | Default |
|---|---|---|---|
| `title` | Text | ✅ | — |
| `content` | Text | ✅ | — |
| `excerpt` | Text | ❌ | — |
| `coverImage` | Text | ❌ | — |
| `status` | Text | ❌ | `draft` |
| `userId` | Text | ✅ | — |
| `tags` | Text[] | ❌ | — |

5. Set **Permissions** on both collections:

| Role | Create | Read | Update | Delete |
|---|---|---|---|---|
| `Any` | ❌ | ✅ | ❌ | ❌ |
| `Users` | ✅ | ✅ | ✅ | ✅ |

6. Create a **Storage Bucket** named `novadash-files` with the same permissions

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_APPWRITE_URL=https://sgp.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_COLLECTION_TODOS=your_todos_collection_id_here
VITE_APPWRITE_COLLECTION_ARTICLES=your_articles_collection_id_here
VITE_APPWRITE_BUCKET_ID=your_bucket_id_here
```

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`. Use `.env.example` as a reference template.

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

---

## 📸 Screenshots

> Screenshots and demo GIFs will be added here as features are completed.

| Login | Signup | Dashboard |
|---|---|---|
| ![Login](https://placehold.co/400x250/080C14/7C5CFC?text=Login+Page) | ![Signup](https://placehold.co/400x250/080C14/22D3EE?text=Signup+Page) | ![Dashboard](https://placehold.co/400x250/080C14/10B981?text=Dashboard) |

| Todos | Articles | Analytics |
|---|---|---|
| ![Todos](https://placehold.co/400x250/080C14/F59E0B?text=Todos+Page) | ![Articles](https://placehold.co/400x250/080C14/6366F1?text=Articles+Page) | ![Analytics](https://placehold.co/400x250/080C14/EF4444?text=Analytics+Page) |

---

## 📁 Project Structure

```
src/
├── appwrite/
│   ├── config.ts          # Appwrite client instance
│   ├── env.ts             # Environment variable access
│   ├── auth.ts            # Auth service (login, signup, logout)
│   ├── todos.ts           # Todos API layer (raw Appwrite calls)
│   ├── articles.ts        # Articles API layer
│   └── storage.ts         # File upload/view/delete
│
├── hooks/
│   ├── useTodos.ts        # TanStack Query hooks for todos
│   └── useArticles.ts     # TanStack Query hooks for articles
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── todos/
│   │   ├── TodosPage.tsx
│   │   └── CreateTodoPage.tsx
│   └── articles/
│       ├── ArticlesPage.tsx
│       └── CreateArticlePage.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── AppShell.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   └── StatCard.tsx
│   └── ui/                # Shadcn auto-generated components
|   |
|   └──AppSidebar.tsx
│
├── store/
│   ├── authStore.ts       # Zustand auth state
│   └── themeStore.ts      # Zustand theme state
│
├── types/
│   └── index.ts           # TypeScript interfaces
│
└── styles/
    └── index.css          # Global styles & CSS variables
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

### Steps

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/TaskFlow.git
   ```
3. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following the code style and architecture patterns
5. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add todo completion animation"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** against the `main` branch

### Contribution Guidelines

- Follow the **layer architecture**: API → Hook → Page → Component. Never skip layers.
- Use **TypeScript** for all new files — no `any` types
- Use **Tailwind classes** over inline styles where possible
- Follow existing **naming conventions**: hooks start with `use`, pages end with `Page`
- Keep components **single responsibility** — one job per component
- Add **error handling** to every async function
- Test your changes locally before submitting a PR

### What to Contribute

- 🐛 Bug fixes
- ✨ New features from the roadmap
- 🎨 UI improvements and animations
- 📝 Documentation improvements
- ♿ Accessibility improvements
- ⚡ Performance optimizations

---

## 🏗 Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| Backend | Appwrite | Open source, self-hostable, generous free tier |
| State (server) | TanStack Query | Caching, deduplication, background refetch |
| State (client) | Zustand | Simpler than Redux, same power |
| UI Components | Shadcn/ui | Accessible, customizable, Radix-based |
| Forms | React Hook Form | Performance, validation, TypeScript support |
| Styling | Tailwind v4 | Utility-first, Vite plugin, no PostCSS config |
| Font | Geist Variable | Modern, professional, same as Vercel/Linear |

---

## ⚠️ Known Issues

- Tailwind v4 border color utilities require explicit `border-solid` in some cases
- Shadcn Sidebar collapsed icon alignment needs CSS overrides for perfect centering
- TinyMCE analytics requests blocked by ad blockers (cosmetic only, editor still works)
- Appwrite `getFilePreview` unavailable on free plan — use `getFileView` instead

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Govind Sharma

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgements

- [Shadcn/ui](https://ui.shadcn.com) — for the incredible component library
- [Appwrite](https://appwrite.io) — for the open-source backend platform
- [Vercel](https://vercel.com) — for the Geist font
- [Lucide](https://lucide.dev) — for the beautiful icon set
- [TanStack](https://tanstack.com) — for TanStack Query

---

<div align="center">

Made with ❤️ by [Govind Kumar](https://github.com/govindsha7630)

⭐ Star this repo if you find it useful!

</div>