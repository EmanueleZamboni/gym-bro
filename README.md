# Gym Bro

A tiny, dark, minimal rest-timer for the gym. One tap opens an exercise, **DONE** after each set starts the rest countdown, a short beep (that ducks your music instead of stopping it) tells you when to go again.

No accounts, no server. Everything lives on your phone.

## Install on Android (no computer needed)

1. Open the app link in **Chrome** on your phone.
2. Tap the ⋮ menu → **Add to Home screen** (or **Install app**).
3. Launch it from the home screen: full screen, works offline, updates itself.

## Using it

- **Workout** screen: tap an exercise to start it. Exercises you finished today get a tick. The ticks reset automatically the next day, or with **New workout**.
- **Exercise** screen: press **DONE** after every set. The rest timer starts; **+15s / −15s / Skip** adjust it. When it ends you get a beep, a vibration and a flash.
- **Edit** (pen icon): change reps, sets, weight, notes, the diagram, per-exercise rest. Add or delete exercises, reorder with the arrows.
- **Settings** (gear icon): default rest time, sound, vibration, system notification, keep-screen-on, language (EN / IT).

## Development

Static files, no build step. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8080
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/pages.yml`.
