# Backend Setup – Processe Fish

This project uses **Next.js API routes** and **Prisma** with **SQLite** for the database.

## 1. Install dependencies

```bash
npm install
```

## 2. Database setup

Create a `.env` in the project root (or copy from `.env.example`):

```env
DATABASE_URL="file:./dev.db"
```

Generate the Prisma client and create the database:

```bash
npm run db:generate
npm run db:push
```

Seed the database with categories, products, and testimonials:

```bash
npm run db:seed
```

## 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The homepage will load products, categories, and testimonials from the database. If the DB is empty, the site falls back to built-in sample data.

---

## Database schema (Prisma)

| Model | Purpose |
|-------|--------|
| **Category** | Product categories (Frozen Fish, Dried Fish, etc.) |
| **Product** | Fish products with price, weights, badges, ratings |
| **Order** | Customer orders with items |
| **OrderItem** | Line items (product, weight, quantity, price) |
| **Contact** | Contact form submissions |
| **NewsletterSubscriber** | Newsletter signups |
| **Testimonial** | Customer reviews |

## API routes

| Method | Route | Description |
|--------|--------|-------------|
| GET | `/api/products` | List products (optional: `?category=slug`, `?featured=true`, `?onSale=true`) |
| POST | `/api/products` | Create product (body: name, categoryId, image, weights, price, ...) |
| GET | `/api/products/[id]` | Get one product |
| PUT | `/api/products/[id]` | Update product |
| DELETE | `/api/products/[id]` | Delete product |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| GET | `/api/categories/[id]` | Get one category |
| POST | `/api/orders` | Create order (body: customerName, email, phone, address, items, total) |
| GET | `/api/orders/[id]` | Get order by id or orderNumber (e.g. PF-2026-00001) |
| POST | `/api/contact` | Submit contact form (name, email, message, ...) |
| POST | `/api/newsletter` | Subscribe email |
| GET | `/api/testimonials` | List approved testimonials |
| POST | `/api/testimonials` | Create testimonial |

## Optional: Prisma Studio

To view and edit data in a UI:

```bash
npm run db:studio
```

## Optional: PostgreSQL

For production, switch to PostgreSQL:

1. Set `DATABASE_URL` to your Postgres connection string.
2. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
3. Run `npm run db:push` again (and re-seed if needed).
