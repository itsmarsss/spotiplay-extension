chrome.storage.local.get("spotifyTabId", function (result) {
  const spotifyTabId = result.spotifyTabId;
  if (spotifyTabId) {
    // Check if the tab ID exists before trying to focus on it
    chrome.tabs.get(spotifyTabId, function (tab) {
      if (chrome.runtime.lastError || !tab) {
        // If the tab doesn't exist, handle it accordingly (e.g., re-open the tab)
        // For demonstration purposes, let's open a new Spotify tab if it doesn't exist
        chrome.tabs.create(
          { url: "https://open.spotify.com/", active: false },
          function (newTab) {
            chrome.storage.local.set({ spotifyTabId: newTab.id });
          }
        );
      } else {
        // The tab exists, so focus on it
        chrome.tabs.update(spotifyTabId, { active: false });
      }
    });
  } else {
    // Handle the case when the tab ID doesn't exist in storage
    // For demonstration purposes, let's open a new Spotify tab and save its ID
    chrome.tabs.create(
      { url: "https://open.spotify.com/", active: false },
      function (newTab) {
        chrome.storage.local.set({ spotifyTabId: newTab.id });
      }
    );
  }
});

function messageContentScript(message, callback) {
  console.log(message);
  chrome.storage.local.get("spotifyTabId", function (data) {
    const tabId = data.spotifyTabId;
    if (tabId) {
      chrome.tabs.sendMessage(tabId, message, function (response) {
        callback(response);
      });
    }
  });
}

export default messageContentScript;
