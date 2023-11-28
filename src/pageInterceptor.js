(() => {
  const STORAGE_KEY = "spotiplay.spotifyState";
  const state = {
    cluster: null,
    deviceId: null,
    bearer: null,
    clientToken: null,
    ready: false,
  };

  function normalizeHeaders(headers) {
    if (!headers) return {};
    if (headers instanceof Headers) return Object.fromEntries(headers.entries());
    if (Array.isArray(headers)) return Object.fromEntries(headers);
    return headers;
  }

  function persistState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Failed to persist Spotify state:", error);
    }
  }

  function checkReady() {
    if (state.cluster && state.deviceId && state.bearer && state.clientToken && !state.ready) {
      state.ready = true;
      persistState();
      window.dispatchEvent(new CustomEvent("spotify-state-ready", { detail: state }));
      console.log("Spotify state ready:", state);
    }
  }

  persistState();

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const url = typeof args[0] === "string" ? args[0] : (args[0] && args[0].url ? args[0].url : "");
    if (!/https?:\/\/[^/]*\.spotify\.com/.test(url)) return response;

    const headers = normalizeHeaders(args[1] && args[1].headers ? args[1].headers : null);
    const auth = headers.authorization || headers.Authorization;
    if (auth && auth.startsWith("Bearer ") && !state.bearer) {
      state.bearer = auth;
      persistState();
      checkReady();
    }

    const requestClientToken = headers["client-token"] || headers["Client-Token"];
    if (requestClientToken && !state.clientToken) {
      state.clientToken = requestClientToken;
      persistState();
      checkReady();
    }

    if (url.includes("clienttoken.spotify.com")) {
      response
        .clone()
        .json()
        .then((json) => {
          const responseToken =
            json && json.granted_token && json.granted_token.token
              ? json.granted_token.token
              : null;
          if (responseToken && !state.clientToken) {
            state.clientToken = responseToken;
            persistState();
            checkReady();
          }
        })
        .catch(() => {});
    }

    const method = (args[1] && args[1].method ? args[1].method : "").toUpperCase();
    if (url.includes("track-playback/v1/devices") && method === "POST") {
      const clusterMatch = url.match(/https?:\/\/([\w-]+)-spclient\.spotify\.com/);
      if (clusterMatch && !state.cluster) {
        state.cluster = clusterMatch[1];
        persistState();
      }

      try {
        const body = JSON.parse(args[1] && args[1].body ? args[1].body : "{}");
        if (body && body.device && body.device.device_id && !state.deviceId) {
          state.deviceId = body.device.device_id;
          persistState();
          checkReady();
        }
      } catch (error) {
        console.warn("track-playback body parse error:", error);
      }
    }

    return response;
  };
})();
