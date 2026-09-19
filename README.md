# Gym Bro

A 16-bit arcade rest-timer for the gym, Mega Drive / Neo Geo style. One tap opens an exercise (the "stage"), **DONE** after each set lands a HIT, the round timer counts your rest, then **READY? … GO!!** with a chiptune crunch tells you to lift again. Only four sounds exist (hit, bell, 3-2-1, GO), all short clips, so your music ducks instead of stopping.

No accounts, no server. Everything lives on your phone.

## Android app (APK)

The native app is the recommended way to use Gym Bro. It runs the same UI inside a real Android app and adds what a browser can't do: an exact alarm that fires with the screen off, our own bell and GO sounds with "duck the music" audio focus, and a live countdown in the notification shade.

1. On your phone open the [latest release](https://github.com/EmanueleZamboni/gym-bro/releases/latest) and download `gym-bro.apk`.
2. Open the file and allow installing from this source when asked.
3. Later releases install over the previous one and keep your data.

Every push to `main` that touches the app builds a new APK (`.github/workflows/apk.yml`). The signing key is created on the first run and stored encrypted in `android/keystore.jks.enc`; the passphrase is the `KEYSTORE_PASSWORD` repository secret.

## Web version (no install)

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

The web app is plain static files in `www/`, no build step:

```
cd www && python3 -m http.server 8080
```

The Android project in `android/` is a Capacitor shell. `npm ci && npx cap sync android && cd android && ./gradlew assembleRelease` builds the APK. Native code lives in `android/app/src/main/java/it/zamboni/gymbro/`: `RestTimerPlugin` (alarm + countdown notification) and `AlarmReceiver` (plays the bell and GO from `res/raw`).

Pushing to `main` deploys `www/` to GitHub Pages via `.github/workflows/pages.yml`.
