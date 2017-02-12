/* globals chrome */

export default {
    getStorage: chrome.storage.sync.get,
    setStorage: chrome.storage.sync.set,
    changedStorage: chrome.storage.onChanged.addListener,
    setIcon: (isOn) => {
        chrome.browserAction.setIcon({
            path: `../images/sokhan-48${isOn ? '' : '-off'}.png`
        });
    },
    setDisabled: () => chrome.management.getSelf(extensionInfo => {
        chrome.management.setEnabled(extensionInfo.id, false);
    }),
    speak: chrome.tts.speak,
    stopSpeak: chrome.tts.stop,
    onCommand: chrome.commands.onCommand.addListener,
    onNewTab: chrome.tabs.onCreated.addListener,
    onRemovedTab: chrome.tabs.onRemoved.addListener,
    onActivatedTab: chrome.tabs.onActivated.addListener,
    onEnabled: chrome.management.onEnabled.addListener
};