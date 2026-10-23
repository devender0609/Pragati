# Pragati 0.84.0-rc.4 — Windows deployment runbook

Paste-ready PowerShell for Windows 10/11. Replace the path on the first line
with wherever you extracted the source package.

## 1. Check your tools

```powershell
node --version
npm --version
```

Verified on **Node v22.22.2, npm 10.9.7**. `package.json` declares
`engines: node >=20.19 <23`, and `.nvmrc` pins 22.22.2.

## 2. Enter the project

```powershell
cd "C:\Path\To\pragati-0.84.0-rc.4"
```

## 3. Install exactly what was tested

```powershell
npm ci
```

Use `npm ci`, not `npm install` — it installs the lockfile exactly. If it
fails, stop; nothing below is meaningful.

## 4. Verify

```powershell
npm run typecheck
npm test
npm run validate:curriculum
npm run build
```

Expected: typecheck clean, **2068 tests across 104 files**, curriculum
validation passing, and a build into `dist\` of about 5.1 MB.

## 5. Run the production bundle locally

```powershell
npm run preview
```

Vite reported **http://localhost:4173/** when this was verified. Read the URL
Vite prints; it moves if the port is taken.

Use this rather than `npm run dev` — the dev server is not what gets deployed.

## 6. Two build modes — read this before building

Pragati builds in two modes, and the difference is governance, not features.

### A. Public-safe build — the default

```powershell
npm run build
npm run preview
```

With no preview flag set, Class 9's authored lessons are **not reachable by a
student**. They are unreviewed, so they are not delivered. The Learn tab says
lessons are coming; nothing claims otherwise. **This is the mode to deploy.**

### B. Internal RC preview — unreviewed content, for testers only

Create `.env.local` in the project root:

```text
VITE_ENABLE_AUTHORED_LEARN_PREVIEW=true
```

Then:

```powershell
npm run build
npm run preview
```

This build exposes all 92 Class 9 lessons and shows an **Internal preview —
unreviewed learning content** notice above the chapter list.

**Only ever use this for internal release-candidate testing.** The flag is
build-time, so no URL, stored setting or key sequence can turn it on in a
built bundle. Absent means off, and only the exact string `true` turns it on.

What is guaranteed is **inaccessibility, not absence**. The public-safe build
has authored-draft delivery disabled: the catalogue and direct lesson lookup
both deny those artifacts, for all 92. Preview code, the flag name and the
lesson prose itself all remain in the compiled JavaScript — this is not
dead-code elimination and is not claimed to be. The gate stops delivery, not
reading: anyone inspecting the shipped assets can find the lesson text.

Enabling it on a public deployment would put unreviewed curriculum in front of
students. That is a curriculum-publication decision, not a deployment switch.

## 7. Optional: Firebase

Without these, Pragati runs in local-only mode and teacher login is
truthfully unavailable. The app does not crash and does not claim to be
connected.

Create `.env.local` in the project root:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Fill **all six or none** — partial configuration leaves Firebase disabled.
These are Vite build-time variables, so rebuild after changing them. They are
public client configuration by design. **Never put a service-account key
here**; none is needed.

## 8. Deploy to Vercel

Zero-config works: Vercel auto-detects Vite, `npm run build` and `dist`. No
`vercel.json` is needed and none is included — adding one would only be
justified if a routing or header rule were actually required.

Preview first:

```powershell
npx vercel
```

Smoke-test the preview URL it prints.

**Environment variables in Vercel.** Set `VITE_ENABLE_AUTHORED_LEARN_PREVIEW`
to `true` in the **Preview** environment only, if you want an internal RC
where Class 9 can be tested. **Do not set it in Production** while Class 9 is
unreviewed. The six Firebase variables, if you want them, go in project
settings rather than in any script.

---

## Production deployment — requires explicit user approval

Not the next step after a preview. Read this before running it.

```powershell
npx vercel --prod
```

- `VITE_ENABLE_AUTHORED_LEARN_PREVIEW` **must be absent** from the Production
  environment.
- **Class 9 remains unreviewed.** 0 sent, 0 reviewed, 0 adjudicated,
  0 published.
- **Production deployment does not publish Class 9 curriculum.** It ships
  software. Making these lessons available to students is a human curriculum
  decision and cannot be made by an environment flag.

### The two static bundles — they are not interchangeable

Two `dist` artifacts ship with this release, and picking the wrong one would
put unreviewed curriculum in front of students.

#### ✅ PUBLIC-SAFE — `pragati-0.84.0-rc.4-public-safe-dist.zip`

Built with no preview flag. Class 9's 92 unreviewed lessons are **not
deliverable**: the catalogue is empty for them and a direct lesson lookup is
denied. This is the artifact that may be deployed publicly, as far as software
governance goes.

#### ⚠️ INTERNAL PREVIEW — `pragati-0.84.0-rc.4-internal-preview-dist.zip`

Built with the preview flag on. **Exposes all 92 unreviewed lessons** and
carries the "Internal preview — unreviewed learning content" notice. For
authorised internal curriculum testing only. Never deploy it publicly, and
never confuse it with the file above.

To deploy a prebuilt bundle rather than rebuild from source, extract the one
you intend and deploy that directory. Check the filename twice.

## 9. Routing note

Navigation is client state, not URL paths — the address bar stays at the
site root. **No SPA rewrite rules are required**, and a hard refresh is safe
on any static host.

## What this runbook does not give you

The deployed app has had **no human curriculum review**. Class 9's lessons are
authored and validated; nothing is reviewed, adjudicated or published.
Deploying is not approval.
