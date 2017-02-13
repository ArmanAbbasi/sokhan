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

/**
 * @name Menu
 * @description Handles the api menu actions
 * */
class Menu {
    constructor () {
        this.default = {'voiceName': 'Daniel'};
        this.els = {
            change: {
                male: document.getElementById('male'),
                female: document.getElementById('female'),
                fallbackLanguage: document.getElementById('languageSelection')
            },

            click: {
                pause: document.getElementById('pause'),
                disable: document.getElementById('disable')
            },

            focus: {
                aria: document.querySelectorAll('[aria-label]')
            }
        };
        this.init();
    }

    /**
     * @name setDefaults
     * @description Get defaults from chrome store and set them internally
     * */
    setDefaults() {
        chromeApiLayer.getStorage('gender', ({gender}) => {
            if (gender) {
                this.els.change.male.checked = true;
            } else {
                this.default.voiceName = 'Samantha';
                this.els.change.female.checked = true;
            }
        });

        chromeApiLayer.getStorage('active', ({active}) => {
            store.setSokhanActive(active);
            chromeApiLayer.setIcon(store.getSokhanActive());
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
            checked = store.toggleSokhanActive();
            chromeApiLayer.setIcon(store.getSokhanActive());
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
        const label = currentTarget.getAttribute('aria-label');
        let text = label === '=' ? currentTarget.textContent.trim() : label;

        if (currentTarget.tagName === 'SELECT') {
            text += `, ${currentTarget.children.length} options to choose from, current selection: ${currentTarget.selectedOptions[0].textContent}, the options are: ${currentTarget.textContent.trim().replace(/\s+/g, ',')}.`;
        }

        chromeApiLayer.speak(text, this.default);
    }

    /**
     * @name bindEvents
     * @description Bind all relevant events
     * */
    bindEvents() {
        this.els.click.pause.addEventListener('click', e => this.onStateChange(e));
        this.els.click.disable.addEventListener('click', () => chromeApiLayer.setDisabled());

        for(let key in this.els.click) {
            if (this.els.click.hasOwnProperty(key)) {
                this.els.click[key].addEventListener('blur', () => chromeApiLayer.stopSpeak());
            }
        }

        for(let key in this.els.change) {
            if (this.els.change.hasOwnProperty(key)) {
                this.els.change[key].addEventListener('change', e => this.onStateChange(e));
                this.els.change[key].addEventListener('blur', () => chromeApiLayer.stopSpeak());
            }
        }

        for (let el of this.els.focus.aria) {
            el.addEventListener('focus', e => this.onAction(e));
            el.addEventListener('blur', () => chromeApiLayer.stopSpeak());
        }
    }

    /**
     * @name init
     * @description Init everything
     * */
    init() {
        this.setDefaults();
        this.bindEvents();
    }
}

new Menu();