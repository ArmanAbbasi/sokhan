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
/* globals Audio, chrome */

class State {
    constructor() {
        this.isActive = true;
        this.audio = {
            open: new Audio('sound/open.mp3'),
            ding: new Audio('sound/ding.mp3'),
            trash: new Audio('sound/trash.mp3'),
            swoosh: new Audio('sound/swoosh.mp3'),
            volume: new Audio('sound/volume.mp3')
        };
        this.setIcon = chrome.browserAction.setIcon;
        this.storage = chrome.storage.sync;
        this.rate = 1.0;
        this.bindEvents();
    }

    getIconState(state) {
        return {
            path: state ? {
                48: '../images/sokhan-48.png'
            } : {
                48: '../images/sokhan-48-off.png'
            }
        };
    }

    playAudio(type) {
        this.audio[type].play();
    }

    bindEvents() {
        chrome.storage.onChanged.addListener((changes) => {
            if (changes.active) {
                this.isActive = changes.active.newValue;
                this.playAudio('ding');
                this.setIcon(this.getIconState(this.isActive));
            }
        });

        chrome.commands.onCommand.addListener((command) => {
            if (command === 'Ctrl+Right') {
                this.rate += 0.1;
                this.storage.set({'rate': this.rate});
                this.playAudio('volume');
            } else if (command === 'Ctrl+Left') {
                this.rate -= 0.1;
                this.storage.set({'rate': this.rate});
                this.playAudio('volume');
            }
        });

        chrome.storage.sync.get('active', resp => {
            this.isActive = (typeof resp.active === 'boolean' ? resp.active : true);
            this.setIcon(this.getIconState(this.isActive));
        });

        chrome.tabs.onCreated.addListener(() => this.playAudio('open'));
        chrome.tabs.onRemoved.addListener(() => this.playAudio('trash'));
        chrome.tabs.onActivated.addListener(() => this.playAudio('swoosh'));
        chrome.management.onEnabled.addListener(() => this.playAudio('ding'));
    }
}

new State();