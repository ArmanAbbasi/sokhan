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
/* globals chrome, speechSynthesis */

import config from './config';
import helper from './helper';


class Sokhan {
    constructor() {
        this.isSokhanActive = true;
        this.foundTextTimeout = null;

        this.bindEvents();
    }

    bindEvents() {
        chrome.storage.sync.get('active', resp => {
            this.isSokhanActive = typeof resp.active === 'boolean' ? resp.active : true;
        });

        document.addEventListener('readystatechange', () => {
            if (document.readyState === 'complete') {
                this.init();
            }
        });
    }

    onMouseOver(e) {
        if (this.foundTextTimeout) {
            clearTimeout(this.foundTextTimeout);
        }

        this.foundTextTimeout = setTimeout(() => {
            this.analyseElementAndFindText(e.target);
        }, 250);
    }

    handleSpecialElements(el, isOnLoad) {
        let text = '';
        let numItems;

        if (el.tagName === 'SPAN' || el.tagName === 'DIV' || el.tagName === 'IMG') {
            if (el.tagName !== 'IMG' || (el.tagName === 'IMG' && !el.alt)) {
                el = helper.findParentLink(el);
                text = el.textContent || el.title || el.getAttribute('aria-label');
            } else if (el.tagName === 'IMG' && el.alt) {
                text = el.alt || el.title || el.getAttribute('aria-label');
            }
        } else if (el.tagName === 'A') {
            text = el.textContent || el.title || el.getAttribute('aria-label');
        } else {
            if (el.tagName === 'SELECT') {
                numItems = el.children.length + ' items, current selection: ';
            }
            text = (numItems || '') + (el.tagName === 'SELECT' ? (el.selectedOptions[0].textContent || el.getAttribute('aria-label') || 'not defined') : (el.placeholder || el.value || el.textContent || el.title || el.getAttribute('aria-label') || ''));
        }

        let type = this.getTextForTypeOfElement(el);

        if (!text && el.getAttribute('aria-labelledby')) {
            let textEl = document.getElementById(el.getAttribute('aria-labelledby'));
            if (textEl) {
                text = (textEl.textContent || '').trim();
            }
        }

        if (type) {
            this.stopSpeech();
            this.sokhan((isOnLoad ? 'Active field: ' : '') + (type + ': ' + text));
        }
    }

    handleTextFields(el) {
        const text = (helper.getAttribute(el, 'aria-label') || el.textContent || el.alt || '').trim();
        const largeSpaces = text && text.match(/\s{2,}/g);
        const largeSpacesSum = largeSpaces && largeSpaces.length;

        if (text && text.length > 2 && largeSpacesSum < 4 && text.indexOf('<div>') === -1 && text.indexOf('<span>') === -1) {
            this.stopSpeech();
            this.sokhan(text);
        }
    }

    analyseElementAndFindText(target, isOnLoad) {
        if (helper.getAttribute(target, 'aria-hidden')) { return; }
        this[config.elementTextMap[target.tagName] ? 'handleSpecialElements' : 'handleTextFields'].call(this, target, isOnLoad);
    }

    getTextForTypeOfElement(el) {
        let title = config.elementTextMap[el.tagName];

        return (typeof title === 'string' ? title : (() => {
            let labelEl = document.querySelector('[for="' + el.id + '"]');
            let text = (labelEl && labelEl.textContent) || '';
            let checked = (el.type === 'checkbox' || el.type === 'radio') ? (el.checked ? 'checked': 'unchecked') : '';
            let relatedText = text ? (' for ' + text) : '';

            return this.config.elementTextMap[el.tagName][el.type] + checked + relatedText;
        })());
    }

    static stopSpeech() {
        speechSynthesis.cancel();
    }

    sokhan(text) {
        if (!this.isSokhanActive) {
            return;
        }

        //Bug in Chrome makes browser crash.
        text = text.replace(/\.\w+/, (match) => match.replace('.', ' . '));

        if (!config.utter || !config.utter.voice || !speechSynthesis) {
            config.setLanguageDefaults();
        }

        config.utter.text = text;
        speechSynthesis.speak(config.utter);
    }

    bindEventToInputField(e) {
        this.handleSpecialElements(e.currentTarget);
        e.preventDefault();
        e.stopPropagation();
    }

    onKeyDown(e) {
        let key = e.key;

        if (key === 'Control') {
            this.stopSpeech();
            this.isSokhanActive = !this.isSokhanActive;
            chrome.storage.sync.set({active: this.isSokhanActive});
        } else if (key === 'Shift') {
            this.stopSpeech();
            speechSynthesis.speak(window.sokhanConf.utter);
        } else {
            this.stopSpeech();
            this.sokhan(key);
        }
    }

    onSelectMenuClicked(e) {
        this.stopSpeech();
        let target = e.currentTarget,
            choices = target.children,
            str = 'Choices: ';

        for (let i in choices) {
            if (choices.hasOwnProperty(i) && choices[i].textContent) {
                str += choices[i].textContent + ', ';
            }
        }

        this.sokhan(str);
    }

    onSelectMenuChanged(e) {
        this.stopSpeech();
        let el = e.currentTarget;
        let str = 'Selection menu changed to ' + (el.selectedOptions[0].textContent || el.getAttribute('aria-label') || 'not defined');

        this.sokhan(str);
    }

    init() {
        debugger;
        this.sokhan(document.title || document.querySelector('h1').textContent || 'unknown website title ');
        setTimeout(() => {
            this.analyseElementAndFindText(document.activeElement, true);
        }, 500);

        chrome.storage.onChanged.addListener((changes) => {
            if (changes.active) {
                this.isActive = changes.active.newValue;
            } else if (changes.autoDetect) {
                this.config.autoDetect = changes.autoDetect.newValue;
            } else if (changes.gender) {
                this.config.defaultGender = changes.gender.newValue;
                this.config.altGender = changes.gender.oldValue;
            } else if (changes.rate) {
                this.config.rate = changes.rate.newValue;
            }
            this.config.setLanguageDefaults();
        });
        let inputFieldEls = document.getElementsByTagName('input'),
            linkEls = document.getElementsByTagName('a'),
            buttonEls = document.getElementsByTagName('button'),
            selectFieldEls = document.getElementsByTagName('select'),
            i;

        for (i in inputFieldEls) {
            if (inputFieldEls.hasOwnProperty(i) && inputFieldEls[i].type !== 'hidden') {
                inputFieldEls[i].addEventListener('focus', e => this.bindEventToInputField(e));
            }
        }

        for (i in linkEls) {
            if (linkEls.hasOwnProperty(i) && linkEls[i].type !== 'hidden') {
                linkEls[i].addEventListener('focus', e => this.bindEventToInputField(e));
            }
        }

        for (i in buttonEls) {
            if (buttonEls.hasOwnProperty(i) && buttonEls[i].type !== 'hidden') {
                buttonEls[i].addEventListener('focus', e => this.bindEventToInputField(e));
            }
        }

        for (i in selectFieldEls) {
            if (selectFieldEls.hasOwnProperty(i) && selectFieldEls[i].type !== 'hidden') {
                selectFieldEls[i].addEventListener('click', e => this.onSelectMenuClicked(e));
                selectFieldEls[i].addEventListener('change', e => this.onSelectMenuChanged(e));
            }
        }

        document.addEventListener('mouseover', e => this.onMouseOver(e), true);
        document.addEventListener('keydown', e => this.onKeyDown(e));
    }
}

new Sokhan();