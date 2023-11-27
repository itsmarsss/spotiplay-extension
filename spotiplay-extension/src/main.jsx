import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import messageContentScript from "./Controller";
import manifest from "./manifest.json";
import contentScript from "./contentScript.js";

console.log(manifest.name);

function Main() {
  const [url, setURL] = useState("");
  const [titleURL, setTitleURL] = useState("");
  const [authorURL, setAuthorURL] = useState("");
  const [title, setTitle] = useState("Title");
  const [author, setAuthor] = useState("Author");
  const [hearted, setHearted] = useState(false);

  const fetchData = () => {
    // Simulated asynchronous data fetch/update
    messageContentScript({ action: "info" }, (info) => {
      console.log(info);
      setURL(info.url);
      setTitleURL(info.titleURL);
      setAuthorURL(info.authorURL);
      setTitle(info.title);
      setAuthor(info.author);
      setHearted(info.hearted);
    });
  };

  // Fetch data initially and update it periodically
  useEffect(() => {
    fetchData(); // Fetch initial data

    const interval = setInterval(() => {
      fetchData(); // Fetch data at regular intervals
    }, 500); // Every 5 seconds - change as needed

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <React.StrictMode>
      <App
        url={url}
        titleURL={titleURL}
        authorURL={authorURL}
        title={title}
        author={author}
        hearted={hearted}
      />
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
