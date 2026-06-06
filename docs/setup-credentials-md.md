# SETUP — Accounts, API Keys, OAuth & Environment (ExtrovertAI)

> **How to use this file:** Open it in a NORMAL Claude chat (not Claude Code). Work through it top to bottom. Whenever you get stuck on a step, paste the exact screen text or error to Claude and ask for help — this file gives Claude enough context to guide you.
>
> **Goal:** by the end you'll have every external account created, every key obtained, and a filled-in `.env` file whose variable names exactly match what the code expects.
>
> **You do NOT need everything before you start building.** Steps are tagged:
> - 🟢 **NOW** — needed before/at File 01–02. Do these first.
> - 🟡 **SOON** — needed by a specific later build file. Provision when you reach it (or earlier if you like).
> - 🔵 **LATER** — slow approvals or production-only. Start early if they have long lead times, but they don't block local development.

---

## Quick map: which service is needed by which build file

| Service | Tag | Needed by file | Why |
|---|---|---|---|
| GitHub repo + git auth | 🟢 NOW | 01 | Commits/pushes from the very first file |
| Node.js + npm | 🟢 NOW | 01 | Build everything |
| Supabase project | 🟢 NOW | 02–03 | DB, Auth, storage |
| Upstash Redis | 🟡 SOON | 06 | BullMQ queue |
| Google Cloud project + Places API | 🟡 SOON | 07 | Lead search |
| Google OAuth (Gmail send/read) | 🔵 LATER | 04 (test) / launch (verified) | Mailbox connect — verification is slow |
| Microsoft Azure app (Outlook) | 🔵 LATER | 04 | Outlook mailbox connect |
| Firecrawl | 🟡 SOON | 05/08 | Crawl user site + lead sites |
| OpenRouter | 🟡 SOON | 05/09 | LLM drafting & extraction |
| Resend | 🟡 SOON | 11 | System email only |
| Cal.com | 🟡 SOON | 13 | Booking |
| Stripe | 🔵 LATER | 14 | Payments (live mode needs business verification) |
| ngrok (or tunnel) | 🟡 SOON | 13/14 | Public HTTPS for webhooks in local dev |

> Tell Claude Code, when it reaches a file whose credential isn't ready, to build everything else and clearly mark the gap in `PROGRESS.md` rather than block.

---

## 🟢 STEP 1 — Local tooling (NOW)

1. Install **Node.js LTS** (v20 or newer). Verify: `node -v` and `npm -v`.
2. Install **git**. Verify: `git --version`.
3. (Recommended) Install the **GitHub CLI** (`gh`) — makes repo creation and auth painless. Verify: `gh --version`.

No env vars from this step.

---

## 🟢 STEP 2 — GitHub repo `ExtrovertAI` (NOW)

You create the repo and authenticate git on your machine. Claude Code will push to it.

**Option A — with GitHub CLI (easiest):**
1. Authenticate: `gh auth login` → choose GitHub.com → HTTPS → log in via browser.
2. Create the repo (empty, private):
   ```
   gh repo create ExtrovertAI --private --description "ExtrovertAI — sales outreach platform"
   ```
   (Use `--public` if you prefer.) Do **not** add a README/gitignore via the flag — File 01 creates those.

**Option B — via the website:**
1. Go to github.com → New repository → name it exactly `ExtrovertAI` → Private → **do not** initialize with README/.gitignore/license → Create.
2. Authenticate git locally so pushes work without prompts: either `gh auth login`, or set up a Personal Access Token / SSH key. (Ask Claude to walk you through PAT or SSH if unsure.)

3. Note your repo URL (e.g. `https://github.com/<your-username>/ExtrovertAI.git`). File 01 will set this as the `origin` remote and push to `main`.

> **Security note:** never put tokens in code or in `.env` that gets committed. Git auth lives in your OS credential store / SSH agent, not in the repo.

No app env vars from this step (git auth is OS-level).

---

## 🟢 STEP 3 — Supabase project (NOW)

1. Go to supabase.com → sign in → **New project**. Name it `extrovertai`. Choose a region close to you/your users. Set a strong database password (save it in your password manager).
2. Wait for provisioning (~2 min).
3. In **Project Settings → API**, copy these:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY` (safe for the frontend)
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (**backend/worker ONLY — never ship to the browser, never commit**)
4. In **Project Settings → Database**, copy the **connection string** (URI) → `DATABASE_URL` (used for migrations).
5. We'll also need a key to encrypt stored mailbox tokens. Generate a random 32-byte base64 string (ask Claude for a one-liner, or run `openssl rand -base64 32`) → `TOKEN_ENCRYPTION_KEY`.

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=...
TOKEN_ENCRYPTION_KEY=...
```

---

