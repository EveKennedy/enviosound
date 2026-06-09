# EnvioSound

A polished mobile prototype for travel vlog soundtrack discovery and generation.

## Place-to-Music Generator

The shared React/Capacitor app analyses locations or 15-second environmental recordings, builds a Sound DNA profile, then sends those features to ElevenLabs Music through a local API proxy.

- Records exactly 15 seconds of environmental audio with microphone permission
- Shows live input bars and a countdown while recording
- Analyses average volume, dynamic range, brightness, low-frequency energy, noise, pulse intensity, calm/busy, and nature/urban classification
- Sends the location, mood, Sound DNA, BPM, instruments, and detected sound profile to ElevenLabs
- Plays and exports the generated audio returned by ElevenLabs
- Supports location average profiles when the user does not record

Create a local `.env` file before running generation:

```bash
ELEVENLABS_API_KEY=your_key_here
```

Do not commit real API keys. For phone builds, deploy `server.js` somewhere private and set `VITE_API_BASE_URL` to that server URL before building the app.

## Native iOS app

Open the Xcode project:

```bash
open ios/EnvioSound/EnvioSound.xcodeproj
```

The SwiftUI app includes:

- Onboarding
- Home
- Map with tappable place pins
- Soundtrack generator with simulated loading
- Track preview
- Local artist discovery
- Saved projects
- Creator profile

The native iOS prototype is static. The shared React/Capacitor app uses the local ElevenLabs proxy for music generation and has no login or payment system.

Note: this machine currently has Command Line Tools selected instead of full Xcode, so simulator verification is unavailable from the terminal until Xcode is installed/selected.

## Android and cross-platform app

This repo includes a Capacitor wrapper so the React prototype can run on Android and iOS from the same UI.

```bash
npm run cap:sync
npm run android
```

Open `android/` in Android Studio to build or run on an Android emulator/device.

The default Capacitor sync targets Android so it does not require CocoaPods. If you later want the Capacitor iOS wrapper too, install CocoaPods and run `cap add ios`.

## Web prototype

```bash
npm install
npm run dev
```

`npm run dev` starts both Vite and the local ElevenLabs API proxy. The web app is still available at `http://localhost:5173/`.
