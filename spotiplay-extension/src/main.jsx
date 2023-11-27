import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import messageContentScript from "./Controller";
import manifest from "./manifest.json";
import contentScript from "./contentScript.js";

console.log(manifest.name);

function Main() {
  const [url, setURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png"
  );
  const [titleURL, setTitleURL] = useState("");
  const [authorURL, setAuthorURL] = useState("");
  const [title, setTitle] = useState("Pending Title...");
  const [author, setAuthor] = useState("Pending Author...");
  const [hearted, setHearted] = useState(false);

  const [shuffled, setShuffled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [repeated, setRepeated] = useState("off");

  const [muted, setMuted] = useState(false);

  const [position, setPosition] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const volumeEditing = useRef(false);
  const trackEditing = useRef(false);

  const fetchData = () => {
    // Simulated asynchronous data fetch/update
    messageContentScript({ action: "info" }, (info) => {
      setURL(info.url);
      setTitleURL(info.titleURL);
      setAuthorURL(info.authorURL);
      setTitle(info.title);
      setAuthor(info.author);
      setHearted(info.hearted);

      setShuffled(info.shuffled);
      setPaused(info.paused);
      setRepeated(info.repeated);

      setMuted(info.muted);
      if (!volumeEditing.current) {
        document.getElementById("volumeLvl").value = info.muted
          ? 0
          : info.volume * 100;
      }

      setPosition(info.position);
      setDuration(info.duration);

      if (!trackEditing.current) {
        document.getElementById("track").value =
          (timeStringToSeconds(info.position) /
            timeStringToSeconds(info.duration)) *
          100;
      }
    });
  };

  // Fetch data initially and update it periodically
  useEffect(() => {
    fetchData(); // Fetch initial data

    const interval = setInterval(() => {
      fetchData(); // Fetch data at regular intervals
    }, 250); // Every 500 milliseconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const volumeInput = () => {
    volumeEditing.current = true;
  };
  const volumeChange = () => {
    volumeEditing.current = false;
    messageContentScript({
      action: "volume",
      value: document.getElementById("volumeLvl").value / 100,
    });
  };

  const trackInput = () => {
    trackEditing.current = true;
  };
  const trackChange = () => {
    trackEditing.current = false;
    messageContentScript({
      action: "track",
      value: document.getElementById("track").value / 100,
    });
  };

  return (
    <React.StrictMode>
      <App
        url={url}
        titleURL={titleURL}
        authorURL={authorURL}
        title={title}
        author={author}
        hearted={hearted}
        shuffled={shuffled}
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
