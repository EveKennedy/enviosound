# EnvioSound

A polished mobile prototype for AI-powered travel vlog creation.

## From Place to Story

The shared React/Capacitor app turns travel footage, photos and environmental sound into a Remotion-ready travel video plan.

- Uploads video clips, photos, drone footage and environmental audio
- Records exactly 15 seconds of environmental audio with microphone permission
- Builds a Sound DNA profile for the location
- Free plan uses the local Sound DNA music model with no API call
- Pro plan is shown at $6/month and sends soundtrack generation to ElevenLabs
- Studio can use either a generated Sound DNA soundtrack or a selected Library track
- Generates AI travel narration with ElevenLabs on Pro or local browser narration on Free
- Assembles a Remotion-ready travel vlog blueprint with clips, captions, maps, transitions, soundtrack and narration
- Exports format plans for TikTok, Instagram Reels, YouTube Shorts and YouTube Travel Vlog
- Supports local music Library submissions attached to places
- Runs a server-side web search copyright check for a chosen Library song before publishing

Create a local `.env` file before using ElevenLabs Pro generation or copyright lookup:

```bash
ELEVENLABS_API_KEY=your_key_here
OPENAI_API_KEY=your_openai_key_here
OPENAI_SEARCH_MODEL=gpt-5.5
```

Do not commit real API keys. `OPENAI_API_KEY` is used only by the local/server API route for the Library copyright lookup. The lookup uses the OpenAI Responses API with web search enabled so the app can return current, sourced guidance for a specific song; it is not legal advice and should be confirmed with the rights holder.

For phone builds, deploy `server.js` somewhere private and set `VITE_API_BASE_URL` to that server URL before building the app.

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
- Music Library discovery
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

`npm run dev` starts both Vite and the local API proxy for ElevenLabs generation, narration and OpenAI web-search copyright lookup. The web app is still available at `http://localhost:5173/`.
