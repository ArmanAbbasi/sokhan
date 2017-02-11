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

const config = () => {
    let Speech = window.SpeechSynthesisUtterance;
    let siteMetaTag = document.documentElement && document.documentElement.getAttribute('lang');
    let regMetaTag = siteMetaTag && /[a-z]+/.exec(siteMetaTag);
    let chosenMetaTag = regMetaTag && regMetaTag[0];

    let config = {
        defaultGender: 'male',
        defaultLang: 'en',
        altGender: 'female',
        autoDetect: true,
        rate: 1.3,
        availableVoices: {
            'en': { //English
                male: 'Daniel',
                female: 'Google UK English Female'
            },
            'nl': { //Dutch
                male: 'Xander',
                female: 'Google Nederlands'
            },
            'id': { //Indonesian
                male: '',
                female: 'Damayanti'
            },
            'fr': { //French
                male: 'Thomas',
                female: 'Google français'
            },
            'ja': { //Japanese
                male: '',
                female: 'Kyoko'
            },
            'hi': { //Indian
                male: '',
                female: 'Lekha'
            },
            'de': { //German
                male: '',
                female: 'Google Deutsch'
            },
            'sv': { //Swedish
                male: 'Alva',
                female: ''
            },
            'it': { //Italian
                male: 'Alice',
                female: ''
            },
            'ar': { //Arabic
                male: 'Maged',
                female: ''
            },
            'es': { //Spanish
                male: 'Diego',
                female: 'Monica'
            },
            'ro': { //Romenian
                male: '',
                female: 'Ioana'
            },
            'pt': { //Portugeuse
                male: '',
                female: 'Joana'
            },
            'th': { //Thai
                male: '',
                female: 'Kanya'
            },
            'sk': { //Slovak
                male: '',
                female: 'Laura'
            },
            'hu': { //Hungarian
                male: '',
                female: 'Mariska'
            },
            'zh': { //Chinese
                male: '',
                female: 'Ting-Ting'
            },
            'el': { //Greek
                male: '',
                female: 'Melina'
            },
            'da': { //Danish
                male: '',
                female: 'Sara'
            },
            'fi': { //Finish
                male: '',
                female: 'Satu'
            },
            'tr': { //Turkish
                male: '',
                female: 'Yelda'
            },
            'cs': { //Czech
                male: '',
                female: 'Zuzana'
            },
            'pl': { //Polish
                male: '',
                female: 'Zosia'
            },
            'ko': { //Korean
                male: '',
                female: 'Yuna'
            },
            'nb': { //Norwegian
                male: '',
                female: 'Nora'
            },
            'ru': { //Russian
                male: '',
                female: 'Milena'
            }
        },
        elementTextMap: {
            'BUTTON': 'Button',
            'A': 'Link',
            'IMG': 'Image',
            'SELECT': 'Selection menu',
            'INPUT': {
                'text': 'Text input',
                'radio': 'Selection button',
                'checkbox': 'Checkbox',
                'number': 'Numerical input',
                'submit': 'Submit button',
                'password': 'Password input',
                'email': 'Email input',
                'search': 'Search input',
                'tel': 'Phone input',
                'date': 'Date input',
                'textarea': 'Text area input'
            }
        },
        langMetaTag: chosenMetaTag
    };

    chrome.storage.sync.get('languageSelection', resp => {
        config.defaultLang = resp.languageSelection || 'en';
    });

    chrome.storage.sync.get('gender', (resp) => {
        if (!resp.gender) {
            config.defaultGender = 'female';
            config.altGender = 'male';
            config.setLanguageDefaults();
        }
    });

    chrome.storage.sync.get('rate', (resp) => {
        config.rate = resp.rate;
        config.setLanguageDefaults();
    });

    chrome.storage.sync.get('autoDetect', (resp) => {
        if (!resp.autoDetect) {
            config.autoDetect =  resp.autoDetect;
        }
    });

    if (!config.langMetaTag && config.autoDetect) {
        var p = document.getElementsByTagName('p'),
            pText,
            i,
            num = 0;

        for (i in p) {
            if (p.hasOwnProperty(i)) {
                pText = p && p[0] && p[0].textContent;
                if (pText) {
                    if (num === 3) { break; }
                    chrome.i18n.detectLanguage(pText, (lang) => {
                        if (lang && lang.isReliable && lang.languages.length && lang.languages[0].percentage > 50) {
                            config.langMetaTag = lang.languages[0].language;
                            config.setLanguageDefaults();
                        }
                    });
                }
                num += 1;
            }
        }
    }

    config.fallbackVoice = config.availableVoices[config.defaultLang][config.defaultGender] || config.availableVoices[config.defaultLang][config.altGender];
    config.setLanguageDefaults = function () {
        let foundVoice = (function () {
            let langMeta = config.langMetaTag,
                isLangFound = config.availableVoices[langMeta] || config.availableVoices[config.defaultLang],
                isVoiceFound = isLangFound ? (isLangFound[config.defaultGender] || isLangFound[config.altGender]) : '';

            return isVoiceFound;
        }());

        config.utter = new Speech('');
        config.voices = window.speechSynthesis.getVoices();
        config.utter.voice = config.voices.filter(function (voice) {
            return voice.name === foundVoice;
        })[0];
        config.utter.rate = config.rate;
    };

    return config;
};

export default config;