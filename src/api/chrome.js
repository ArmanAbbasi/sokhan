/**
 * Copyright (C) 2016  Arman Abbasi
 *
 * Sokhan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 */
/* globals chrome, speechSynthesis, SpeechSynthesisUtterance */

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
    speak: chrome.tts && chrome.tts.speak,
    stopSpeak: () => {
        return (chrome.tts && chrome.tts.stop()) || speechSynthesis.cancel();
    },
    isSpeaking: () => {
        return speechSynthesis.speaking;
    },
    onCommand: chrome.commands && chrome.commands.onCommand.addListener,
    onNewTab: chrome.tabs && chrome.tabs.onCreated.addListener,
    onRemovedTab: chrome.tabs && chrome.tabs.onRemoved.addListener,
    onActivatedTab: chrome.tabs && chrome.tabs.onActivated.addListener,
    onEnabled: chrome.management && chrome.management.onEnabled.addListener,
    detectLanguage: chrome.i18n.detectLanguage
};