# TitleIQ

**TitleIQ** is an AI-powered YouTube title and thumbnail optimization platform that helps creators maximize their Click-Through Rate (CTR) before every upload.

## Features

- **Live CTR Score Analyzer** — Instantly scores your title across 4 dimensions: Curiosity Gap, Keyword Strength, Emotional Pull, and Title Length.
- **Keyword Gap Fixer** *(Pro)* — Identifies missing high-value keywords and rewrites your title to include them.
- **CTR Simulator** *(Pro)* — Places your title against 4 real competitor titles in a simulated YouTube feed and predicts which one a viewer would click.
- **Thumbnail Analyzer** — AI vision analysis of your thumbnail for text readability, face impact, color contrast, and clutter score.
- **Analysis History** — View and revisit all past title and thumbnail analyses.
- **A/B Compare** — Side-by-side comparison of two past analyses to find which performs better.
- **Email OTP Authentication** — Passwordless login via one-time codes.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | Neon (PostgreSQL) |
| AI | Groq (Llama 3.3 70B + Llama Vision) |
| Payments | Razorpay |
| Email | Resend |
| Security | Helmet, JWT, HttpOnly Cookies |

## Project Structure

```
TitleIQ/
├── client/          # React frontend (Vite)
├── server/          # Express backend
│   ├── src/
│   │   ├── routes/      # API route handlers
│   │   ├── services/    # AI, auth, email services
│   │   ├── middleware/  # Auth, rate limiting, error handling
│   │   ├── prompts/     # AI prompt builders
│   │   ├── db/          # Database client & schema
│   │   └── data/        # Static competitor title data
├── shared/          # Shared TypeScript types (used by both client & server)
└── .env             # Environment variables (never commit this)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Groq](https://console.groq.com) API key
- A [Resend](https://resend.com) API key
- A [Razorpay](https://razorpay.com) account (test keys for development)

### Installation

```bash
# Install all dependencies from the root
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# AI
GROQ_API_KEY=your_groq_api_key

# Database
DATABASE_URL=your_neon_postgresql_url

# Authentication
JWT_SECRET=your_strong_secret_key

# Email
RESEND_API_KEY=your_resend_api_key

# Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Frontend (Vite)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# Admin
ADMIN_SECRET=your_admin_secret

# Server
PORT=3000
NODE_ENV=development
```

### Database Setup

Run the migration to create all required tables:

```bash
cd server
npx tsx src/db/migrate.ts
```

### Development

```bash
# Start the backend (from /server)
npm run dev

# Start the frontend (from /client)
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API requests to `http://localhost:3000`.

## Deployment

- **Backend** → [Railway](https://railway.app) — Set root directory to `server`, build command `npm run build`, start command `node dist/index.js`.
- **Frontend** → [Vercel](https://vercel.com) — Set root directory to `client`, framework preset Vite.

After deployment, set `CLIENT_URL` in Railway to your Vercel URL.

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | ₹0 | 10 title analyses/day, Thumbnail analyzer |
| Pro | ₹99/month | Everything + Keyword Gap Fixer, CTR Simulator, Unlimited analyses |

## License

MIT
