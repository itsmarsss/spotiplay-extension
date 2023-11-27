chrome.storage.local.get("spotifyTabId", function (result) {
  const spotifyTabId = result.spotifyTabId;
  if (spotifyTabId) {
    chrome.tabs.get(spotifyTabId, function (tab) {
      if (chrome.runtime.lastError || !tab) {
        chrome.tabs.create(
          { url: "https://open.spotify.com/", active: false },
          function (newTab) {
            chrome.storage.local.set({ spotifyTabId: newTab.id });
          }
        );
      } else {
        chrome.tabs.update(spotifyTabId, { active: false });
      }
    });
  } else {
    chrome.tabs.create(
      { url: "https://open.spotify.com/", active: false },
      function (newTab) {
        chrome.storage.local.set({ spotifyTabId: newTab.id });
      }
    );
  }
});

function messageContentScript(message, callback) {
  chrome.storage.local.get("spotifyTabId", function (data) {
    const tabId = data.spotifyTabId;
    if (tabId) {
      chrome.tabs.sendMessage(tabId, message, function (response) {
        if (callback) {
          callback(response);
        }
      });
    }
  });
}

export default messageContentScript;
