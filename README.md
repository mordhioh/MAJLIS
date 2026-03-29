# Majlis Kesyukuran dan Doa Selamat — RSVP App

A simple, elegant RSVP web app for a family event built with **React + Vite + Supabase**.

## 🚀 Quick Setup

### 1. Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run:

```sql
CREATE TABLE rsvps_simple (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  attending BOOLEAN NOT NULL,
  pax INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable public insert/read (no auth required)
ALTER TABLE rsvps_simple ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON rsvps_simple
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public select" ON rsvps_simple
  FOR SELECT TO anon
  USING (true);
```

3. Go to **Settings → API** and copy:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **Anon public key**

### 2. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Locally

```bash
npm install
npm run dev
```

- **Guest page**: `http://localhost:5173/`
- **Admin dashboard**: `http://localhost:5173/admin`

### 4. Update Event Details

Edit `src/config.js` to update:
- Event date, time, venue
- Google Maps link
- Aturcara / programme

## 📦 Deploy to Vercel

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — done!

## 📋 Pages

| Route    | Description                      |
| -------- | -------------------------------- |
| `/`      | Guest invitation & RSVP form     |
| `/admin` | Dashboard with attendance stats  |
