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

import chromeApiLayer from '../api/chrome';
import store from '../store';
import audio from '../api/audio';

/**
 * @name Background
 * @description This class runs in the background across tabs, doing all the relevant background tasks
 * */
class Background {
    constructor() {
        this.bindEvents();
    }

    /**
     * @name bindEvents
     * @description Binds actions to triggered events
     * */
    bindEvents() {
        chromeApiLayer.changedStorage(({active}) => {
            if (active) {
                store.setSokhanActive(active.newValue);
                audio.play('ding');
                chromeApiLayer.setIcon(store.getSokhanActive());
            }
        });

        chromeApiLayer.onCommand((command) => {
            if (command === 'Ctrl+Right') {
                store.incrementSpeechRate();
                chromeApiLayer.setStorage({'rate': store.getSpeechRate()});
                audio.play('volume');
            } else if (command === 'Ctrl+Left') {
                store.decrementSpeechRate();
                chromeApiLayer.setStorage({'rate': store.getSpeechRate()});
                audio.play('volume');
            }
        });

        chromeApiLayer.getStorage('active', ({active}) => {
            store.setSokhanActive(active);
            chromeApiLayer.setIcon(store.getSokhanActive());
        });

        chromeApiLayer.onNewTab(() => audio.play('open'));
        chromeApiLayer.onRemovedTab(() => audio.play('trash'));
        chromeApiLayer.onActivatedTab(() => audio.play('swoosh'));
        chromeApiLayer.onEnabled(() => audio.play('ding'));
    }
}

new Background();