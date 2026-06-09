# Deploying the Homewood Living web prototype (Vercel)

This app exports to a **static web build** that runs in any browser — including
phones. Share the Vercel URL and people can use the full app from their phone's
browser (and "Add to Home Screen" for an app-like icon). No app store needed.

> The same codebase still ships to the real App Store / Google Play later via
> EAS Build (see the bottom of this file) — the web prototype doesn't replace
> that, it just lets people play with it today.

---

## Option A — Vercel CLI (fastest, no GitHub needed)

```bash
npm i -g vercel          # one time
cd homewood-app
vercel                   # first run: links/creates a project, deploys a preview
vercel --prod            # promote to a shareable production URL
```

Vercel reads `vercel.json` automatically:
- **Build:** `expo export --platform web`
- **Output:** `dist/`
- **Env:** `EXPO_PUBLIC_BIBLE_PROVIDER=fallback` (bundled KJV), `EXPO_PUBLIC_DEVOTIONAL_PROVIDER=mock`
- **Rewrites:** all routes → `index.html` (so deep links work in the single-page app)

You'll get a URL like `https://homewood-living-xxxx.vercel.app` to send out.

## Option B — GitHub + Vercel dashboard (auto-deploy on every push)

1. Put this project on GitHub (the app lives in the `homewood-app/` subfolder).
2. In Vercel: **New Project → Import** the repo.
3. **Important:** set **Root Directory = `homewood-app`**.
4. Framework preset: **Other**. Build command and output are taken from `vercel.json`.
5. Deploy. Every `git push` now ships a new version.

## Build it locally first (optional sanity check)

```bash
cd homewood-app
npm run build:web        # produces ./dist
npx serve dist           # preview at http://localhost:3000
```

---

## What testers will experience

- ✅ Full app: welcome/login, devotionals, Verse of the Day, **40 plans with
  real day-by-day lessons**, the **bundled KJV Bible** (offline), journal,
  highlights, saved items, profile editing, settings.
- ⚠️ **Each person's data is local to their browser** (sign-in, highlights,
  notes, saved items use on-device storage). It's a prototype, not a shared
  backend — perfect for "try it and tell us what to build."
- ⚠️ **Camera/QR scanner** is limited in a browser (it's a real native feature).
  The screens still render so people can see the flow.
- 🔐 Auth is the local mock store (any email/password works). Wire up Supabase
  later by setting `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  in Vercel's Environment Variables.

## Tip: make it feel installed

On a phone browser, open the URL → **Share → Add to Home Screen**. It launches
full-screen with the Homewood icon, very close to a native app feel.

---

## When you're ready for real native apps (App Store / Google Play)

The web build is for fast feedback. For installable native apps, use EAS Build
(already configured in `eas.json`):

```bash
npm i -g eas-cli
eas login
eas build --platform ios       # App Store / TestFlight
eas build --platform android    # Google Play / internal testing
```

`TestFlight` (iOS) and Google Play **internal testing** are the native
equivalents of this web prototype for inviting testers.
