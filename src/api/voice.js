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
    setVoice: (lang) => {
        let voices = speechSynthesis.getVoices();

        speech.voice = voices.filter((voice) => voice.name === preferredVoices[lang.toLowerCase()].male)[0];
    },
    onLoaded: (callback) => {
        speechSynthesis.addEventListener('voiceschanged', callback);
    }
};