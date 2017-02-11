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
/* globals chrome */

class Menu {
    constructor () {
        this.default = {'voiceName': 'Daniel'};
        this.els = {
            male: document.getElementById('male'),
            female: document.getElementById('female'),
            pause: document.getElementById('pause'),
            disable: document.getElementById('disable'),
            autoDetect: document.getElementById('autoDetect'),
            aria: document.querySelectorAll('[aria-label]'),
            fallbackLanguage: document.getElementById('languageSelection')
        };
        this.isSokhanActive = true;
        this.storage = chrome.storage.sync;
        this.setIcon = chrome.browserAction.setIcon;
        this.management = chrome.management;
        this.init();
    }

    setDefaults() {
        this.storage.get('gender', resp => {
            if (resp.gender) {
                this.els.male.checked = true;
            } else {
                this.default.voiceName = 'Samantha';
                this.els.female.checked = true;
            }
        });

        this.storage.get('active', resp => {
            this.isSokhanActive = typeof resp.active === 'boolean' ? resp.active : true;
            this.setIcon(this.getCurrentIconStatePath());
        });

        this.storage.get('autoDetect', resp => {
            if (!resp.autoDetect) {
                this.els.autoDetect.checked = resp.autoDetect;
            }
        });

        this.storage.get('languageSelection', resp => {
            if (resp.languageSelection) {
                document.querySelector('[value="' + resp.languageSelection + '"]').selected = true;
            }
        });
    }

    onStateChange(e) {
        let target = e.currentTarget,
            type = target.getAttribute('name'),
            checked = target.checked;

        if (type === 'active') {
            checked = this.isSokhanActive = !this.isSokhanActive;
            this.setIcon(this.getCurrentIconStatePath());
        } else if (type === 'gender') {
            checked = target.value !== 'female';
        } else if (type === 'languageSelection') {
            checked = target.selectedOptions[0].value;
            this.tts('Selected: ' + target.selectedOptions[0].textContent);
        }

        this.storage.set({[type]: checked});
    }

    onAction (e) {
        if (!this.isSokhanActive) { return; }
        let target = e.currentTarget,
            label = target.getAttribute('aria-label'),
            text = label === '=' ? target.textContent.trim() : label;

        if (target.tagName === 'SELECT') {
            text += (', ' + target.children.length + 'options to choose from, current selection: ' + target.selectedOptions[0].textContent + ', the options are: ' + target.textContent.trim().replace(/\s+/g, ',') + '.');
        }

        this.tts(text);
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

    init() {
        this.setDefaults();
        this.tts = text => chrome.tts.speak(text, this.default);

        this.els.pause.addEventListener('click', e => this.onStateChange(e));
        this.els.male.addEventListener('change', e => this.onStateChange(e));
        this.els.female.addEventListener('change', e => this.onStateChange(e));
        this.els.autoDetect.addEventListener('change', e => this.onStateChange(e));
        this.els.fallbackLanguage.addEventListener('change', e => this.onStateChange(e));

        this.els.disable.addEventListener('click', () => {
            this.management.getSelf(extensionInfo => {
                this.management.setEnabled(extensionInfo.id, false);
            });
        });

        for (let i in this.els.aria) {
            if (this.els.aria.hasOwnProperty(i)) {
                this.els.aria[i].addEventListener('mouseover', e => this.onAction(e));
                this.els.aria[i].addEventListener('focus', e => this.onAction(e));
            }
        }
    }
}

new Menu();