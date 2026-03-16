# Processe Fish — Local setup

Quick steps to get the site running locally and connect frontend ⇄ backend.

1) Copy env

```bash
cp .env.example .env
# edit .env and set ADMIN_SECRET, DATABASE_URL, SMTP creds (optional)
```

2) Install dependencies

```bash
pnpm install
```

3) Setup database (SQLite) and Prisma

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts   # optional: seed sample data
```

4) Run dev server

```bash
pnpm dev
```

5) Test order flow

- Browse `http://localhost:3000` and add products to cart.
- Checkout to POST `/api/orders` (site does this).
- Admin UI: `http://localhost:3000/admin` (requires login at `/admin/login`).

Notes
- Admin login uses `ADMIN_SECRET` from env. The middleware checks a cookie named `admin_token`.
- Order notifications use SMTP if `SMTP_*` and `ADMIN_EMAIL` are configured; otherwise they are skipped.
- If your backend runs on another host, set `NEXT_PUBLIC_APP_URL` accordingly.

If you want, I can:
- Add an "unseen new orders" badge in the admin list (requires DB field + migration).
- Add webhook (Slack/Telegram) notifications instead of email.
