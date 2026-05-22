# Blog-JS

A modern, full-stack blog platform built using **Next.js 15 (App Router)**, featuring a public-facing website and a secure administrative dashboard.

## 🚀 Key Features

- **Public Blog**: Interactive interface for browsing, searching, and reading blog posts.
- **Admin Dashboard**: Secure management system for posts, user accounts, messages, subscribers, and social links.
- **Service Layer Architecture**: Clean separation of concerns with domain logic encapsulated in a dedicated service layer.
- **Robust Authentication**: Session-based authentication with NextAuth.js, augmented with custom user roles.
- **Data Validation & Sanitization**: Seamless validation with Zod and sanitization via Isomorphic DOMPurify to prevent XSS.
- **Comprehensive Test Suite**: Over 110 unit and integration tests using Vitest and React Testing Library.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Database ORM**: Prisma Client
- **Database**: PostgreSQL (Dockerized for local development)
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Styling**: CSS Modules
- **Testing**: Vitest & React Testing Library
- **Local Dev Tooling**: Docker, Bash scripts

---

## 📁 Directory Structure

```text
├── app/                  # Next.js App Router pages and layouts
│   ├── (public)/         # Route group for all public-facing pages (e.g., blog, home)
│   ├── admin/            # Route group for the admin dashboard (protected by middleware)
│   ├── actions/          # Next.js Server Actions for data mutations (admin.ts, public.ts)
│   └── login/            # Authentication login route
├── components/           # Reusable React components
│   ├── admin/            # Components specific to the admin interface
│   ├── public/           # Components specific to the public interface
│   └── ui/               # Shared, generic UI components (Button, Input, Card)
├── lib/                  # Core configuration and business logic
│   ├── services/         # Service layer housing domain-specific business logic (postService, etc.)
│   ├── auth.ts           # NextAuth.js configuration
│   └── prisma.ts         # Prisma client initialization
├── prisma/               # Database schema and seed scripts
│   ├── schema.prisma     # The central database schema definition
│   └── seed.js           # Database seed script
├── scripts/              # Utility scripts for development
│   ├── dev.sh            # Local dev runner (starts Postgres in Docker, runs db push, runs dev server)
│   └── sync-db.sh        # Database sync runner
└── vitest.setup.ts       # Test environment and component mock configuration
```

---

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v20+ recommended)
- **Docker** and **Docker Compose**
- **npm** (or your preferred package manager)

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Environment**:
   Run the local development runner script which spins up the PostgreSQL Docker container, synchronizes schemas, and starts the Next.js dev server:
   ```bash
   npm run dev:local
   ```
   *Note: This executes `./scripts/dev.sh` under the hood.*

3. **Synchronize Database**:
   If you need to manually synchronize database schema migrations or state:
   ```bash
   npm run db:sync
   ```

### Running Tests

The codebase includes an extensive suite of unit and integration tests covering server actions, service layers, components, and routing pages.

To execute tests via Vitest:
```bash
npm run test
```

---

## 🏗️ Architecture & Development Guidelines

- **Service Layer Pattern**: Avoid placing heavy business logic directly inside Server Actions or page components. Encapsulate business rules inside `lib/services/`. Server actions should handle routing, request parsing, and Zod validations before passing sanitized data to the services.
- **Form Validation**: Always define and validate schema types with **Zod** at boundaries (such as Server Actions) before initiating database calls or passing payloads to domain services.
- **Authentication**: NextAuth handles user session state. Secure routes under `/admin/` are automatically protected via `middleware.ts`.
- **Database Modifications**: When updating schemas:
  1. Modify `prisma/schema.prisma`.
  2. Sync your local database: `npx prisma db push`.
  3. Ensure types are generated: `npx prisma generate` (automatically handled during `postinstall`).
- **Styling**: Styled using CSS Modules (`*.module.css`) to prevent global style leakage. Keep generic, reusable elements inside `components/ui/`.
