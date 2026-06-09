# Deploy Nomad to GitHub + Vercel

## 1. Push to GitHub

From the project root (`Nomad - Files`):

```bash
git init
git add .
git commit -m "Initial Nomad PWA"
gh repo create nomad --public --source=. --push
```

Or create the repo manually on [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/nomad.git
git branch -M main
git push -u origin main
```

## 2. Connect Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** and select your GitHub repo
3. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `nomad` ← important |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

4. Add **Environment Variables** (same as your `.env`):

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_APP_URL` | Your Vercel URL (e.g. `https://nomad-xxx.vercel.app`) |

5. Click **Deploy**

## 3. Update Supabase for production auth

After the first deploy, copy your Vercel URL, then in Supabase:

**Authentication → URL Configuration**

- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: add:
  - `https://your-app.vercel.app/**`
  - `https://your-app.vercel.app/reset-password`

Update `VITE_APP_URL` in Vercel env vars to match, then **Redeploy**.

## 4. Auto-deploy on every push

Once connected, every `git push` to `main` triggers a new Vercel deployment automatically.

## Troubleshooting

- **404 on refresh** — `vercel.json` rewrites are included; ensure Root Directory is `nomad`
- **Supabase not connecting** — confirm env vars are set in Vercel (not just local `.env`)
- **Auth redirect fails** — Site URL and Redirect URLs in Supabase must match your Vercel domain
