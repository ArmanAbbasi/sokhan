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
/* globals speechSynthesis, SpeechSynthesisUtterance */

let speech = new SpeechSynthesisUtterance('');
const preferredVoices = {
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
};

let state = {
    gender: 'male',
    fallbackLanguage: 'en',
    active: true,
    speed: 1.0
};

export default {
    speak: (text) => {
        speech.text = text;
        speechSynthesis.speak(speech);
    },
    stop: () => {
        return speechSynthesis.cancel();
    },
    isSpeaking: () => {
        return speechSynthesis.speaking;
    },
    setVoice: (lang, gender) => {
        let voices = speechSynthesis.getVoices();
        let preferredLangObj = preferredVoices[lang.toLowerCase()];
        let altGender = state.gender === 'male' ? 'female' : 'male';

        speech.voice = voices.filter((voice) => voice.name === (preferredLangObj[state.gender] || preferredLangObj[altGender]))[0];
    },
    setGender: (genderBool) => {
        state.gender = genderBool ? 'male' : 'female';
    },
    setFallbackLanguage: (lang) => {
        state.fallbackLanguage = lang;
    },
    setSpeed: () => {

    },
    setActive: (isActive) => {
        state.active = isActive;
    },
    getVoices: () => {
        return new Promise((resolve) => {
            speechSynthesis.addEventListener('voiceschanged', () => {
                resolve(speechSynthesis.getVoices());
            });
        });
    }
};