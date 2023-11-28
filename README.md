# SpotiPlay Extension

SpotiPlay is a Chrome extension popup for controlling Spotify Web Playback from a managed Spotify tab.

## What It Does

- Play / pause
- Skip next
- Previous behavior:
  - If playback position is `<= 5s`: skip to previous track
  - If playback position is `> 5s`: seek to `0`
- Volume control (`0..65535` mapped from slider percent)
- Track scrubbing (seek in milliseconds)
- Repeat cycle (`off -> context -> track`)
- Shuffle cycle (`off -> normal -> smart`)
- Smart shuffle visual indicator (shuffle icon + star badge)

Library heart/like control has been removed.

## Architecture

The extension uses two content scripts:

1. `src/spotifyInterceptor.js` (`document_start`)
- Injects a page-level script (`src/pageInterceptor.js`) using `chrome.runtime.getURL(...)` (CSP-safe).
- This page script intercepts Spotify `fetch` traffic and captures:
  - `cluster`
  - `deviceId`
  - `bearer`
  - `clientToken`
- Captured values are persisted to `localStorage` under `spotiplay.spotifyState`.

2. `src/contentScript.js` (`document_idle`)
- Receives popup commands via `chrome.tabs.sendMessage`.
- Sends Spotify control commands as direct `fetch` requests (no DOM click simulation for playback controls).
- Reads current song metadata/state from Spotify DOM (`now-playing-bar`) for popup display.

## Project Structure

- `src/main.jsx`: popup app entry
- `src/Controller.jsx`: tab discovery + messaging bridge
- `src/contentScript.js`: command dispatcher + info provider
- `src/spotifyInterceptor.js`: early injector
- `src/pageInterceptor.js`: page-context fetch interceptor
- `src/manifest.json`: MV3 manifest

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build:
```bash
npm run build-lin
```
On Windows:
```bash
npm run build-win
```

3. Load in Chrome:
- Open `chrome://extensions`
- Enable **Developer mode**
- Click **Load unpacked**
- Select the `dist/` directory

## Development

Run Vite dev server:
```bash
npm run dev
```

Lint:
```bash
npm run lint
```

## Notes

- The extension expects an accessible Spotify Web tab (`https://open.spotify.com/`).
- First-run control commands may fail until Spotify auth/device state is observed and cached by the interceptor.
