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

import chromeApiLayer from '../browser/chromeApiLayer';
import store from '../store';

/**
 * @name Background
 * @description This class runs in the background across tabs, doing all the relevant background tasks
 * */
class Background {
    constructor() {
        this.audio = {
            open: new Audio('sound/open.mp3'),
            ding: new Audio('sound/ding.mp3'),
            trash: new Audio('sound/trash.mp3'),
            swoosh: new Audio('sound/swoosh.mp3'),
            volume: new Audio('sound/volume.mp3')
        };
        this.bindEvents();
    }

    /**
     * @name getCurrentIconStatePath
     * @returns {Object} Contains path to relevant icon to be displayed
     * @description Checks icon to be displayed based on active state
     * */
    getCurrentIconStatePath() {
        return {
            path: `../images/sokhan-48${store.getSokhanActive() ? '' : '-off'}.png`
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
        chromeApiLayer.changedStorage(({active}) => {
            if (active) {
                store.setSokhanActive(active.newValue);
                this.playAudioByType('ding');
                chromeApiLayer.setIcon(this.getCurrentIconStatePath());
            }
        });

        chromeApiLayer.onCommand((command) => {
            if (command === 'Ctrl+Right') {
                store.incrementSpeechRate();
                chromeApiLayer.setStorage({'rate': store.getSpeechRate()});
                this.playAudioByType('volume');
            } else if (command === 'Ctrl+Left') {
                store.decrementSpeechRate();
                chromeApiLayer.setStorage({'rate': store.getSpeechRate()});
                this.playAudioByType('volume');
            }
        });

        chromeApiLayer.getStorage('active', ({active}) => {
            store.setSokhanActive(active);
            chromeApiLayer.setIcon(this.getCurrentIconStatePath());
        });

        chromeApiLayer.onNewTab(() => this.playAudioByType('open'));
        chromeApiLayer.onRemovedTab(() => this.playAudioByType('trash'));
        chromeApiLayer.onActivatedTab(() => this.playAudioByType('swoosh'));
        chromeApiLayer.onEnabled(() => this.playAudioByType('ding'));
    }
}

new Background();