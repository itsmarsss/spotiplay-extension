(() => {
  function injectFetchInterceptor() {
    if (document.getElementById("spotiplay-page-interceptor")) return;

    const script = document.createElement("script");
    script.id = "spotiplay-page-interceptor";
    script.src = chrome.runtime.getURL("pageInterceptor.js");
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  }

  injectFetchInterceptor();
})();
