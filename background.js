chrome.runtime.onStartup.addListener(function () {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener(function (message) {
  if (message.action === "setMode") {
    const { mode } = message.data;
    console.log("🚀 ~ file: background.js:8 ~ mode:", mode);
    // scan existing pages
    chrome.tabs.query({}, function (tabs) {
      console.log("🚀 ~ file: background.js:20 ~ tabs:", tabs);

      tabs.forEach((tab) => {
        if (!tab.id || (!tab.pendingUrl && !tab.url)) {
          return;
        }
        console.log("🚀 ~ file: background.js:26 ~ mode.siteToBlock?.some ~ mode.siteToBlock:", mode.siteToBlock)
        console.log("🚀 ~ file: background.js:27 ~ mode.siteToBlock?.some ~ tab.url:", tab.url)
        console.log("🚀 ~ file: background.js:28 ~ mode.siteToBlock?.some ~ tab.pendingUrl:", tab.pendingUrl)
        console.log("🚀 ~ file: background.js:30 ~ mode.siteToBlock?.some ~ mode.siteToBlock:", mode.siteToBlock)
        if (
          mode.siteToBlock?.some((site) => {
            console.log(
              "🚀 ~ file: background.js:20 ~ tabs.forEach ~ site:",
              site
            );

            return tab.url.includes(site) || tab.pendingUrl?.includes(site);
          })
        ) {
          console.log("trigger remove tab");
          chrome.tabs.remove(tab.id);
        }
      });
    });
    // add listerner for url change
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
      if (!changeInfo.url) {
        return;
      }

      if (
        mode.siteToBlock?.some((site) => {
          return changeInfo.url?.includes(site);
        })
      ) {
        chrome.tabs.remove(tabId);
      }
    });
  }
});