## 🟡 STEP 4 — Upstash Redis (SOON — by File 06)

1. Go to upstash.com → sign in → **Create Database** → Redis. Name `extrovertai-queue`. Pick a region near your backend. Free tier is fine.
2. On the database page, copy the credentials. BullMQ needs a Redis connection; Upstash gives both a TLS URL and host/port/password.
   - Copy the **`rediss://` connection URL** → `REDIS_URL`.

```
REDIS_URL=rediss://...
```

> If BullMQ has trouble with the URL form, also keep host/port/password handy and tell Claude Code — it can configure BullMQ with the discrete fields instead.

---

## 🟡 STEP 5 — Google Cloud project + Places API (SOON — by File 07)

This Google Cloud project is reused for Places, Gmail OAuth, and Google Calendar — create it once.

1. Go to console.cloud.google.com → create a project named `extrovertai`.
2. **Enable APIs** (APIs & Services → Library): enable **Places API** (and "Places API (New)" if offered), **Gmail API**, and **Google Calendar API**. (Enable all three now to save trips back.)
3. **Billing:** Places requires a billing account attached, even though there's a generous monthly free credit. Add a billing account. (Set a budget alert so you're warned about spend — ask Claude how.)
4. **Create an API key** (APIs & Services → Credentials → Create credentials → API key) → this is `GOOGLE_PLACES_API_KEY`. Restrict it to the Places API and (later) your server IP for safety.

```
GOOGLE_PLACES_API_KEY=...
```

---

## 🔵 STEP 6 — Google OAuth for Gmail (LATER for verification; test creds usable by File 04)

> **Start this early — verification is slow.** Reading a user's email is a Google **restricted scope**, and getting verified for production can take weeks and may need a security review. For local development you can use the app in "testing" mode with a small list of test users without full verification.

1. In the same Google Cloud project → **APIs & Services → OAuth consent screen**:
   - User type: **External**. Fill app name `ExtrovertAI`, support email, developer email.
   - Add scopes for sending and reading Gmail (the Gmail send + read scopes — ask Claude for the exact scope strings when you reach File 04, as the minimal set matters for verification).
   - Add yourself (and any testers) under **Test users** so you can use it before verification.
2. **Credentials → Create credentials → OAuth client ID** → Application type **Web application**. Name `extrovertai-web`.
   - Authorized redirect URI for local dev: `http://localhost:3000/auth/google/callback` (confirm the exact path with Claude Code at File 04; keep it consistent with the code).
   - Copy **Client ID** → `GOOGLE_OAUTH_CLIENT_ID`, **Client secret** → `GOOGLE_OAUTH_CLIENT_SECRET`.
3. **Submit for verification when you're ready to launch** (not needed for local testing with test users). Begin the process as early as possible.

```
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

---

## 🔵 STEP 7 — Microsoft Azure app for Outlook (LATER — by File 04)

1. Go to portal.azure.com → **Microsoft Entra ID → App registrations → New registration**. Name `extrovertai`. Supported account types: choose **Accounts in any organizational directory and personal Microsoft accounts** (so any Outlook user can connect).
2. **Redirect URI:** Web → `http://localhost:3000/auth/microsoft/callback` (confirm exact path with Claude Code at File 04).
3. Copy **Application (client) ID** → `MS_OAUTH_CLIENT_ID`.
4. **Certificates & secrets → New client secret** → copy the secret **value** (not the ID) → `MS_OAUTH_CLIENT_SECRET`. (You only see it once.)
5. **API permissions → Add → Microsoft Graph → Delegated**: add mail send + read + offline_access (exact permission names confirmed with Claude at File 04). Grant consent.

```
MS_OAUTH_CLIENT_ID=...
MS_OAUTH_CLIENT_SECRET=...
MS_OAUTH_REDIRECT_URI=http://localhost:3000/auth/microsoft/callback
```

---

## 🟡 STEP 8 — Firecrawl (SOON — by File 05)

1. Go to firecrawl.dev → sign up → **API Keys** → create a key → `FIRECRAWL_API_KEY`.
2. Note the free-tier credit limit. When it runs out, you either upgrade or switch to the Playwright/Cheerio fallback (the code supports both behind `CrawlService`).

```
FIRECRAWL_API_KEY=...
```

---

## 🟡 STEP 9 — OpenRouter (SOON — by File 05/09)

1. Go to openrouter.ai → sign in → **Keys** → create a key → `OPENROUTER_API_KEY`.
2. Pick a current free model id to start (free model availability changes — ask Claude for a current free model id when you reach File 09). Set it as `LLM_MODEL`. Because drafting goes through `LlmService`, swapping to Gemini Flash later is a one-value change.

