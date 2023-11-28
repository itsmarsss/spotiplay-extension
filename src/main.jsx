import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import messageContentScript from "./Controller";
import manifest from "./manifest.json";

console.log(manifest.name);

function Main() {
  const [url, setURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png"
  );
  const [titleURL, setTitleURL] = useState("");
  const [authorURL, setAuthorURL] = useState("");
  const [title, setTitle] = useState("Pending Title...");
  const [author, setAuthor] = useState("Pending Author...");

  const [shuffled, setShuffled] = useState(false);
  const [shuffleMode, setShuffleMode] = useState("off");
  const [paused, setPaused] = useState(false);
  const [repeated, setRepeated] = useState("off");

  const [muted, setMuted] = useState(false);

  const [position, setPosition] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const volumeEditing = useRef(false);
  const trackEditing = useRef(false);
  const volumeDebounceRef = useRef(null);
  const trackDebounceRef = useRef(null);

  const first = useRef(true);
  const VOLUME_DEBOUNCE_MS = 90;
  const TRACK_DEBOUNCE_MS = 120;

  const sendVolumeCommand = () => {
    const volumeNode = document.getElementById("volumeLvl");
    if (!volumeNode) return;
    messageContentScript({
      action: "volume",
      value: volumeNode.value / 100,
    });
  };

  const sendTrackCommand = () => {
    const trackNode = document.getElementById("track");
    if (!trackNode) return;
    messageContentScript({
      action: "track",
      value: trackNode.value / 100,
    });
  };

  const fetchData = () => {
    if (first.current) {
      function setupOverlay(rangeId, overlayId) {
        const range = document.getElementById(rangeId);
        const overlay = document.getElementById(overlayId);

        ["input", "change"].forEach((value) => {
          range.addEventListener(value, () => {
            const borderWidth = range.style.height.replace("px", "");
            const rangeWidth = range.getBoundingClientRect().width;
            const rangeLeft = range.getBoundingClientRect().left;
            const percent = range.value / 100;

            const overlayOffset =
              percent * (rangeWidth - 2 * borderWidth) + rangeLeft;

            overlay.style.left = `${overlayOffset}px`;
            console.log(borderWidth);
          });
        });

        overlay.addEventListener("mousedown", (event) => {
          const borderWidth = range.style.height.replace("px", "");
          const clickOffset =
            event.clientX -
            range.getBoundingClientRect().left -
            2 * borderWidth;
          const value =
            (clickOffset / range.getBoundingClientRect().width) * 100 -
            borderWidth / 2;

          range.value = value;
          range.dispatchEvent(new Event("input"));
        });
      }

      setupOverlay("track", "track_overlay");
      setupOverlay("volumeLvl", "volume_overlay");
    }

    first.current = false;

    messageContentScript({ action: "info" }, (info) => {
      if (!info || typeof info !== "object") {
        return;
      }

      setURL(info.url);
      setTitleURL(info.titleURL);
      setAuthorURL(info.authorURL);
      setTitle(info.title);
      setAuthor(info.author);

      setShuffled(info.shuffled);
      setShuffleMode(info.shuffleMode || "off");
      setPaused(info.paused);
      setRepeated(info.repeated);

      setMuted(info.muted);
      if (!volumeEditing.current) {
        const volumeNode = document.getElementById("volumeLvl");
        if (volumeNode) {
          volumeNode.value = info.muted ? 0 : info.volume * 100;
          volumeNode.dispatchEvent(new Event("change"));
        }
      }

      setPosition(info.position);
      setDuration(info.duration);
      const trackNode = document.getElementById("track");
      if (trackNode) {
        trackNode.dispatchEvent(new Event("change"));
      }

      if (!trackEditing.current && trackNode) {
        const durationSeconds = timeStringToSeconds(info.duration);
        const positionSeconds = timeStringToSeconds(info.position);
        trackNode.value =
          durationSeconds > 0 ? (positionSeconds / durationSeconds) * 100 : 0;
      }
    });
  };

  // Fetch data initially and update it periodically
  useEffect(() => {
    fetchData(); // Fetch initial data

    const interval = setInterval(() => {
      fetchData(); // Fetch data at regular intervals
    }, 250); // Every 500 milliseconds

    return () => {
      clearInterval(interval);
      clearTimeout(volumeDebounceRef.current);
      clearTimeout(trackDebounceRef.current);
    };
  }, []);

  const volumeInput = () => {
    volumeEditing.current = true;
    clearTimeout(volumeDebounceRef.current);
    volumeDebounceRef.current = setTimeout(sendVolumeCommand, VOLUME_DEBOUNCE_MS);
  };
  const volumeChange = () => {
    volumeEditing.current = false;
    clearTimeout(volumeDebounceRef.current);
    sendVolumeCommand();
  };

  const trackInput = () => {
    trackEditing.current = true;
    clearTimeout(trackDebounceRef.current);
    trackDebounceRef.current = setTimeout(sendTrackCommand, TRACK_DEBOUNCE_MS);
  };
  const trackChange = () => {
    trackEditing.current = false;
    clearTimeout(trackDebounceRef.current);
    sendTrackCommand();
  };

  return (
    <React.StrictMode>
      <App
        url={url}
        titleURL={titleURL}
        authorURL={authorURL}
        title={title}
        author={author}
        shuffled={shuffled}
        shuffleMode={shuffleMode}
        paused={paused}
        repeated={repeated}
        muted={muted}
        volumeInput={volumeInput}
        volumeChange={volumeChange}
        trackInput={trackInput}
        trackChange={trackChange}
        position={position}
        duration={duration}
      />
    </React.StrictMode>
  );
}

function timeStringToSeconds(timeString) {
  const [minutes, seconds] = timeString.split(":").map(Number);
  return minutes * 60 + seconds;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
