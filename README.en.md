🌐 README available in multiple languages:

- [Русский](README.md)
- [English](README.en.md)

🔗 trim.ly — URL Shortener & Analytics

<p align="center">
	<img src="readme-assets/banner-en.png" width="1200" alt="trim.ly preview en">
</p>

`trim.ly` is a full-stack URL shortener with analytics, QR codes, subscription
plans, and a user dashboard. Built with Next.js (App Router) using PostgreSQL +
Prisma, it can serve as a production-ready SaaS foundation or a strong portfolio
project.

## 🚀 Live Demo

🔗 https://\*

The demo version allows you to explore the UI, link management logic, analytics
system, and overall SaaS architecture.

⚠️ Billing in the demo version works in simulation mode (no real payments).

## 📌 Project Overview

trim.ly is a modern URL shortening service with advanced analytics and a
subscription-based pricing system. Users can create short links, track click
statistics, manage usage limits, and generate QR codes.

The project focuses on:

- **SaaS architecture**
- **Security and scalability**
- **Clean feature-first code structure**
- **Modern UI/UX**
- **Production-oriented development approach**

## ✨ Key Features

### 🌍 Public Short Links

- **Short slug routing (app/[slug])**
- **Link states:**
    - active
    - paused
    - expired
    - deleted
- **Password-protected links 🔐**
- **Proper redirect to the target URL**
- **Click analytics collection:**
    - country
    - referrer
    - source
    - user-agent
    - device
    - timestamp

### 👤 User Dashboard

- **Create, edit, and delete links**
- **Soft delete + restore**
- **Custom alias (slug) with availability check**
- **QR code generation and download**
- **Tags, filters, sorting**
- **Bulk operations**
- **Table and card views**
- **Pagination and skeleton/loader states**

### 📊 Analytics

- **Per-link analytics:**
    - clicks over time
    - top countries
    - devices
    - traffic sources
    - raw events
    - CSV export
- **Account-level analytics:**
    - /dashboard — key metrics
    - /analytics — advanced analytics
    - top links
    - date range filters
    - breakdown sections

### 💳 Profile & Billing

- **Profile management**
- **Account security**
- **User preferences**
- **Demo billing system**
- **Plan switching**
- **Plan limits:**
    - number of links
    - number of clicks
    - usage display in sidebar and Billing section

## 🧱 Tech Stack

The project is built with a modern full-stack stack:

⚙️ Core Stack:

- Framework: **Next.js 16 (App Router)**
- UI: **React 19 + SCSS Modules**
- Language: **TypeScript**
- Database: **PostgreSQL**
- ORM: **Prisma 7**
- Authentication: **NextAuth (Credentials + OAuth Google, Yandex)**

## 🧩 Additional Libraries

- Charts: **Recharts**
- Forms & Validation: **react-hook-form + zod**
- Animations: **framer-motion**
- Email: **Resend**
- QR codes: **qrcode**
- Linting: **ESLint**

## 🔐 Environment Variables

Minimum required:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

# DB
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/trimly?schema=public
PRISMA_DATABASE_URL=

# OAuth (optional)
GOOGLE_ID=
GOOGLE_SECRET=
YANDEX_ID=
YANDEX_SECRET=

# Email
RESEND_API_KEY= EMAIL_FROM=

# Service
CRON_SECRET=
IP_HASH_SALT=
LINK_SOFT_DELETE_RETENTION_DAYS=30

# Public short link domain
NEXT_PUBLIC_SHORT_LINK_DOMAIN=localhost:3000
NEXT_PUBLIC_SHORT_LINK_PROTOCOL=http
```

## 💻 Local Development

To run the project locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/nestleeqx/trim-ly.git
    cd trim-ly
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start PostgreSQL via Docker**:
    ```bash
    npm run db:up
    npm run db:logs
    ```
    The database is available at localhost:5433 by default.
4.  **Prisma**:
    ```bash
    npm run prisma:generate
    npm run prisma:migrate
    ```
5.  **Seed pricing plans**:
    ```bash
    npm run db:seed
    ```
6.  **Start the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see
    the application.

## 🧹 Soft Delete & Cleanup

Deleted links are stored using deletedAt and can be restored.

Background cleanup endpoint: `GET/POST /api/cron/links-purge`

Authorization: `Authorization: Bearer <CRON_SECRET>` or
`x-vercel-cron: 1 (для Vercel Cron)`

## 🎨 UI & Additional Features

- **Light and dark theme support 🌗**
- **SEO/metadata configured at layout and page level**
- **Production-ready architecture**
- **Scalable structure**
- **Clean and modular codebase**

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
for details.
