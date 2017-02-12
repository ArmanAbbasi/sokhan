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
/* globals browser */

import chromeApiLayer from '../browser/chromeApiLayer';

/**
 * @name Menu
 * @description Handles the browser menu actions
 * */
class Menu {
    constructor () {
        this.default = {'voiceName': 'Daniel'};
        this.els = {
            male: document.getElementById('male'),
            female: document.getElementById('female'),
            pause: document.getElementById('pause'),
            disable: document.getElementById('disable'),
            aria: document.querySelectorAll('[aria-label]'),
            fallbackLanguage: document.getElementById('languageSelection')
        };
        this.isSokhanActive = true;
        this.init();
    }

    /**
     * @name setDefaults
     * @description Get defaults from chrome store and set them internally
     * */
    setDefaults() {
        chromeApiLayer.getStorage('gender', ({gender}) => {
            if (gender) {
                this.els.male.checked = true;
            } else {
                this.default.voiceName = 'Samantha';
                this.els.female.checked = true;
            }
        });

        chromeApiLayer.getStorage('active', ({active}) => {
            this.isSokhanActive = typeof active === 'boolean' ? active : true;
            chromeApiLayer.setIcon(this.getCurrentIconStatePath());
        });

        chromeApiLayer.getStorage('languageSelection', ({languageSelection}) => {
            if (languageSelection) {
                document.querySelector(`[value="${languageSelection}"]`).selected = true;
            }
        });
    }

    /**
     * @name onStateChange
     * @params {Object} Event object
     * @description On user change action, read text
     * */
    onStateChange({currentTarget}) {
        const type = currentTarget.getAttribute('name');
        let checked = currentTarget.checked;

        if (type === 'active') {
            checked = this.isSokhanActive = !this.isSokhanActive;
            chromeApiLayer.setIcon(this.getCurrentIconStatePath());
        } else if (type === 'gender') {
            checked = currentTarget.value !== 'female';
        } else if (type === 'languageSelection') {
            checked = currentTarget.selectedOptions[0].value;
            chromeApiLayer.speak(`Selected: ${currentTarget.selectedOptions[0].textContent}`);
        }

        chromeApiLayer.setStorage({[type]: checked});
    }

    /**
     * @name onAction
     * @params {Object} Event object
     * @description On user click or hover action, read text
     * */
    onAction ({currentTarget}) {
        if (!this.isSokhanActive) { return; }
        const label = currentTarget.getAttribute('aria-label');
        let text = label === '=' ? currentTarget.textContent.trim() : label;

        if (currentTarget.tagName === 'SELECT') {
            text += `, ${currentTarget.children.length} options to choose from, current selection: ${currentTarget.selectedOptions[0].textContent}, the options are: ${currentTarget.textContent.trim().replace(/\s+/g, ',')}.`;
        }

        chromeApiLayer.speak(text, this.default);
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
     * @name init
     * @description Init settings and bind events
     * */
    init() {
        this.setDefaults();

        this.els.pause.addEventListener('click', e => this.onStateChange(e));
        this.els.male.addEventListener('change', e => this.onStateChange(e));
        this.els.female.addEventListener('change', e => this.onStateChange(e));
        this.els.fallbackLanguage.addEventListener('change', e => this.onStateChange(e));
        this.els.disable.addEventListener('click', () => chromeApiLayer.setDisabled());

        for (let el of this.els.aria) {
            el.addEventListener('mouseover', e => this.onAction(e));
            el.addEventListener('focus', e => this.onAction(e));
        }
    }
}

new Menu();