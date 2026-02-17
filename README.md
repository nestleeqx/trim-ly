This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deleted Links Cleanup

Deleted links use soft delete (`deletedAt`) so they can be restored.
Non-restored links are automatically purged by cron.

- Endpoint: `/api/cron/links-purge`
- Schedule: daily at `03:00` (configured in `vercel.json`)
- Retention: `30` days by default

Optional environment variables:

- `LINK_SOFT_DELETE_RETENTION_DAYS=30`
- `CRON_SECRET=your_secret` (if set, send `Authorization: Bearer your_secret`)

Manual local run example:

```bash
curl -X POST http://localhost:3000/api/cron/links-purge \
  -H "Authorization: Bearer your_secret"
```

## Local Database (when VPN is unavailable)

If your remote Postgres is not reachable (for example, only HTTP proxy is available), run local Postgres in Docker for Prisma CLI (`migrate`, `studio`, `seed`).

1. Start local DB:

```bash
npm run db:up
```

2. Use local connection in `.env.local` / `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trimly?schema=public"
```

3. Keep `PRISMA_DATABASE_URL` (Accelerate) for app runtime if needed.

4. Run Prisma commands:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run prisma:studio
```

5. Stop local DB:

```bash
npm run db:down
```
