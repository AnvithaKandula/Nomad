# Nomad

An intelligent travel companion PWA that bridges your itinerary and your suitcase. Built with React, Vite, Tailwind CSS, and Supabase.

## Features

- **Trips** — Create/edit trips with location autocomplete, real destination images, and weather forecasts
- **Master Closet** — Permanent inventory you bulk-import into any trip
- **Packing List** — Smart suggestions from itinerary categories; toggle suggested-only view
- **Itinerary Discover** — Search activities with booking links, popular activities, and a trip quiz
- **Settings** — Banner themes (landmark, country flag, national flower)
- **PWA** — Installable on iOS/Android with standalone display mode

## Quick Start

```bash
cd nomad
npm install
npm run dev
```

Open http://localhost:5173 — the app runs in **demo mode** (localStorage) until Supabase is connected.

## Connect to Your Supabase Project

### Step 1: Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project (or use an existing one)
3. Wait for the database to finish provisioning

### Step 2: Run the database schema

1. In your Supabase dashboard, open **SQL Editor**
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and click **Run**

This creates tables (`trips`, `master_closet`, `trip_items`, `itinerary`, `user_settings`), RLS policies, and the smart packing trigger.

### Step 3: Get your API keys

1. In Supabase dashboard → **Project Settings** → **API**
2. Copy:
   - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - **anon public** key (safe for frontend)

### Step 4: Configure environment variables

Create a `.env` file in the `nomad` folder:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Restart the dev server after creating `.env`:

```bash
npm run dev
```

### Step 5: Configure Auth redirect URLs (for password reset)

In Supabase → **Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:5173` (or your production URL)
- **Redirect URLs**: add `http://localhost:5173/reset-password` and your production URL

### Step 6: Connect the Cursor Supabase plugin to this project

The Supabase plugin in Cursor uses OAuth to link your account:

1. Open Cursor **Settings** → ensure the Supabase plugin is enabled
2. In a Cursor chat, ask the agent to use Supabase tools — you'll be prompted to authenticate via browser
3. After auth, the MCP server can access your Supabase projects
4. To target **this specific project**, reference your project ref (the subdomain in your URL, e.g. `abcdefgh`) when asking the agent to run SQL or inspect tables

You can also link locally with the Supabase CLI:

```bash
npm install -g supabase
supabase login
cd nomad
supabase link --project-ref YOUR_PROJECT_REF
```

### Verify the connection

1. Register a new account in the app
2. Create a trip with a real destination (e.g. "Paris, France")
3. Check Supabase **Table Editor** — you should see rows in `trips`
4. Add a hiking activity in Itinerary → Discover → `trip_items` should get suggested items via the database trigger

## Weather

Weather uses the free [Open-Meteo API](https://open-meteo.com/) — no API key required. Forecasts require valid coordinates from the location autocomplete (Nominatim/OpenStreetMap).

## Build for Production (PWA)

```bash
npm run build
npm run preview
```

Deploy via **GitHub + Vercel** — see [DEPLOY.md](./DEPLOY.md) for step-by-step setup.

Quick Vercel settings: **Root Directory** = `nomad`, Framework = Vite, add `VITE_SUPABASE_*` env vars in the Vercel dashboard.

### Install on iOS

Safari → Share → **Add to Home Screen**

### Install on Android

Chrome → menu → **Install app** or **Add to Home Screen**

## Future: App Store Migration

This codebase is structured for a future [Capacitor](https://capacitorjs.com/) wrap:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init Nomad com.nomad.app --web-dir dist
npm run build && npx cap add ios && npx cap sync
```

## Project Structure

```
src/
  components/   UI components (trips, itinerary, layout)
  contexts/     Auth and Trip state
  lib/          Supabase, weather, geocoding, activities
  pages/        Route pages
supabase/
  migrations/   Database schema SQL
```
