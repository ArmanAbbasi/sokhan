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

//import config from './config';
import helper from './helper';
// import store from '../store';
import chromeApiLayer from '../api/chrome';
import voice from '../api/voice';

class Sokhan {
    constructor() {
        this.bindEvents();
        this.init();
    }

    bindEvents() {
        helper.watch('activeElement', document.activeElement, (el) => {
            if (voice.isSpeaking()) {
                voice.stop();
            }

            voice.speak(helper.getTextFromEl(el));
        });
    }

    identifySite(lang) {
        console.log(lang);
        voice.speak(helper.getSiteTitle());
    }

    init() {
        helper.getSiteLanguage().then(this.identifySite);
    }

    // document.addEventListener('keydown', e => this.onKeyDown(e));
    // onKeyDown(e) {
    //     let key = e.key;
    //
    //     if (key === 'Control') {
    //         this.stopSpeech();
    //         store.toggleSokhanActive();
    //         chrome.storage.sync.set({active: store.getSokhanActive()});
    //     } else if (key === 'Shift') {
    //         this.stopSpeech();
    //         speechSynthesis.speak(window.sokhanConf.utter);
    //     } else {
    //         this.stopSpeech();
    //         this.sokhan(key);
    //     }
    // }
    //
    // init() {
    //     chrome.storage.onChanged.addListener((changes) => {
    //         if (changes.active) {
    //             this.isActive = changes.active.newValue;
    //         } else if (changes.autoDetect) {
    //             this.config.autoDetect = changes.autoDetect.newValue;
    //         } else if (changes.gender) {
    //             this.config.defaultGender = changes.gender.newValue;
    //             this.config.altGender = changes.gender.oldValue;
    //         } else if (changes.rate) {
    //             this.config.rate = changes.rate.newValue;
    //         }
    //         this.config.setLanguageDefaults();
    //     });

}

new Sokhan();