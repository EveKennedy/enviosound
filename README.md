# EnvioSound

A polished mobile prototype for travel vlog soundtrack discovery and generation.

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

The app is mock/static data only: no backend, login, payments, or real audio generation.

Note: this machine currently has Command Line Tools selected instead of full Xcode, so simulator verification is unavailable from the terminal until Xcode is installed/selected.

## Web prototype fallback

```bash
npm install
npm run dev
```
