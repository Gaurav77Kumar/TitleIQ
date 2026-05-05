<div align="center">

<img src="https://img.shields.io/badge/TitleIQ-CTR%20Optimizer-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="TitleIQ"/>

# TitleIQ 🎯

**AI-powered YouTube title & thumbnail optimization — maximize your CTR before every upload.**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Deployment](#-deployment) · [Pricing](#-pricing)

</div>

---

## 🚀 What is TitleIQ?

TitleIQ helps YouTube creators stop guessing and start optimizing. Paste your video title and thumbnail — and in seconds you get an AI-powered breakdown of your Click-Through Rate potential, with actionable rewrites and real competitor simulations.

---

## ✨ Features

### 🆓 Free Tier

| Feature | Description |
|---|---|
| **Live CTR Score Analyzer** | Instantly scores your title across 4 dimensions: Curiosity Gap, Keyword Strength, Emotional Pull, and Title Length |
| **Thumbnail Analyzer** | AI vision analysis for text readability, face impact, color contrast, and clutter score |
| **Analysis History** | View and revisit all your past title and thumbnail analyses |
| **A/B Compare** | Side-by-side comparison of two past analyses to identify the stronger performer |

### ⚡ Pro Tier

| Feature | Description |
|---|---|
| **Keyword Gap Fixer** | Identifies missing high-value keywords and auto-rewrites your title to include them |
| **CTR Simulator** | Places your title against 4 real competitor titles in a simulated YouTube feed and predicts viewer click behavior |
| **Unlimited Analyses** | No daily cap — analyze as many titles as you need |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | Neon (PostgreSQL) |
| **AI** | Groq — Llama 3.3 70B + Llama Vision |
| **Payments** | Razorpay |
| **Email** | Resend |
| **Security** | Helmet, JWT, HttpOnly Cookies |

---

## 📁 Project Structure

```
TitleIQ/
├── client/                  # React frontend (Vite)
├── server/
│   └── src/
│       ├── routes/          # API route handlers
│       ├── services/        # AI, auth, and email services
│       ├── middleware/      # Auth, rate limiting, error handling
│       ├── prompts/         # AI prompt builders
│       ├── db/              # Database client & schema
│       └── data/            # Static competitor title data
├── shared/                  # Shared TypeScript types (client + server)
└── .env                     # Environment variables — never commit this!
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** 18+
- [Neon](https://neon.tech) PostgreSQL database
- [Groq](https://console.groq.com) API key
- [Resend](https://resend.com) API key
- [Razorpay](https://razorpay.com) account *(test keys work for local dev)*

### 1. Clone & Install

```bash
git clone https://github.com/Gaurav77Kumar/TitleIQ.git
cd TitleIQ
npm install        # installs dependencies for all workspaces
```

### 2. Configure Environment Variables

Create a `.env` file in the **root directory**:

```env
# ── AI ─────────────────────────────────────────
GROQ_API_KEY=your_groq_api_key

# ── Database ────────────────────────────────────
DATABASE_URL=your_neon_postgresql_url

# ── Authentication ──────────────────────────────
JWT_SECRET=your_strong_secret_key          # min 32 characters recommended

# ── Email ───────────────────────────────────────
RESEND_API_KEY=your_resend_api_key

# ── Payments ────────────────────────────────────
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id  # exposed to the frontend via Vite



# ── Server ──────────────────────────────────────
PORT=3000
NODE_ENV=development
```

> ⚠️ **Never commit `.env` to version control.** It's already in `.gitignore`.

### 3. Run Database Migrations

```bash
cd server
npx tsx src/db/migrate.ts
```

### 4. Start Development Servers

```bash
# Backend  (runs on http://localhost:3000)
cd server && npm run dev

# Frontend (runs on http://localhost:5173, proxies API → :3000)
cd client && npm run dev
```

---

## ☁️ Deployment

### Backend → [Railway](https://railway.app)

| Setting | Value |
|---|---|
| Root directory | `server` |
| Build command | `npm run build` |
| Start command | `node dist/index.js` |

After deploy, set the `CLIENT_URL` environment variable in Railway to your Vercel frontend URL.

### Frontend → [Vercel](https://vercel.com)

| Setting | Value |
|---|---|
| Root directory | `client` |
| Framework preset | Vite |

Add all `VITE_*` environment variables in the Vercel dashboard.

---

## 💳 Pricing

| Plan | Price | Analyses | Features |
|---|---|---|---|
| **Free** | ₹0/mo | 10/day | CTR Analyzer, Thumbnail Analyzer, History, A/B Compare |
| **Pro** | ₹99/mo | Unlimited | Everything in Free + Keyword Gap Fixer + CTR Simulator |

---

## 🔐 Security

- Passwordless login via **Email OTP** (no passwords stored)
- Auth tokens stored in **HttpOnly Cookies** (XSS-safe)
- **Helmet.js** for HTTP security headers
- **Rate limiting** on all API routes
- JWT-signed sessions

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

[MIT](LICENSE) © 2025 TitleIQ
