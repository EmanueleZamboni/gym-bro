# Gym Bro

A 16-bit arcade rest-timer for the gym, Mega Drive / Neo Geo style. One tap opens an exercise (the "stage"), **DONE** after each set lands a HIT, the round timer counts your rest, then **READY? … GO!!** with a chiptune crunch tells you to lift again. Short clips only, so your music ducks instead of stopping.

No accounts, no server. Everything lives on your phone.

## Install on Android (no computer needed)

1. Open the app link in **Chrome** on your phone.
2. Tap the ⋮ menu → **Add to Home screen** (or **Install app**).
3. Launch it from the home screen: full screen, works offline, updates itself.

## Using it

- **Workout** screen: tap an exercise to start it. Exercises you finished today get a tick. The ticks reset automatically the next day, or with **New workout**.
- **Exercise** screen: an animated pixel sprite shows the machine. Press **DONE** after every set: screen shake, HIT! stamp, pixel burst, power-bar segment fills. The rest timer starts; **+15s / −15s / Skip** adjust it. At zero: bell, READY?, then GO!! with a crunch, flash and rumble. Last set: STAGE CLEAR with your volume (kg × reps × sets).
- **Edit** (pen icon): change reps, sets, weight, notes, the diagram, per-exercise rest. Add or delete exercises, reorder with the arrows.
- **Options** (gear icon): rest time, sound, rumble, system notification, keep-screen-on, CRT scanlines, language (EN / IT).

## Under the hood

- `sprites.js` draws every 32×32 sprite (two animation frames plus a resting pose) from a few primitives with an automatic outline, so new machines are a handful of coordinates.
- `synth.js` renders all sound effects at startup from square, triangle and noise channels, chiptune style, into short WAV clips.
- Fonts are self-hosted: Press Start 2P (display) and Pixelify Sans (body), both SIL Open Font License.

## Development

Static files, no build step. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8080
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/pages.yml`.
