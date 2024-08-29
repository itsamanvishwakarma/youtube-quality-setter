const QUALITY_MENU_SELECTOR = ".ytp-quality-menu .ytp-menuitem";
const SETTINGS_BUTTON_SELECTOR = ".ytp-settings-button";
const PANEL_MENU_SELECTOR = ".ytp-panel-menu";
const QUALITY_OPTION_TEXT = "Quality";
const URL_CHANGE_DELAY = 2000;
const MENU_INTERACTION_DELAY = 500;

class YouTubeQualitySetter {
  constructor() {
    this.lastUrl = location.href;
    this.urlObserver = null;
    this.initializeUrlObserver();
    this.setInitialQuality();
  }

  initializeUrlObserver() {
    this.urlObserver = new MutationObserver(this.handleUrlChange.bind(this));
    this.urlObserver.observe(document, { subtree: true, childList: true });
  }

  handleUrlChange() {
    const currentUrl = location.href;
    if (currentUrl !== this.lastUrl) {
      this.lastUrl = currentUrl;
      this.setQualityAfterDelay();
    }
  }

  setInitialQuality() {
    this.setQualityAfterDelay();
  }

  setQualityAfterDelay() {
    chrome.storage.sync.get("preferredQuality", (data) => {
      if (data.preferredQuality && data.preferredQuality !== "auto") {
        setTimeout(
          () => this.setVideoQuality(data.preferredQuality),
          URL_CHANGE_DELAY
        );
      }
    });
  }

  async setVideoQuality(quality) {
    const menuButton = document.querySelector(SETTINGS_BUTTON_SELECTOR);
    if (!menuButton) return;

    menuButton.click();
    await this.wait(MENU_INTERACTION_DELAY);

    const qualityMenu = document.querySelector(PANEL_MENU_SELECTOR);
    if (!qualityMenu) {
      menuButton.click();
      return;
    }

    const qualityOptions = qualityMenu.querySelectorAll(".ytp-menuitem");
    for (const option of qualityOptions) {
      if (option.textContent.includes(QUALITY_OPTION_TEXT)) {
        option.click();
        await this.wait(MENU_INTERACTION_DELAY);

        const specificQualityOptions = document.querySelectorAll(
          QUALITY_MENU_SELECTOR
        );
        for (const qualityOption of specificQualityOptions) {
          if (qualityOption.textContent.includes(quality)) {
            qualityOption.click();
            return;
          }
        }

        menuButton.click();
        return;
      }
    }

    menuButton.click();
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

new YouTubeQualitySetter();
