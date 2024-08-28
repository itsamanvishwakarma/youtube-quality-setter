document.addEventListener("DOMContentLoaded", function () {
  var qualitySelector = document.getElementById("qualitySelector");

  // Load saved quality setting
  chrome.storage.sync.get("preferredQuality", function (data) {
    if (data.preferredQuality) {
      qualitySelector.value = data.preferredQuality;
    }
  });

  // Save quality setting when changed
  qualitySelector.addEventListener("change", function () {
    var selectedQuality = qualitySelector.value;
    chrome.storage.sync.set({ preferredQuality: selectedQuality }, function () {
      console.log("Quality setting saved: " + selectedQuality);
    });
  });
});
