/* globals speechSynthesis, SpeechSynthesisUtterance */
let speech = new SpeechSynthesisUtterance('');

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
    }
};