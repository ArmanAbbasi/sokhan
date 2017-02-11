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

class Sokhan {
    constructor() {
        this.isSokhanActive = true;
        this.foundTextTimeout = null;

        chrome.storage.sync.get('active', resp => {
            this.isSokhanActive = (typeof resp.active === 'boolean' ? resp.active : true);
        });

        document.addEventListener('readystatechange', () => {
            if (document.readyState === 'complete') {
                this.init();
            }
        });
    }

    findParentLink(target) {
        let i = 0;
        let tmp = target;

        while (target && target.tagName !== 'A' && i < 5) {
            tmp = tmp.parentElement;
            if (tmp.tagName === 'A') {
                break;
            }
            i += 1;
        }

        return tmp.tagName === 'A' ? tmp : target;
    }

    getAttribute(el, refAttr) {
        while(el && el.parentElement) {
            if (el.getAttribute(refAttr)) {
                return el.getAttribute(refAttr);
            } else {
                el = el.parentElement;
            }
        }
        return false;
    }

    onMouseOver(e) {
        let self = this;
        if (this.foundTextTimeout) {
            clearTimeout(this.foundTextTimeout);
        }

        this.foundTextTimeout = setTimeout(function() {
            self.analyseElementAndFindText(e.target);
        }, 250);
    }

    handleSpecialElements(el, isOnLoad) {
        let text = '',
            numItems;

        if (el.tagName === 'SPAN' || el.tagName === 'DIV' || el.tagName === 'IMG') {
            if (el.tagName !== 'IMG' || (el.tagName === 'IMG' && !el.alt)) {
                el = this.findParentLink(el);
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
        let text = (this.getAttribute(el, 'aria-label') || el.textContent || el.alt || '').trim(),
            largeSpaces = text && text.match(/\s{2,}/g),
            largeSpacesSum = largeSpaces && largeSpaces.length;


        if (text && text.length > 2 && largeSpacesSum < 4 && text.indexOf('<div>') === -1 && text.indexOf('<span>') === -1) {
            this.stopSpeech();
            this.sokhan(text);
        }
    }

    analyseElementAndFindText(target, isOnLoad) {
        if (this.getAttribute(target, 'aria-hidden')) { return; }
        this[config.elementTextMap[target.tagName] ? 'handleSpecialElements' : 'handleTextFields'].call(this, target, isOnLoad);
    }

    getTextForTypeOfElement(el) {
        let title = config.elementTextMap[el.tagName];
        let self = this;
        return (typeof title === 'string' ? title : (function () {
            let labelEl = document.querySelector('[for="' + el.id + '"]');
            let text = (labelEl && labelEl.textContent) || '';
            let checked = (el.type === 'checkbox' || el.type === 'radio') ? (el.checked ? 'checked': 'unchecked') : '';
            let relatedText = text ? (' for ' + text) : '';

            return self.config.elementTextMap[el.tagName][el.type] + checked + relatedText;
        }()));
    }

    stopSpeech() {
        speechSynthesis.cancel();
    }

    sokhan(text) {
        if (!this.isSokhanActive) {
            return;
        }

        //Bug in Chrome makes browser crash.
        text = text.replace(/\.\w+/, function (match) {
            return match.replace('.', ' . ');
        });

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
        let el = e.currentTarget,
            str = 'Selection menu changed to ' + (el.selectedOptions[0].textContent || el.getAttribute('aria-label') || 'not defined');

        this.sokhan(str);
    }

    init() {
        let self = this;
        this.sokhan(document.title || document.querySelector('h1').textContent || 'unknown website title ');
        setTimeout(function () {
            self.analyseElementAndFindText(document.activeElement, true);
        }, 500);

        chrome.storage.onChanged.addListener(function(changes) {
            if (changes.active) {
                self.isActive = changes.active.newValue;
            } else if (changes.autoDetect) {
                self.config.autoDetect = changes.autoDetect.newValue;
            } else if (changes.gender) {
                self.config.defaultGender = changes.gender.newValue;
                self.config.altGender = changes.gender.oldValue;
            } else if (changes.rate) {
                self.config.rate = changes.rate.newValue;
            }
            self.config.setLanguageDefaults();
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