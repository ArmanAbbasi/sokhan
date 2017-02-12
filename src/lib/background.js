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
/* globals chrome, Audio */

/**
 * @name Background
 * @description This class runs in the background across tabs, doing all the relevant background tasks
 * */
class Background {
    constructor() {
        this.isSokhanActive = true;
        this.audio = {
            open: new Audio('sound/open.mp3'),
            ding: new Audio('sound/ding.mp3'),
            trash: new Audio('sound/trash.mp3'),
            swoosh: new Audio('sound/swoosh.mp3'),
            volume: new Audio('sound/volume.mp3')
        };
        this.speechPlayBackSpeed = 1.0;
        this.bindEvents();
    }

    /**
     * @name getCurrentIconStatePath
     * @returns {Object} Contains path to relevant icon to be displayed
     * @description Checks icon to be displayed based on active state
     * */
    getCurrentIconStatePath() {
        return {
            path: `../images/sokhan-48${this.isSokhanActive ? '' : '-off'}.png`
        };
    }

    /**
     * @name playAudioByType
     * @param {String} type The type of audio to be played
     * @description Plays audio based on given type
     * */
    playAudioByType(type) {
        this.audio[type].play();
    }

    /**
     * @name bindEvents
     * @description Binds actions to triggered events
     * */
    bindEvents() {
        chrome.storage.onChanged.addListener((changes) => {
            if (changes.active) {
                this.isSokhanActive = changes.active.newValue;
                this.playAudioByType('ding');
                chrome.browserAction.setIcon(this.getCurrentIconStatePath());
            }
        });

        chrome.commands.onCommand.addListener((command) => {
            if (command === 'Ctrl+Right') {
                this.speechPlayBackSpeed += 0.1;
                chrome.storage.sync.set({'rate': this.speechPlayBackSpeed});
                this.playAudioByType('volume');
            } else if (command === 'Ctrl+Left') {
                this.speechPlayBackSpeed -= 0.1;
                chrome.storage.sync.set({'rate': this.speechPlayBackSpeed});
                this.playAudioByType('volume');
            }
        });

        chrome.storage.sync.get('active', resp => {
            this.isSokhanActive = typeof resp.active === 'boolean' ? resp.active : true;
            chrome.browserAction.setIcon(this.getCurrentIconStatePath());
        });

        chrome.tabs.onCreated.addListener(() => this.playAudioByType('open'));
        chrome.tabs.onRemoved.addListener(() => this.playAudioByType('trash'));
        chrome.tabs.onActivated.addListener(() => this.playAudioByType('swoosh'));
        chrome.management.onEnabled.addListener(() => this.playAudioByType('ding'));
    }
}

new Background();