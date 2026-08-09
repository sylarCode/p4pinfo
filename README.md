# Kindled

A social inspiration board where people follow each other and share what they’re kindled by — movies, books, restaurants, useful items, and more.

## What’s included

- **Creator-managed categories**: Movies, Books, Restaurants, Useful Items (users cannot create categories)
- **Homepage**: category chips + advanced search (category, tags, location, keyword)
- **Profiles**: each category listed with inspirations, custom tags, and optional location
- **Follow**: demo accounts can follow each other
- **Custom tags**: e.g. restaurant “The Meat Emporium” in Bali with tags `beef tallow`, `animal based diet`

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma 7 + SQLite (`better-sqlite3` adapter)

## Setup

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Use the **Viewing as** control to switch between demo users (`Maya`, `Leo`, `Noor`).
