/* globals chrome */

export default {
    getStorage: () => chrome.storage.sync.get,
    setStorage: () => chrome.storage.sync.set,
    setIcon: () => chrome.browserAction.setIcon,
    setDisabled: () => chrome.management.getSelf(extensionInfo => {
        chrome.management.setEnabled(extensionInfo.id, false);
    }),
    speak: () => chrome.tts.speak
};