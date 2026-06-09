# World Room

World Room is a realtime audio worldbuilding companion built with React, Vite, WebRTC, and the OpenAI Realtime API. The app lets a user speak naturally with a playful live collaborator that helps invent settings, characters, conflicts, and scene hooks.

## Current OpenAI Guidance Used

- Realtime sessions are the right architecture for live audio that needs low latency: https://developers.openai.com/api/docs/guides/realtime
- Browser speech-to-speech apps should use WebRTC for consistent performance: https://developers.openai.com/api/docs/guides/realtime-webrtc
- The browser should use an ephemeral client secret minted by a trusted server, never `OPENAI_API_KEY`: https://developers.openai.com/api/docs/guides/realtime-webrtc
- The models page currently lists `gpt-realtime-2` for realtime voice interactions: https://developers.openai.com/api/docs/models

## Responsibilities

Browser/client:

- Requests microphone permission with `navigator.mediaDevices.getUserMedia`.
- Creates the `RTCPeerConnection`, sends the local audio track, and plays the model audio track.
- Uses the Realtime data channel for session events, transcript deltas, VAD state, starter prompts, and error display.
- Shows obvious session states: ready, requesting mic, opening room, listening, shaping reply, speaking, reconnecting, and error.

Server/session-token boundary:

- Reads `OPENAI_API_KEY` from `.env` or the shell environment.
- Calls `POST https://api.openai.com/v1/realtime/client_secrets`.
- Sends only the short-lived client secret JSON back to the browser.
- Adds `OpenAI-Safety-Identifier` server-side using a privacy-preserving local hash.

## Setup

```bash
cd /Users/evekennedy09/Desktop/sound_app/enviosound-frontend
cp .env.example .env
```

Edit `.env`:

```bash
OPENAI_API_KEY=sk-proj-your-key-here
```

Run local development:

```bash
npm install
npm run dev
```

Open the Vite URL, usually http://localhost:5173. Use a browser with microphone permissions enabled.

Optional overrides:

```bash
REALTIME_MODEL=gpt-realtime-2
REALTIME_VOICE=marin
REALTIME_SERVER_PORT=8787
```

## Developer Notes

Latency:

- The app uses WebRTC directly from the browser to the Realtime API after receiving an ephemeral token.
- Semantic VAD is enabled so the model can decide when the user has finished a turn, reducing awkward cutoffs.
- Spoken responses are intentionally short in the session instructions to keep turn-taking lively.
- The server is only in the token-minting path, not the live audio path.

Session lifecycle:

- `npm run dev` starts both `server/realtime-session.js` and Vite.
- Click `Open Mic Session` to mint a client secret, request microphone access, create an SDP offer, and complete the Realtime handshake.
- Click `Close Session` to close the data channel, stop microphone tracks, close the peer connection, and reset UI state.
- Realtime sessions have finite lifetimes; refresh or close/reopen the room for long-running use.

Permissions:

- Browsers require HTTPS for microphone access outside `localhost`.
- If permission is denied, reset the site permission in the browser and reopen the session.
- The OpenAI API key must stay on the server. Do not put it in Vite client env variables.

Error recovery:

- If token creation fails, confirm `.env` contains `OPENAI_API_KEY` and restart `npm run dev`.
- If the WebRTC handshake fails, close the session and reopen it to mint a fresh client secret.
- If connection state becomes `disconnected` or `failed`, the UI moves to reconnecting; close and reopen if it does not recover.
- If the model speaks over the user, lower background noise and try a headset; VAD quality depends on input audio.

## Validation Checklist

- Microphone permission prompt appears on first session start.
- Denying microphone permission shows a useful error and leaves the UI recoverable.
- Opening a session changes the status from ready to live.
- Speaking triggers listening/thinking/speaking state changes.
- The model responds with audible audio, not text-only output.
- Starter prompt buttons send text over the Realtime data channel and produce a spoken response.
- Transcript shows user speech when transcription events are emitted and assistant transcript deltas during replies.
- `Close Session` stops the microphone indicator in the browser.
- Restarting the local token server while the UI is open produces a recoverable token/session error.
- Closing and reopening the session after a failed connection mints a new token and reconnects.
- Conversation quality: ask for a setting, a character, a conflict, and a scene hook; responses should stay short, vivid, and collaborative.
