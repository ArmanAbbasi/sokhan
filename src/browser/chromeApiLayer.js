/* globals chrome, speechSynthesis */

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
    speak: (() => {
        if (chrome.tts && chrome.tts.speak) {
            return chrome.tts.speak;
        }

        let utter = new SpeechSynthesisUtterance('');

        return (text) => {
            utter.text = text;
            speechSynthesis.speak(utter);
        };
    })(),
    stopSpeak: (() => {
        if (chrome.tts && chrome.tts.stop) {
            return chrome.tts.stop;
        }

        return speechSynthesis.cancel;
    })(),
    onCommand: chrome.commands && chrome.commands.onCommand.addListener,
    onNewTab: chrome.tabs && chrome.tabs.onCreated.addListener,
    onRemovedTab: chrome.tabs && chrome.tabs.onRemoved.addListener,
    onActivatedTab: chrome.tabs && chrome.tabs.onActivated.addListener,
    onEnabled: chrome.management && chrome.management.onEnabled.addListener
};