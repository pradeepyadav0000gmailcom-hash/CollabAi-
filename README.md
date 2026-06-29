# 🤖 CollabAI — Production Deployment Guide

Crowdsourced AI development platform. Tasks karo → Credits kamao → Cash lo.

---

## 🚀 Deploy Kaise Karo (Step by Step)

### Step 1: Supabase Setup (Free Database)

1. **[supabase.com](https://supabase.com)** pe jao → New Project banao
2. Project ban jaane ke baad **SQL Editor** kholo
3. `supabase-schema.sql` file ka poora content copy karo aur run karo
4. **Settings → API** mein jao:
   - `Project URL` copy karo
   - `anon public` key copy karo

### Step 2: Environment Variables

```bash
# .env.example ko copy karo
cp .env.example .env.local

# Apni values daalo
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 3: Local Test Karo

```bash
npm install
npm run dev
# http://localhost:3000 pe dekho
```

### Step 4: Vercel Pe Deploy Karo

1. [vercel.com](https://vercel.com) pe GitHub se login karo
2. **New Project** → GitHub repo upload karo
3. **Environment Variables** mein wahi values daalo jo `.env.local` mein hain
4. **Deploy** dabao — bas! 🎉

Live URL milega jaise: `https://collabai.vercel.app`

---

## 📁 Project Structure

```
collabai/
├── pages/
│   ├── index.js          # Landing page
│   ├── dashboard.js      # User dashboard
│   ├── leaderboard.js    # Top contributors
│   ├── wallet.js         # Credits & withdrawal
│   ├── tasks/
│   │   ├── index.js      # All tasks listing
│   │   └── [id].js       # Individual task page
│   └── auth/
│       ├── login.js
│       └── register.js
├── components/
│   ├── Navbar.js
│   └── Toast.js
├── lib/
│   ├── supabase.js       # DB client
│   ├── AuthContext.js    # Auth provider
│   └── tasks.js          # Tasks data & helpers
├── styles/
│   └── globals.css
├── supabase-schema.sql   # Database setup
└── vercel.json           # Deployment config
```

---

## 💡 Features

| Feature | Status |
|---------|--------|
| User Registration/Login | ✅ |
| 8 Types ke AI Tasks | ✅ |
| Credits System | ✅ |
| Auto-Withdrawal (500 credits) | ✅ |
| Leaderboard | ✅ |
| UPI Withdrawal Request | ✅ |
| Responsive (Mobile) | ✅ |
| Dark Mode | ✅ |

---

## 🔧 Aur Tasks Add Karne Ke Liye

`lib/tasks.js` mein `TASKS` array mein nayi entry daalo:

```js
{
  id: 'task_009',
  title: 'Naya Task',
  type: 'DATA_LABELING',      // TASK_TYPES mein se choose karo
  difficulty: 'Beginner',     // Beginner / Intermediate / Advanced
  credits: 25,
  time: '30 min',
  description: 'Task description...',
  instructions: ['Step 1', 'Step 2'],
  sample_input: 'Example input...',
  sample_output: 'Expected output...',
  fields: [
    { type: 'textarea', label: 'Your Answer', placeholder: 'Likho yahan...' }
  ]
}
```

---

## 💰 Credits to Cash Rate

- 1 Credit ≈ ₹2.50 estimated
- 500 Credits = ₹1,250 minimum payout
- UPI transfer jab company profitable ho

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deploy**: Vercel (Mumbai region)
- **Icons**: Emoji-based (no extra dependency)

---

Made with 🤖 for Indian contributors