```
OPENROUTER_API_KEY=...
LLM_MODEL=...            # a current OpenRouter free model id to start
```

---

## 🟡 STEP 10 — Resend (SOON — by File 11; system email only)

1. Go to resend.com → sign up → **API Keys** → create → `RESEND_API_KEY`.
2. For real sending you'll verify a sending domain (DNS records). For local dev you can start with their test/onboarding sender. (Ask Claude about domain verification when you're closer to launch.)
3. Remember: Resend is **only** for ExtrovertAI's own system mail (signup, alerts). Never for user cold outreach.

```
RESEND_API_KEY=...
SYSTEM_EMAIL_FROM=onboarding@yourdomain.com   # placeholder until domain verified
```

---

## 🟡 STEP 11 — Cal.com (SOON — by File 13)

1. Go to cal.com → sign up (cloud free tier).
2. Get an **API key** (Settings → Developer/API) → `CALCOM_API_KEY`.
3. Connect your **Google Calendar** inside Cal.com so availability is real.
4. Webhooks need a public URL (see ngrok step). You'll add the webhook endpoint when you reach File 13; the signing secret it gives you → `CALCOM_WEBHOOK_SECRET`.

```
CALCOM_API_KEY=...
CALCOM_WEBHOOK_SECRET=...     # added when you configure the webhook (File 13)
```

---

## 🔵 STEP 12 — Stripe (LATER — by File 14)

> Live mode needs business verification; **test mode works immediately** for building File 14.

1. Go to stripe.com → sign up. Stay in **Test mode** for development.
2. **Developers → API keys**: copy **Publishable key** → `STRIPE_PUBLISHABLE_KEY`, **Secret key** → `STRIPE_SECRET_KEY` (test keys start with `pk_test_` / `sk_test_`).
3. Create **Products/Prices** for your credit packs (or a subscription) — you'll do this when you reach File 14 with Claude's help.
4. **Webhook:** add an endpoint pointing at your public tunnel URL (see ngrok) → copy the **signing secret** → `STRIPE_WEBHOOK_SECRET`. (Credits are granted from the webhook, idempotently — never from the browser redirect.)
5. Complete business verification later, before going live.

```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...    # added when you configure the webhook (File 14)
```

---

## 🟡 STEP 13 — ngrok / tunnel (SOON — by File 13/14, for webhooks in local dev)

Stripe and Cal.com cannot reach `localhost`. You need a public HTTPS URL forwarding to your local API.

1. Go to ngrok.com → sign up → install → authenticate (`ngrok config add-authtoken <token>`).
2. When testing webhooks: `ngrok http 3000` (match your API port). Use the printed `https://…ngrok…` URL as the webhook endpoint base in Stripe/Cal.com.

No app env var, but note the current tunnel URL when configuring webhooks.

---

## Final: the complete `.env` (names must match `.env.example`)

When Claude Code creates `.env.example` in File 01, its variable names will match these exactly. Copy `.env.example` to `.env`, fill in values as you obtain them, and **never commit `.env`** (File 01 adds it to `.gitignore`).

```
# --- App ---
APP_NAME=ExtrovertAI
NODE_ENV=development
API_PORT=3000
WEB_PORT=4200

# --- Supabase ---
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
TOKEN_ENCRYPTION_KEY=

# --- Redis / Queue ---
REDIS_URL=

# --- Google (Places + OAuth + Calendar) ---
GOOGLE_PLACES_API_KEY=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/google/callback

# --- Microsoft (Outlook) ---
MS_OAUTH_CLIENT_ID=
MS_OAUTH_CLIENT_SECRET=
MS_OAUTH_REDIRECT_URI=http://localhost:3000/auth/microsoft/callback

# --- Crawl / LLM ---
FIRECRAWL_API_KEY=
OPENROUTER_API_KEY=
LLM_MODEL=

# --- System email (Resend) ---
RESEND_API_KEY=
SYSTEM_EMAIL_FROM=

# --- Booking (Cal.com) ---
CALCOM_API_KEY=
CALCOM_WEBHOOK_SECRET=

# --- Payments (Stripe) ---
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## What you need before File 01 can run
Only these: **Node + git** (Step 1), **GitHub repo + auth** (Step 2). Everything else can be filled in as you reach the file that needs it. If a value is missing when Claude Code reaches its file, instruct it to build around the gap and record it in `PROGRESS.md`.

## Safety reminders
- Never commit `.env`, secrets, tokens, or the Supabase `service_role` key.
- The `service_role` key and OAuth secrets are backend/worker only — never expose them to the Angular frontend.
- Set a billing budget alert on Google Cloud and watch Stripe/Places usage — since the platform owns the keys, your usage = your cost.
- Restrict API keys (by API and, where possible, by IP/referrer) once you know your deployment.
