# HSM Monorepo

This repo is a monorepo with:
- `frontend/` (Next.js)
- `backend/` (NestJS)

## Prereqs
- Node.js 20+ (you have Node 22)

## Install
```bash
npm install
```

## Run
```bash
npm run dev:frontend
npm run dev:backend
```

## All-in-one
```bash
npm run dev:all
```

## Env
- Frontend: `frontend/.env.example`
- Backend: `backend/.env.example` (SQLite file path via `DATABASE_URL`)

## Backend DB (Prisma)
When you drop your existing SQLite database file into `backend/db/shop.db`:
```bash
cp backend/.env.example backend/.env
npm run -w backend db:pull
```
