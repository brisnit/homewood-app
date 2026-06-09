# Homewood Living Ministries — Mobile App

A daily devotional & Bible engagement app for **Homewood Living Ministries**, built
with React Native + Expo. Read daily devotionals, view the Verse of the Day, follow
a read-the-Bible-in-a-year plan, build spiritual habits, connect with friends, and
track badges & streaks.

> **Runs out of the box with mock data — no API keys required.**

## Stack

- **React Native + Expo (SDK 52)** + **TypeScript**
- **Expo Router** (file-based navigation, typed routes)
- **NativeWind** (Tailwind-style styling) + a brand theme system
- **Supabase** for auth/profiles (optional — falls back to a local mock auth store)
- **expo-camera** (QR scanning), **react-native-qrcode-svg** (QR sharing)
- **EAS Build** for App Store + Google Play

## Quick start

```bash
cd homewood-app
npm install
cp .env.example .env     # optional — app runs on mock data without it
npm start                # then press i (iOS), a (Android), or scan the QR
```

`npm run typecheck` runs `tsc --noEmit`.

## How content providers work

The app never imports a concrete content source directly. It imports two
singletons from `src/providers/index.ts`, chosen by env vars:

| Env var                          | Values                          | Default |
| -------------------------------- | ------------------------------- | ------- |
| `EXPO_PUBLIC_DEVOTIONAL_PROVIDER`| `youversion` `homewood` `mock`  | `mock`  |
| `EXPO_PUBLIC_BIBLE_PROVIDER`     | `youversion` `fallback` `mock`  | `mock`  |

**Devotional providers** (`src/providers/devotional/`)
- `MockDevotionalProvider` — bundled original Homewood content.
- `HomewoodDevotionalProvider` — our own REST API (devotionals, plans, VOTD).
- `YouVersionDevotionalProvider` — Verse of the Day via YouVersion; devotionals/plans
  delegate to Homewood (publisher licensing not assumed).

**Bible providers** (`src/providers/bible/`)
- `MockBibleProvider` — sample passages + a generated 365-day plan.
- `FallbackBibleProvider` — Homewood-owned 365-day schedule + open/licensed passage text.
- `YouVersionBibleProvider` — versions/passages/audio via YouVersion where licensed.

Every non-mock provider **gracefully falls back** so the MVP is never blocked on an
external API. Swap providers by changing env only — no screen code changes.

### ⚠️ YouVersion licensing — must confirm before enabling

Search the codebase for `TODO(youversion)`. The YouVersion Platform API requires
partner approval, and devotional/plan content, red-letter data, audio, and the
per-day reading schedule are subject to publisher licensing. Until confirmed, keep
`*_PROVIDER=mock` (or `homewood`/`fallback`) — these use Homewood-owned content and
public-domain Bible text and are safe to ship.

## App flow

```
Welcome ─▶ Sign up / Log in ─▶ Privacy Policy gate ─▶ Tabs (Home · Bible · Plans · You)
                                      │
                              Decline ⇒ sign out
```

The gate is enforced in `app/_layout.tsx` (`RootNavigator`): a signed-in user who
has not accepted the privacy policy is always redirected to `/privacy`.

## Project structure

```
app/                      # Expo Router routes
  _layout.tsx             # providers + auth/privacy navigation guard
  (auth)/                 # welcome, login, signup, forgot-password
  privacy.tsx             # privacy policy gate
  (tabs)/                 # index (Home), bible, plans, you
  plan/[id].tsx           # plan detail (days, progress, notes)
  devotional/[id].tsx     # devotional reader
  reader.tsx              # Bible passage reader (red letters, audio)
  friends/                # add, share (QR), scan (camera)
  settings/index.tsx      # account settings + sign-out confirm
src/
  theme/                  # colors, typography, ThemeProvider (light/dark)
  components/ui/          # Button, Card, Avatar, BrandMark, Field, …
  components/content/     # VerseOfDayCard, DevotionalCard, PlanCard, ReadingRow
  providers/              # devotional + bible provider abstraction
  data/mockData.ts        # original Homewood mock content
  auth/                   # AuthProvider + mock auth store
  state/ProgressProvider  # plan + bible progress (persisted)
  types/models.ts         # domain models (mirror supabase/schema.sql)
supabase/schema.sql       # full DB schema with RLS
```

## Backend (optional)

1. Create a Supabase project and run `supabase/schema.sql`.
2. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`.

Without these, `src/lib/supabase.ts` returns `null` and the app uses the local mock
auth store (`src/auth/authStore.ts`) — the full gated flow still works offline.

## Building for the stores (EAS)

```bash
npm i -g eas-cli
eas login
eas build --platform ios       # App Store
eas build --platform android   # Google Play
```

`eas.json` defines `development`, `preview`, and `production` profiles. Update the
bundle/package ids in `app.json` (`org.homewoodliving.ministries`) and the EAS
`projectId` before your first build.

> **Assets:** `assets/icon.png`, `splash.png`, `adaptive-icon.png` are placeholders
> generated from the brand marks. Replace with 1024×1024 store-ready exports before
> submitting (`TODO(assets)`).

## Design

Brand palette and typography come straight from the Homewood Living Ministries brand
guidelines: deep navy, cream, brass, clay, pine, slate; **Raleway** for UI and
**Crimson Text** for serif accents. The UI favors large readable type, soft cards,
generous spacing, and elder-friendly touch targets.
```
Navy #0B1C3F · Cream #F8F2E7 · Brass #C9A24B · Clay #C2613D · Pine #3E7C6B · Slate #34507A
```
