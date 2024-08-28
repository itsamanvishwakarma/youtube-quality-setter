chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.sync.set({ preferredQuality: "auto" }, function () {
      console.log("Default quality set to auto");
    });
  }
});

// Add message listeners here if needed in the future
