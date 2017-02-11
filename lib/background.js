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
        this.init();
    }

    getIconState(state) {
        return {
            path: state ? {
                48: '../icons/sokhan-48.png'
            } : {
                48: '../icons/sokhan-48-off.png'
            }
        };
    }

    playAudio(type) {
        this.audio[type].play();
    }

    init() {
        let self = this;
        chrome.storage.onChanged.addListener(function(changes) {
            if (changes.active) {
                self.isActive = changes.active.newValue;
                self.playAudio('ding');
                self.setIcon(self.getIconState(self.isActive));
            }
        });

        chrome.commands.onCommand.addListener(function(command) {
            console.log('Command:', command);
            if (command === 'Ctrl+Right') {
                self.rate += 0.1;
                self.storage.set({'rate': self.rate});
                self.playAudio('volume');
            } else if (command === 'Ctrl+Left') {
                self.rate -= 0.1;
                self.storage.set({'rate': self.rate});
                self.playAudio('volume');
            }
        });

        chrome.storage.sync.get('active', resp => {
            self.isActive = (typeof resp.active === 'boolean' ? resp.active : true);
            self.setIcon(self.getIconState(self.isActive));
        });
        chrome.tabs.onCreated.addListener(() => this.playAudio('open'));
        chrome.tabs.onRemoved.addListener(() => this.playAudio('trash'));
        chrome.tabs.onActivated.addListener(() => this.playAudio('swoosh'));
        chrome.management.onEnabled.addListener(() => this.playAudio('ding'));
    }
}

new State();