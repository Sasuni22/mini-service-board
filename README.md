# ServiceBoard — Mini Service Request Board

A full-stack web app where homeowners post service requests and tradespeople manage them.

Built with **Next.js 14**, **Express** and **MongoDB** 

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Testing | Jest + Supertest |

---

## Features

- Homeowners can post, edit and delete their own jobs
- Tradespeople can browse jobs and update job status
- Role-based access control enforced at the API level
- Keyword search with category and status filtering
- Auto-save draft on the new job form
- Toast notifications, loading skeletons and empty states
- 10 unit tests covering all API endpoints

---

## Setup


### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

---

## Environment Variables

**`backend/.env`**
