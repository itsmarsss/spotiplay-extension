(() => {
  const SPOTIFY_STATE_STORAGE_KEY = "spotiplay.spotifyState";
  const SPOTIPLAY_RUNTIME_STORAGE_KEY = "spotiplay.runtime";
  const SHUFFLE_MODE_STORAGE_KEY = "spotiplay.shuffleMode";

  const runtimeState = {
    currVolume: 0.5,
    covering: false,
    overlayTimer: null,
  };

  let spotifyStateCache = null;
  let nowPlayingBar = null;

  function parseJson(value, fallback = null) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function loadRuntimeState() {
    const parsed = parseJson(localStorage.getItem(SPOTIPLAY_RUNTIME_STORAGE_KEY), {});
    const saved = parsed && typeof parsed === "object" ? parsed : {};
    if (typeof saved.currVolume === "number") {
      runtimeState.currVolume = Math.max(0, Math.min(1, saved.currVolume));
    }
  }

  function persistRuntimeState() {
    localStorage.setItem(
      SPOTIPLAY_RUNTIME_STORAGE_KEY,
      JSON.stringify({ currVolume: runtimeState.currVolume })
    );
  }

  function syncSpotifyStateFromStorage() {
    const value = localStorage.getItem(SPOTIFY_STATE_STORAGE_KEY);
    const parsed = parseJson(value, null);
    if (parsed && typeof parsed === "object") {
      spotifyStateCache = parsed;
    }
  }

  function getSpotifyState() {
    syncSpotifyStateFromStorage();
    if (
      spotifyStateCache &&
      spotifyStateCache.cluster &&
      spotifyStateCache.deviceId &&
      spotifyStateCache.bearer &&
      spotifyStateCache.clientToken
    ) {
      return spotifyStateCache;
    }
    return null;
  }

  function getNowPlayingBar() {
    nowPlayingBar = document.querySelector('[data-testid="now-playing-bar"]');
    return nowPlayingBar;
  }

  function getTrackDurationMs() {
    const bar = getNowPlayingBar();
    const durationEl = bar?.querySelector('[data-testid="playback-duration"]');
    return timeStringToMs(durationEl?.textContent || "0:00");
  }

  function getTrackPositionMs() {
    const bar = getNowPlayingBar();
    const positionEl = bar?.querySelector('[data-testid="playback-position"]');
    return timeStringToMs(positionEl?.textContent || "0:00");
  }

  function timeStringToMs(text) {
    if (!text) return 0;
    const parts = text.split(":").map(Number);
    if (parts.some((n) => Number.isNaN(n))) return 0;
    if (parts.length === 3) {
      return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
    }
    if (parts.length === 2) {
      return (parts[0] * 60 + parts[1]) * 1000;
    }
    return 0;
  }

  function getPlayerCommandUrl(state) {
    return `https://${state.cluster}-spclient.spotify.com/connect-state/v1/player/command/from/${state.deviceId}/to/${state.deviceId}`;
  }

  function getVolumeUrl(state) {
    return `https://${state.cluster}-spclient.spotify.com/connect-state/v1/connect/volume/from/${state.deviceId}/to/${state.deviceId}`;
  }

  async function spotifyFetch(url, method, body) {
    const state = getSpotifyState();
    if (!state) {
      throw new Error("Spotify request state not ready yet.");
    }

    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        authorization: state.bearer,
        "client-token": state.clientToken,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Spotify request failed (${response.status})`);
    }
  }

  function getShuffleMode() {
    const bar = getNowPlayingBar();
    if (bar) {
      if (bar.querySelector('[aria-label="Disable Smart Shuffle"]')) {
        return "smart";
      }
      if (bar.querySelector('[aria-label="Disable shuffle"]')) {
        return "normal";
      }
      if (
        bar.querySelector('[aria-label="Enable Smart Shuffle"]') ||
        bar.querySelector('[aria-label="Enable shuffle"]')
      ) {
        return "off";
      }
    }

    const stored = localStorage.getItem(SHUFFLE_MODE_STORAGE_KEY);
    if (stored === "off" || stored === "normal" || stored === "smart") {
      return stored;
    }

    return "off";
  }

  function setShuffleMode(mode) {
    localStorage.setItem(SHUFFLE_MODE_STORAGE_KEY, mode);
  }

  async function sendPlayerCommand(command) {
    const state = getSpotifyState();
    if (!state) {
      throw new Error("Spotify request state not ready yet.");
    }
    await spotifyFetch(getPlayerCommandUrl(state), "POST", { command });
  }

  async function setVolumeRatio(ratio) {
    const clamped = Math.max(0, Math.min(1, ratio));
    const volume = Math.round(clamped * 65535);
    const state = getSpotifyState();
    if (!state) {
      throw new Error("Spotify request state not ready yet.");
    }
    await spotifyFetch(getVolumeUrl(state), "PUT", { volume });
    runtimeState.currVolume = clamped;
    persistRuntimeState();
  }

  async function shuffle() {
    const currentMode = getShuffleMode();
    const nextMode =
      currentMode === "off"
        ? "normal"
        : currentMode === "normal"
          ? "smart"
          : "off";

    if (nextMode === "off") {
      await sendPlayerCommand({
        endpoint: "set_options",
        shuffling_context: false,
        modes: { context_enhancement: "NONE" },
      });
    } else if (nextMode === "normal") {
      await sendPlayerCommand({
        endpoint: "set_options",
        shuffling_context: true,
        modes: { context_enhancement: "NONE" },
      });
    } else {
      await sendPlayerCommand({
        endpoint: "set_options",
        shuffling_context: true,
        modes: { context_enhancement: "RECOMMENDATION" },
      });
    }

    setShuffleMode(nextMode);
  }

  async function prev() {
    if (getTrackPositionMs() > 5000) {
      await sendPlayerCommand({
        endpoint: "seek_to",
        value: 0,
      });
      return;
    }

    await sendPlayerCommand({
      endpoint: "skip_prev",
    });
  }

  async function playpause() {
    const bar = getNowPlayingBar();
    const isPaused = Boolean(bar?.querySelector('[aria-label="Play"]'));
    await sendPlayerCommand({
      endpoint: isPaused ? "resume" : "pause",
    });
  }

  async function next() {
    await sendPlayerCommand({
      endpoint: "skip_next",
    });
  }

  async function repeat() {
    const bar = getNowPlayingBar();
    if (!bar) return;

    let mode = "one";
    if (bar.querySelector('[aria-label="Enable repeat"]')) {
      mode = "off";
    } else if (bar.querySelector('[aria-label="Enable repeat one"]')) {
      mode = "on";
    }

    if (mode === "off") {
      await sendPlayerCommand({
        endpoint: "set_options",
        repeating_context: true,
        repeating_track: false,
      });
      return;
    }

    if (mode === "on") {
      await sendPlayerCommand({
        endpoint: "set_options",
        repeating_context: true,
        repeating_track: true,
      });
      return;
    }

    await sendPlayerCommand({
      endpoint: "set_options",
      repeating_context: false,
      repeating_track: false,
    });
  }

  async function mute() {
    const bar = getNowPlayingBar();
    const isMuted = Boolean(bar?.querySelector('[aria-label="Unmute"]'));
    if (isMuted) {
      const restoreVolume = runtimeState.currVolume > 0 ? runtimeState.currVolume : 0.5;
      await setVolumeRatio(restoreVolume);
      return;
    }

    if (runtimeState.currVolume > 0) {
      persistRuntimeState();
    }
    await setVolumeRatio(0);
  }

  async function volume(value) {
    await setVolumeRatio(value);
  }

  async function track(value) {
    const durationMs = getTrackDurationMs();
    const ratio = Math.max(0, Math.min(1, value));
    await sendPlayerCommand({
      endpoint: "seek_to",
      value: Math.round(durationMs * ratio),
    });
  }

  function info() {
    const bar = getNowPlayingBar();
    if (!bar) {
      return {
        url: "",
        titleURL: "",
        authorURL: "",
        title: "Pending Title...",
        author: "Pending Author...",
        shuffled: false,
        shuffleMode: "off",
        paused: false,
        repeated: "off",
        muted: false,
        volume: runtimeState.currVolume,
        position: "0:00",
        duration: "0:00",
      };
    }

    const titleEl = bar.querySelector('[data-testid="context-item-link"]');
    const authorEl = bar.querySelector('[data-testid="context-item-info-artist"]');
    const cover = bar.querySelector('[data-testid="cover-art-image"]');

    const shuffleMode = getShuffleMode();
    const shuffled = shuffleMode !== "off";
    const paused = Boolean(bar.querySelector('[aria-label="Play"]'));

    let repeated = "one";
    if (bar.querySelector('[aria-label="Enable repeat"]')) {
      repeated = "off";
    } else if (bar.querySelector('[aria-label="Enable repeat one"]')) {
      repeated = "on";
    }

    const muted = Boolean(bar.querySelector('[aria-label="Unmute"]'));
    const position = bar.querySelector('[data-testid="playback-position"]');
    const duration = bar.querySelector('[data-testid="playback-duration"]');

    return {
      url: cover?.src || "",
      titleURL: titleEl?.href || "",
      authorURL: authorEl?.href || "",
      title: titleEl?.textContent || "Pending Title...",
      author: authorEl?.textContent || "Pending Author...",
      shuffled,
      shuffleMode,
      paused,
      repeated,
      muted,
      volume: runtimeState.currVolume,
      position: position?.textContent || "0:00",
      duration: duration?.textContent || "0:00",
    };
  }

  function ensureOverlay() {
    if (runtimeState.covering || !document.body) return;

    const cover = document.createElement("div");
    cover.innerHTML = `
      <div style="text-align: center; word-spacing: 2px;">
        This&nbsp;<span style="color: #1ed760;">Spotify</span>&nbsp;webpage is currently being managed by&nbsp;<span style="color: #1ed760;">SpotiPlay</span>.
      </div>`;
    cover.style = `
      position: fixed;
      width: 100%;
      height: 100%;
      bottom: 0;
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      font-family: var(--font-family,CircularSpTitle,CircularSpTitle-Tall,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif));
      color: #fff;
      background: #181818;
      transition: 200ms;
    `;

    document.body.insertAdjacentElement("afterend", cover);

    document.addEventListener("mousemove", () => {
      cover.style.height = "50px";
      document.body.style.height = "calc(100% - 50px)";

      clearTimeout(runtimeState.overlayTimer);
      runtimeState.overlayTimer = setTimeout(() => {
        cover.style.height = "100%";
        document.body.style.height = "100%";
      }, 5000);
    });

    runtimeState.covering = true;
  }

  function initialize() {
    loadRuntimeState();
    syncSpotifyStateFromStorage();

    window.addEventListener("spotify-state-ready", (event) => {
      spotifyStateCache = event.detail || spotifyStateCache;
    });

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      ensureOverlay();

      const actionHandlers = {
        shuffle,
        prev,
        playpause,
        next,
        repeat,
        mute,
        volume: () => volume(message.value),
        track: () => track(message.value),
      };

      if (message.action === "info") {
        sendResponse(info());
        return true;
      }

      const handler = actionHandlers[message.action];
      if (!handler) {
        sendResponse({ status: "Unknown action" });
        return true;
      }

      handler()
        .then(() => sendResponse({ status: "ok" }))
        .catch((error) => {
          console.warn(`Action "${message.action}" failed:`, error);
          sendResponse({ status: "error", message: error.message });
        });

      return true;
    });
  }

  initialize();
})();
