# Revolución Fungi Fest — Claude Notes

## Project Structure
- **`static/components/Festival.tsx`** — the festival landing page (pre-rendered to static HTML)
- **`scripts/build-static.ts`** — builds CSS + pre-renders Festival.tsx → `build/client/landing/festival.html`
- **`scripts/prerender.tsx`** — Firebase/Firestore form submission logic (email via Firestore Extension)
- **`build/client/`** — full build output (Remix SPA + static landing pages)

## Build
```bash
npm run build
```
Runs both `remix vite:build` and `tsx scripts/build-static.ts`. Always do this before previewing or deploying.

## Local Preview (Static Landing Page)
**Use Python's HTTP server** served from `build/client/` — this is the only approach that works correctly. `npx serve` causes MIME type errors for CSS.

```bash
# Kill anything on port 3000 first if needed:
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Start server (run in background):
python3 -m http.server 3000 --directory /path/to/build/client &

# Then open:
# http://localhost:3000/landing/festival.html
```

**Why not `npx serve`?** It serves `.vite/manifest.json` files as `application/json` and the browser refuses to apply them as stylesheets. Python's `http.server` handles MIME types correctly.

## Deploy
```bash
firebase deploy --only hosting:festival
```

## Firebase
- Firestore collection for contact form: `festival-contacts`
- Email triggered via Firestore Extension → `info@revolucionfungifest.com`
