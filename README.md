# Yuva Sena Digital Platform

Production-ready digital wing of Yuva Sena, built as a unified **TypeScript Monorepo** featuring:
- **Backend API Gateway**: NestJS service layer with PostgreSQL and Redis.
- **Responsive Web Portal**: Next.js (SEO-optimized) student enrollment portal.
- **Admin Dashboard Console**: Vite + React analytics table for approving cards and ticket assignments.
- **iOS & Android Application**: React Native (Expo) app for digital membership, QR scanner, and offline support.

---

## 🏗️ System Architecture

```text
yuvasena/
├── package.json               # Monorepo workspaces definition
├── docker-compose.yml         # Container orchestrator
├── apps/
│   ├── backend/               # NestJS API, Prisma configuration, Swagger UI
│   ├── web/                   # Next.js web app (Membership enrollment)
│   ├── admin/                 # Vite + React Admin dashboard + analytics
│   └── mobile/                # React Native Expo app (iOS & Android)
└── packages/
    └── shared/                # Zod schemas, models, and type definitions
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: `v20.x` or `v24.x` (with npm 10+)
- **Docker**: For running PostgreSQL database and Redis cache
- **Expo Go App**: To run and inspect the mobile app on physical phones (Android/iOS)

---

### Step 1: Install Dependencies
From the root directory, run the workspace installer:
```bash
npm install --legacy-peer-deps
```

### Step 2: Database Configuration
1. Copy `.env.example` to `.env` in the root:
   ```bash
   cp .env.example .env
   ```
2. Start PostgreSQL and Redis containers:
   ```bash
   docker compose up -d db redis
   ```

### Step 3: Run Database Migrations & Seeding
Deploy database schemas and seed initial data:
```bash
# Generate Prisma Client
npm run prisma:generate -w apps/backend

# Run migration dev
npx prisma migrate dev --schema=apps/backend/prisma/schema.prisma --name init

# Seed District structure and default Super Admin
npm run prisma:seed -w apps/backend
```

**Default Administrator Account:**
* **Email:** `admin@yuvasena.org`
* **Password:** `Admin@123`

**Default Member Account:**
* **Phone:** `9876543210`
* **OTP verification code:** `123456`

---

### Step 4: Run Services
Start the development engines simultaneously:

```bash
# 1. Start Backend API (http://localhost:4000)
# Swagger documentation live on: http://localhost:4000/api/docs
npm run backend:dev

# 2. Start Web Portal (http://localhost:8000)
npm run web:dev

# 3. Start Admin Dashboard (http://localhost:3000)
npm run admin:dev

# 4. Start Mobile Metro bundler
npm run mobile:dev
```

---

## 🐳 Docker Production Deployment

To package and run the entire ecosystem (DB, Redis, Backend, Web Portal, Admin Dashboard) in a production setup, execute:
```bash
docker compose up --build
```
- **Web Portal** will serve on: `http://localhost:8000`
- **Admin Dashboard** will serve on: `http://localhost:3000`
- **NestJS REST API** will serve on: `http://localhost:4000/api/v1`

---

## ⚙️ Mobile Application Compilation
To compile standard standalone files:
- **Android**: To build a development APK or release AAB:
  ```bash
  cd apps/mobile
  npx ea build --platform android
  ```
- **iOS**: Cloud IPA builds (EAS builds from Windows):
  ```bash
  cd apps/mobile
  npx eas build --platform ios
  ```
